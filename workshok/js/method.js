/* Campo di deformazione: griglia che si piega in loop fluido.
   Usato da #method-grid (METODO) e da ogni canvas[data-field] (es. "nessun corso attivo").
   Due forze sovrapposte, entrambe periodiche su LOOP ms (loop perfetto, senza scatti):
   - onda lenta che fa ondeggiare il reticolo come un tessuto
   - "lente" che percorre un otto (Lissajous 1:2) e gonfia la griglia dove passa
   Si ferma fuori schermo; con reduced-motion resta un fotogramma fermo. */
(function () {
  "use strict";
  var list = [document.getElementById("method-grid")].concat([].slice.call(document.querySelectorAll("canvas[data-field]")));
  list.forEach(function (c) { if (c) initField(c, c.id === "method-grid" ? document.getElementById("method-t") : null, false); });
  [].slice.call(document.querySelectorAll("canvas[data-spiral]")).forEach(function (c) { initField(c, null, true); });

  // spiral = true: vortice (twirl) al centro che si avvolge e si svolge, al posto della lente
  function initField(canvas, readout, spiral) {
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#0c00ff";

  var LOOP = 14000;          // durata del ciclo (ms)
  // reticolo: celle circa quadrate, adattate alla forma del canvas
  var COLS = 18, ROWS = 13;
  var SEG = 28;              // suddivisioni per linea (curve morbide ma leggere)
  var W = 0, H = 0, DPR = 1;
  var PX = 0, PY = 0;        // uscita di field(): niente array allocati per ogni punto

  function fit() {
    // la spirale di sfondo (semitrasparente) basta a risoluzione normale; le altre max 1.5x
    DPR = spiral ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var cell = spiral ? 44 : 34;
    if (W && H) { COLS = Math.max(10, Math.round(W / cell)); ROWS = Math.max(6, Math.round(H / cell)); }
  }

  // centro del vortice: segue piano il mouse (solo desktop), altrimenti resta al centro
  var mx = 0.5, my = 0.5, cx0 = 0.5, cy0 = 0.5;
  if (spiral && !(window.matchMedia && matchMedia("(pointer: coarse)").matches)) {
    var host = canvas.parentNode;
    host.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mx = 0.5 + ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      my = 0.5 + ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    }, { passive: true });
    host.addEventListener("mouseleave", function () { mx = my = 0.5; });
  }

  // vortice: ruota il punto attorno al centro, di più vicino al centro, bordi fermi
  function twirl(u, v, ph) {
    var ar = W / (H || 1), dx = (u - cx0) * ar, dy = v - cy0;
    var r2 = dx * dx + dy * dy;
    var a = (1.35 * Math.sin(ph) + 0.35 * Math.sin(2 * ph + 0.8)) * Math.exp(-r2 / 0.12);
    var c = Math.cos(a), s = Math.sin(a);
    var pin = Math.pow(Math.sin(Math.PI * u) * Math.sin(Math.PI * v), 0.35);
    var nx = (dx * c - dy * s) / ar + cx0, ny = dx * s + dy * c + cy0;
    // respiro radiale leggero
    var k = 1 + 0.04 * Math.sin(ph * 2) * Math.exp(-r2 / 0.05);
    nx = cx0 + (nx - cx0) * k; ny = cy0 + (ny - cy0) * k;
    PX = (u + (nx - u) * pin) * W; PY = (v + (ny - v) * pin) * H;
  }

  // campo: (u,v) in [0,1] -> punto deformato in px
  function field(u, v, ph, lx, ly) {
    if (spiral) { twirl(u, v, ph); return; }
    var TAU = Math.PI * 2;
    // onda: spostamenti piccoli e lenti
    var ax = 0.018 * Math.sin(TAU * (v * 1.3) + ph) + 0.008 * Math.sin(TAU * (u * 2.1 - v) + 2 * ph);
    var ay = 0.02 * Math.sin(TAU * (u * 1.1) + ph + 1.3) + 0.008 * Math.cos(TAU * (v * 1.7 + u) - ph);
    // lente: rigonfiamento radiale attorno a (lx,ly)
    var dx = u - lx, dy = (v - ly) * (H / W), r2 = dx * dx + dy * dy;
    var k = 0.15 * Math.exp(-r2 / 0.03);
    // bordi fermi: la deformazione si spegne verso la cornice (campo incorniciato)
    var pin = Math.pow(Math.sin(Math.PI * u) * Math.sin(Math.PI * v), 0.5);
    PX = (u + (ax + dx * k * 2.2) * pin) * W; PY = (v + (ay + (v - ly) * k * 2.2) * pin) * H;
  }

  function draw(t) {
    var ph = (t % LOOP) / LOOP * Math.PI * 2;
    if (spiral) { cx0 += (mx - cx0) * 0.04; cy0 += (my - cy0) * 0.04; }
    var lx = 0.5 + 0.3 * Math.cos(ph), ly = 0.5 + 0.26 * Math.sin(2 * ph);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.lineJoin = "round";
    var i, j;
    // tutto il reticolo in UN solo tracciato e un solo stroke (prima: uno per linea)
    ctx.beginPath();
    for (j = 0; j <= ROWS; j++) {
      for (i = 0; i <= SEG; i++) { field(i / SEG, j / ROWS, ph, lx, ly); i ? ctx.lineTo(PX, PY) : ctx.moveTo(PX, PY); }
    }
    for (i = 0; i <= COLS; i++) {
      for (j = 0; j <= SEG; j++) { field(i / COLS, j / SEG, ph, lx, ly); j ? ctx.lineTo(PX, PY) : ctx.moveTo(PX, PY); }
    }
    ctx.stroke();
    if (spiral) return;
    // nodi pieni vicino al centro della lente
    ctx.fillStyle = ink;
    for (j = 0; j <= ROWS; j++) for (i = 0; i <= COLS; i++) {
      var u = i / COLS, v = j / ROWS, dd = (u - lx) * (u - lx) + (v - ly) * (v - ly) * (H / W) * (H / W);
      if (dd < 0.012) { field(u, v, ph, lx, ly); ctx.fillRect(PX - 2, PY - 2, 4, 4); }
    }
    // mirino sul centro della lente
    var cx = lx * W, cy = ly * H;
    ctx.beginPath(); ctx.moveTo(cx - 9, cy); ctx.lineTo(cx + 9, cy); ctx.moveTo(cx, cy - 9); ctx.lineTo(cx, cy + 9); ctx.stroke();
    ctx.strokeRect(cx - 4.5, cy - 4.5, 9, 9);
    if (readout) readout.textContent = "t " + ((t % LOOP) / 1000).toFixed(2).padStart(5, "0") + " / " + (LOOP / 1000).toFixed(2);
  }

  fit();
  window.addEventListener("resize", function () { fit(); draw(last); });

  // ~30 fotogrammi al secondo: per un movimento così lento non si nota, e dimezza il lavoro
  var last = 3000, raf = 0, visible = true, t0 = null, drawn = 0;
  function frame(now) {
    if (t0 === null) t0 = now - last;
    last = now - t0;
    if (now - drawn >= 32) { drawn = now; draw(last); }
    raf = visible ? requestAnimationFrame(frame) : 0;
  }
  if (reduce || !W) { draw(last); if (!W) requestAnimationFrame(function () { fit(); draw(last); }); if (reduce) return; }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) { t0 = null; raf = requestAnimationFrame(frame); }
    }).observe(canvas);
  }
  raf = requestAnimationFrame(frame);
  }
})();
