/* Strumenti lo-fi sotto il titolo della pagina progetti: radar + battito.
   Disegnati a bassa risoluzione (PX) e ingranditi con image-rendering:pixelated.
   Si fermano fuori schermo; con reduced-motion restano un fotogramma fermo. */
(() => {
  "use strict";
  const INK = "#16140f", LINE = "#c9c4b6", STAMP = "#b83b2e";
  const PX = 2;                                   // 1 pixel canvas = 2 pixel schermo
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n, k) => String(Math.round(n)).padStart(k || 2, "0");
  const voci = () => document.querySelectorAll(".ix-row").length;

  function setup(canvas) {
    const ctx = canvas.getContext("2d");
    const fit = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth / PX));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight / PX));
      ctx.imageSmoothingEnabled = false;
    };
    fit();
    addEventListener("resize", fit);
    return ctx;
  }

  // carta millimetrata: punti ogni 6 px canvas
  function grid(ctx, w, h) {
    ctx.fillStyle = LINE;
    for (let x = 0; x < w; x += 6) for (let y = 0; y < h; y += 6) ctx.fillRect(x, y, 1, 1);
  }

  /* ---- radar rettangolare: linea di scansione che attraversa il riquadro da sinistra
     a destra, con scia; i bersagli (uno per progetto) si accendono al passaggio ---- */
  const rc = document.getElementById("scope-radar");
  const rr = document.getElementById("scope-radar-r");
  let radar = null;
  if (rc) {
    const ctx = setup(rc);
    // bersagli fissi e pseudo-casuali (stessa disposizione a ogni visita)
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 20; i++) rnd();              // i primi valori di questo generatore sono tutti piccoli
    const blips = Array.from({ length: 67 }, () => ({ x: rnd(), y: 0.15 + rnd() * 0.7, hit: -1e9 }));
    const SWEEP = 3200;                                // ms per attraversare il riquadro
    let found = 0;
    radar = (t) => {
      const w = rc.width, h = rc.height;
      const pos = (t % SWEEP) / SWEEP, sx = Math.floor(pos * w);
      ctx.clearRect(0, 0, w, h);
      grid(ctx, w, h);
      // reticolo: linea d'orizzonte + tacche di distanza in basso
      ctx.fillStyle = INK;
      for (let x = 0; x < w; x += 2) ctx.fillRect(x, Math.round(h / 2), 1, 1);
      for (let x = 0; x < w; x += 6) ctx.fillRect(x, h - 1, 1, x % 30 === 0 ? -4 : -2);
      // scia della scansione
      for (let k = 1; k < 26; k++) {
        const x = sx - k; if (x < 0) break;
        ctx.fillStyle = "rgba(22,20,15," + (0.2 * (1 - k / 26)).toFixed(3) + ")";
        ctx.fillRect(x, 0, 1, h);
      }
      ctx.fillStyle = INK; ctx.fillRect(sx, 0, 1, h);
      // bersagli
      const n = Math.min(blips.length, voci() || blips.length);
      found = 0;
      for (let i = 0; i < n; i++) {
        const b = blips[i], bx = Math.floor(b.x * w), by = Math.floor(b.y * h);
        if (bx === sx || (bx < sx && bx >= sx - 2)) b.hit = t;
        const age = (t - b.hit) / (SWEEP * 0.8);
        if (age < 1) {
          found++;
          ctx.fillStyle = age < 0.12 ? STAMP : "rgba(22,20,15," + (1 - age).toFixed(2) + ")";
          ctx.fillRect(bx - 1, by - 1, 2, 2);
        }
      }
      if (rr) rr.textContent = "rng " + pad(pos * 100, 3) + " · tgt " + pad(n) + " · vis " + pad(found);
    };
  }

  /* ---- battito: tracciato che scorre, complesso QRS ogni ~0.83 s (72 bpm) ---- */
  const ec = document.getElementById("scope-ecg");
  const er = document.getElementById("scope-ecg-r");
  let ecg = null;
  if (ec) {
    const ctx = setup(ec);
    const BPM = 72, period = 60000 / BPM;
    // forma di un battito in [0,1): onda P, QRS, onda T
    const beat = (p) => {
      if (p < 0.10) return Math.sin(p / 0.10 * Math.PI) * 0.12;
      if (p < 0.16) return 0;
      if (p < 0.19) return -(p - 0.16) / 0.03 * 0.18;
      if (p < 0.23) return -0.18 + (p - 0.19) / 0.04 * 1.18;
      if (p < 0.27) return 1 - (p - 0.23) / 0.04 * 1.32;
      if (p < 0.30) return -0.32 + (p - 0.27) / 0.03 * 0.32;
      if (p < 0.42) return 0;
      if (p < 0.58) return Math.sin((p - 0.42) / 0.16 * Math.PI) * 0.26;
      return 0;
    };
    let head = 0, lastE = 0, prevY = null;
    const trace = [];                                  // un valore per colonna di pixel
    ecg = (t) => {
      const w = ec.width, h = ec.height, mid = Math.round(h * 0.58), amp = h * 0.42;
      if (trace.length !== w) { trace.length = w; trace.fill(null); head = 0; }
      const dt = lastE ? Math.min(100, t - lastE) : 16; lastE = t;
      // avanza di ~1 colonna ogni 12 ms (effetto monitor che "scrive" da sinistra)
      const steps = Math.max(1, Math.round(dt / 12));
      for (let s = 0; s < steps; s++) {
        const tt = t - (steps - 1 - s) * 12;
        trace[head] = Math.round(mid - beat((tt % period) / period) * amp);
        head = (head + 1) % w;
        for (let k = 0; k < 6; k++) trace[(head + k) % w] = null;   // spazio vuoto davanti alla penna
      }
      ctx.clearRect(0, 0, w, h);
      grid(ctx, w, h);
      ctx.fillStyle = INK;
      prevY = null;
      for (let x = 0; x < w; x++) {
        const y = trace[x];
        if (y == null) { prevY = null; continue; }
        const a = prevY == null ? y : prevY, lo = Math.min(a, y), hi = Math.max(a, y);
        ctx.fillRect(x, lo, 1, hi - lo + 1);          // collega i punti con segmenti verticali
        prevY = y;
      }
      const px = (head - 1 + w) % w;
      if (trace[px] != null) { ctx.fillStyle = STAMP; ctx.fillRect(px - 1, trace[px] - 1, 3, 3); }
      const on = (t % period) / period < 0.3;
      if (er) er.textContent = (on ? "■" : "□") + " " + BPM + " bpm · lead ii";
    };
  }

  // loop unico, fermo quando gli strumenti non sono visibili
  let visible = true, raf = 0;
  const frame = (t) => { if (radar) radar(t); if (ecg) ecg(t); raf = visible && !reduce ? requestAnimationFrame(frame) : 0; };
  const panel = document.querySelector(".ix-scope");
  if (panel && "IntersectionObserver" in window) {
    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !raf && !reduce) raf = requestAnimationFrame(frame);
    }).observe(panel);
  }
  if (reduce) { const t = 1800; if (radar) radar(t); if (ecg) { for (let i = 0; i < 200; i++) ecg(t + i * 12); } }
  else raf = requestAnimationFrame(frame);
})();
