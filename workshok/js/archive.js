/* ARCHIVIO · timeline orizzontale dei corsi realizzati + stratigrafia animata.
   - dati: window.ARCHIVE (data/courses.js), dal più recente al più vecchio
   - le miniature poggiano su una "sezione di terreno": ogni anno è uno strato
     con il suo tratteggio; il tratteggio scorre con la timeline e deriva piano
   - click su una miniatura = si allarga e mostra descrizione, info, foto
   - se non ci sono corsi attivi (window.COURSES vuoto) mostra il messaggio
     "Nessun corso attivo" al posto delle card nella sezione 01 */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  var pad = function (n) { return String(n).padStart(2, "0"); };

  /* ---------- 01 · nessun corso attivo ---------- */
  if (!(window.COURSES || []).length) {
    var cards = $("cards"), empty = $("nocourse"), meta = $("corsi-meta");
    if (cards) cards.hidden = true;
    if (empty) empty.hidden = false;
    if (meta) meta.textContent = "// nessuna edizione aperta · archivio qui sotto";
  }

  /* ---------- 02 · archivio ---------- */
  var track = $("arch-track"), cv = $("arch-strata");
  var data = window.ARCHIVE || [];
  if (!track || !cv || !data.length) return;
  var total = data.reduce(function (s, y) { return s + y.courses.length; }, 0);
  var st = $("arch-status"); if (st) st.textContent = "[ " + pad(total) + " CORSI · " + pad(data.length) + (data.length > 1 ? " ANNI" : " ANNO") + " ]";

  track.innerHTML = data.map(function (y, yi) {
    return '<div class="arch__year" data-year="' + y.year + '">' +
      '<header class="arch__yhead"><b>' + y.year + '</b><span>' + esc(y.edition) + " · " + esc(y.title) + "<br>" + esc(y.place) + " · " + esc(y.dates) + "</span></header>" +
      '<div class="arch__items">' + y.courses.map(function (c, ci) {
        var media = ((c.media && c.media.items) || []).slice(0, 4).map(function (m) {
          return '<img loading="lazy" alt="" src="' + esc(m.poster || m.src) + '">';
        }).join("");
        var info = [["Docente", c.tutor], ["Strumento", c.tool], ["Durata", c.days || c.hours], ["Luogo", c.location]]
          .filter(function (r) { return r[1]; })
          .map(function (r) { return "<li><b>" + r[0] + "</b><span>" + esc(r[1]) + "</span></li>"; }).join("");
        return '<article class="arch__item" data-y="' + yi + '">' +
          '<button type="button" class="arch__hit" aria-expanded="false" aria-label="Apri ' + esc(c.title) + '"></button>' +
          '<div class="arch__ph"><img loading="lazy" alt="' + esc(c.title) + '" src="' + esc(c.thumb || "") + '"></div>' +
          '<div class="arch__meta"><span class="arch__code">' + esc(y.edition) + " / " + esc(c.number || pad(ci + 1)) + "</span>" +
            "<h3>" + esc(c.title) + "</h3><p>" + esc(c.tutor) + "</p></div>" +
          '<div class="arch__more">' +
            '<p class="arch__sum">' + esc(c.summary || c.blurb || "") + "</p>" +
            '<ul class="arch__info">' + info + "</ul>" +
            (media ? '<div class="arch__media">' + media + "</div>" : "") +
          "</div>" +
        "</article>";
      }).join("") + "</div></div>";
  }).join("");

  // click = si allarga (uno alla volta); di nuovo = si richiude
  track.addEventListener("click", function (e) {
    if (dragged) return;
    var hit = e.target.closest(".arch__hit"); if (!hit) return;
    var item = hit.parentNode, open = !item.classList.contains("is-open");
    track.querySelectorAll(".arch__item.is-open").forEach(function (o) { o.classList.remove("is-open"); o.firstChild.setAttribute("aria-expanded", "false"); });
    if (open) {
      item.classList.add("is-open"); hit.setAttribute("aria-expanded", "true");
      // porta la card aperta in vista, a transizione finita
      setTimeout(function () {
        var l = item.offsetLeft - track.offsetLeft - 16;
        if (l < track.scrollLeft || l + item.offsetWidth > track.scrollLeft + track.clientWidth) track.scrollTo({ left: l, behavior: reduce ? "auto" : "smooth" });
      }, 420);
    }
  });

  // trascinamento col mouse (touch e trackpad scorrono da soli)
  var down = null, dragged = false;
  track.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = { x: e.clientX, l: track.scrollLeft }; dragged = false;
  });
  window.addEventListener("pointermove", function (e) {
    if (!down) return;
    var dx = e.clientX - down.x;
    if (Math.abs(dx) > 5) { dragged = true; track.classList.add("is-drag"); }
    if (dragged) track.scrollLeft = down.l - dx;
  });
  window.addEventListener("pointerup", function () {
    if (!down) return;
    down = null; track.classList.remove("is-drag");
    setTimeout(function () { dragged = false; }, 0);
  });
  var step = function (d) { track.scrollBy({ left: d * track.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" }); };
  if ($("arch-prev")) $("arch-prev").addEventListener("click", function () { step(-1); });
  if ($("arch-next")) $("arch-next").addEventListener("click", function () { step(1); });

  /* ---------- stratigrafia: canvas sotto la timeline ---------- */
  // larghezza visibile della timeline: la card aperta non deve superarla (mobile)
  var setW = function () { track.style.setProperty("--arch-w", track.clientWidth + "px"); };
  setW(); window.addEventListener("resize", setW);

  var ctx = cv.getContext("2d"), depth = $("arch-depth");
  var ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#0c00ff";
  var W = 0, H = 0, DPR = 1;
  function fit() {
    DPR = 1;                            // tratteggio a pixel pieni: lo-fi e leggero
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  // tratteggi degli strati (uno per anno, poi si ripetono): diagonale, puntinato, croce, orizzontale, diagonale fitto
  var HATCH = [
    function (x, y) { return (x + y) % 9 === 0; },
    function (x, y) { return x % 6 === 0 && y % 6 === 0; },
    function (x, y) { return (x - y) % 10 === 0 || (x + y) % 10 === 0; },
    function (x, y) { return y % 5 === 0 && x % 3 !== 0; },
    function (x, y) { return (x + 2 * y) % 7 === 0; },
  ];
  // ogni tratteggio disegnato UNA volta su un tassello che si ripete (pattern);
  // a ogni fotogramma cambia solo lo spostamento, niente calcoli pixel per pixel
  var PERIOD = [9, 6, 10, 15, 7];
  var PAT = HATCH.map(function (f, i) {
    var n = PERIOD[i], tile = document.createElement("canvas");
    tile.width = tile.height = n;
    var tc = tile.getContext("2d"); tc.fillStyle = ink;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (f(x, y)) tc.fillRect(x, y, 1, 1);
    return ctx.createPattern(tile, "repeat");
  });
  var years = [].slice.call(track.querySelectorAll(".arch__year"));
  var RULER = 18;                       // altezza righello sotto gli strati

  function draw(t) {
    if (!W) fit();
    var sl = track.scrollLeft, drift = reduce ? 0 : Math.round(t / 90);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ink;
    var gh = H - RULER;                 // altezza del terreno
    // bande: da inizio anno a inizio anno successivo (l'ultimo fino a fine canvas)
    var xs = years.map(function (y) { return y.offsetLeft - track.offsetLeft - sl; });
    xs.forEach(function (x0, i) {
      var x1 = i + 1 < xs.length ? xs[i + 1] : W + 40;
      var a = Math.max(0, Math.floor(x0)), b = Math.min(W, Math.ceil(x1));
      if (b <= a) return;
      var pat = PAT[i % PAT.length], off = Math.round(sl) + drift * (i % 2 ? -1 : 1);
      if (pat.setTransform && window.DOMMatrix) pat.setTransform(new DOMMatrix().translate(-off, 0));
      ctx.fillStyle = pat; ctx.fillRect(a, 3, b - a, gh - 3);
      ctx.fillStyle = ink;
      ctx.fillRect(a, 0, 1.5, gh);      // confine tra strati
      ctx.font = "10px 'Space Mono', monospace";
      ctx.fillText(String(data[i].year) + " · −" + pad(i), a + 6, gh + 13);
    });
    ctx.fillRect(0, 0, W, 1.5);         // linea di terra
    ctx.fillRect(0, gh, W, 1);
    // righello: tacche ogni 20px che scorrono con la timeline
    for (var rx = -(Math.round(sl) % 20); rx < W; rx += 20) ctx.fillRect(rx, gh, 1, ((Math.round(sl) + rx) / 20) % 5 === 0 ? 7 : 3);
    // linea di sezione al centro della vista
    var cx = Math.round(W / 2);
    ctx.fillRect(cx, 0, 1, gh);
    ctx.fillRect(cx - 4, 0, 9, 1.5);
    // anno sotto la linea di sezione
    var cur = 0; xs.forEach(function (x, i) { if (x <= cx) cur = i; });
    if (depth) depth.textContent = "SEZ. A-A · " + data[cur].year + " · profondità " + pad(cur) + (cur === 1 ? " anno" : " anni");
  }

  var raf = 0, visible = true;
  var drawn = 0;
  function frame(t) {
    if (t - drawn >= 32) { drawn = t; draw(t); }   // ~30 fps
    raf = visible && !reduce ? requestAnimationFrame(frame) : 0;
  }
  fit();
  window.addEventListener("resize", function () { fit(); draw(performance.now()); });
  track.addEventListener("scroll", function () { if (reduce) draw(0); }, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(frame);
    }).observe(cv);
  }
  if (reduce) draw(0); else raf = requestAnimationFrame(frame);
})();
