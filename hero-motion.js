/* hero motion — loop di 14″ costruito sulla griglia (vedi .hm in styles.css) */
(() => {
  const LOOP = 14;
  const STAGGER = 0.032, IN = 0.6, OUT = 0.45;
  const LINES = [
    [ {w:"MULTI",        at:0.55, wght:820},
      {w:"DESIGN",       at:10.30, wght:820},
      {w:"",             at:12.55} ],
    [ {w:"DISCIPLINARY", at:0.85, wght:820, full:true, tag:"Disciplines"},
      {w:"GRAPHIC",      at:3.20, wght:900, tag:"01 / 05 — Graphic"},
      {w:"MOTION",       at:4.60, wght:240, tag:"02 / 05 — Motion"},
      {w:"WEB",          at:6.00, wght:100, tag:"03 / 05 — Web"},
      {w:"SPACE",        at:7.40, wght:560, tag:"04 / 05 — Space"},
      {w:"TYPE",         at:8.80, wght:900, tag:"05 / 05 — Type"},
      {w:"STUDIO",       at:10.42, wght:820, tag:"Surreo"},
      {w:"",             at:12.65} ],
  ];

  /* ---- forme: ogni disciplina ha una composizione costruita sui moduli (12 colonne × 3 righe).
     c0..c1 / r0..r1 = colonne e righe occupate. dir = da che lato entra la "tendina". ---- */
  const range = (n, f) => Array.from({ length: n }, (_, i) => f(i));
  // le scene si possono sostituire da fuori (window.HERO_SCENES) per provare composizioni diverse
  const SCENES = window.HERO_SCENES || [
    // DISCIPLINARY — indice: una barra per colonna, altezze a scalare
    range(12, (k) => ({ t:"rect", c0:k, c1:k, r0:0, r1:2, fh:(k + 1) / 12, dir:"up", fill:k === 11 ? "stamp" : "ink" })),
    // GRAPHIC — composizione svizzera: quarto, cerchio, pieno, fascia
    [ {t:"quarter", c0:0, c1:2, r0:0, r1:2, dir:"left"},
      {t:"circle",  c0:3, c1:5, r0:0, r1:2, dir:"up", fill:"stamp"},
      {t:"rect",    c0:6, c1:7, r0:0, r1:2, dir:"down"},
      {t:"rect",    c0:8, c1:11, r0:2, r1:2, dir:"right"},
      {t:"circle",  c0:10, c1:10, r0:0, r1:0, dir:"up"} ],
    // MOTION — cronofotografia: lo stesso quarto ruota di colonna in colonna, e continua a girare
    range(12, (k) => ({ t:"quarter", c0:k, c1:k, r0:1, r1:1, rot:k * 30, spin:true, dir:"up", fill:k === 11 ? "stamp" : "ink" })),
    // WEB — wireframe: testata, due card vuote, una piena
    [ {t:"rect", c0:0, c1:11, r0:0, r1:0, fh:.28, from:"top", dir:"right"},
      {t:"ring", c0:0, c1:3, r0:1, r1:2, dir:"up"},
      {t:"ring", c0:4, c1:7, r0:1, r1:2, dir:"up"},
      {t:"rect", c0:8, c1:11, r0:1, r1:2, dir:"up", fill:"stamp"},
      ...range(3, (k) => ({ t:"rect", c0:k * 4, c1:k * 4 + 1, r0:0, r1:0, fh:.12, from:"bottom", dir:"right" })) ],
    // SPACE — portico: quattro archi, uno rosso
    range(4, (k) => ({ t:"arch", c0:k * 3, c1:k * 3 + 2, r0:0, r1:2, dir:"up", fill:k === 1 ? "stamp" : "ink" })),
    // TYPE — aste: lo spessore cresce da 100 a 900 come l'asse wght
    range(12, (k) => ({ t:"rect", c0:k, c1:k, r0:0, r1:2, fw:.08 + .92 * k / 11, dir:"down", fill:k === 11 ? "stamp" : "ink" })),
    // DESIGN STUDIO — l'alfabeto delle forme usate, in fila
    [ {t:"circle",  c0:0, c1:2, r0:0, r1:2, dir:"up"},
      {t:"rect",    c0:3, c1:5, r0:0, r1:2, dir:"down"},
      {t:"quarter", c0:6, c1:8, r0:0, r1:2, dir:"left"},
      {t:"arch",    c0:9, c1:11, r0:0, r1:2, dir:"up", fill:"stamp"} ],
  ];
  const SWEEP = [10.95, 12.35];
  const GRID_IN = 0, GRID_OUT = 12.95;

  const hm = document.getElementById("hm");
  if (!hm) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const outExpo = (p) => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
  const inOut = (p) => p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3) / 2;
  const prog = (t, a, d) => clamp((t - a) / d, 0, 1);
  const NS = "http://www.w3.org/2000/svg";

  // metriche reali del font: dove cadono cima delle maiuscole e linea di base in uno span line-height:1
  let FM;
  function fontMetrics() {
    const c = document.createElement("canvas").getContext("2d");
    c.font = '900 100px "Archivo"';
    const m = c.measureText("MULTIDSCPNARYGHOWEBF");
    const asc = m.fontBoundingBoxAscent / 100, desc = m.fontBoundingBoxDescent / 100;
    const base = (1 - (asc + desc)) / 2 + asc;            // linea di base dal bordo alto dello span
    const cap = m.actualBoundingBoxAscent / 100;            // maiuscole + overshoot della O
    const under = Math.max(0, m.actualBoundingBoxDescent / 100);
    return { base, cap, under, capTop: base - cap };
  }

  let G;
  const meas = document.createElement("span");
  meas.style.cssText = "position:absolute;visibility:hidden;white-space:pre;font-family:Archivo;line-height:1;left:-9999px;top:0";
  document.body.appendChild(meas);
  function measure(word, wght, wdth, S) {
    meas.style.fontSize = S + "px";
    meas.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
    meas.innerHTML = [...word].map((c) => `<i style="font-style:normal">${c}</i>`).join("");
    return { width: meas.offsetWidth, xs: [...meas.children].map((k) => k.offsetLeft) };
  }
  function fit(word, wght, target, S) {
    let lo = 62, hi = 125;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (measure(word, wght, mid, S).width > target) hi = mid; else lo = mid; }
    return lo;
  }

  function layout() {
    const W = hm.clientWidth, H = hm.clientHeight;
    const cols = W < 640 ? 6 : 12;
    const lite = cols < 12;                              // mobile: niente forme, solo la griglia che si muove
    const gut = W < 640 ? 8 : clamp(W * 0.012, 10, 20);
    const colW = (W - gut * (cols - 1)) / cols;
    const spanW = (k) => k * colW + (k - 1) * gut;
    const colX = (i) => i * (colW + gut);

    const pad = 0.07;                                    // aria sopra/sotto la riga, in em
    const lineF = FM.cap + FM.under + pad * 2;           // altezza riga in em
    let S = 100 * W / measure("DISCIPLINARY", 820, 90, 100).width;
    S = Math.min(S, (H * 0.5) / (2 * lineF + 0.06));
    const lineH = Math.ceil(S * lineF);
    const gap = S * 0.03;
    const bottomPad = Math.max(36, H * 0.07);
    const y2 = H - bottomPad - lineH, y1 = y2 - gap - lineH;

    // area moduli: sotto i numeri di colonna, sopra la marginalia.
    // Su mobile le righe coprono tutto lo stage a moduli quasi quadrati, dietro al testo
    const aTop = 30, aBot = y1 - 40;
    let ROWS, rowH, rowY;
    if (lite) {
      ROWS = Math.max(4, Math.round((H - aTop) / (colW + gut)));
      rowH = (H - aTop) / ROWS;
      rowY = (r) => aTop + r * rowH;
    } else {
      ROWS = 3;
      rowH = (aBot - aTop - gut * (ROWS - 1)) / ROWS;
      rowY = (r) => aTop + r * (rowH + gut);
    }

    const words = LINES.map((seq) => seq.map((d) => {
      if (!d.w) return { ...d, xs: [], width: 0, wdth: 100, span: 0 };
      const w62 = measure(d.w, d.wght, 62, S).width, w125 = measure(d.w, d.wght, 125, S).width;
      const nat = measure(d.w, d.wght, 100, S).width;
      let k = 0, best = Infinity;
      for (let j = 1; j <= cols; j++) {
        const sw = spanW(j);
        if (sw < w62 || sw > w125) continue;
        const score = d.full ? -j : Math.abs(sw - nat);
        if (score < best) { best = score; k = j; }
      }
      const target = k ? spanW(k) : clamp(nat, w62, w125);
      const wdth = fit(d.w, d.wght, target, S);
      const m = measure(d.w, d.wght, wdth, S);
      return { ...d, wdth, xs: m.xs, width: m.width, span: k ? spanW(k) : m.width };
    }));

    // forme → pixel (solo desktop, 12×3)
    const scenes = SCENES.map((list) => lite ? [] : list.map((p) => {
      let x = colX(p.c0), w = colX(p.c1) + colW - x, y = rowY(p.r0), h = rowY(p.r1) + rowH - y;
      if (p.fw) w = Math.max(2, w * p.fw);
      if (p.fh) { const nh = Math.max(2, h * p.fh); if (p.from !== "top") y += h - nh; h = nh; }
      // sc = rimpicciolisce il modulo attorno al centro; dx/dy = spostamento in frazioni di modulo
      if (p.sc) { const cx = x + w / 2, cy = y + h / 2; w *= p.sc; h *= p.sc; x = cx - w / 2; y = cy - h / 2; }
      if (p.dx) x += p.dx * colW;
      if (p.dy) y += p.dy * rowH;
      return { ...p, x, y, w, h };
    }));

    G = { W, H, cols, lite, gut, colW, colX, S, lineH, pad, ys: [y1, y2], rowY, rowH, ROWS, words, scenes };
    build();
  }

  function shapeD(p) {
    const { x, y, w, h } = p;
    if (p.t === "rect" || p.t === "ring") return `M${x},${y}h${w}v${h}h${-w}Z`;
    if (p.t === "circle" || p.t === "o") { const r = Math.min(w, h) / 2, cx = x + w / 2, cy = y + h / 2;
      return `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`; }
    if (p.t === "quarter") { const r = Math.min(w, h), ox = x + (w - r) / 2, oy = y + (h - r) / 2;
      // centro del quarto nell'angolo in basso a sinistra del quadrato
      return `M${ox},${oy + r}V${oy}A${r},${r} 0 0 1 ${ox + r},${oy + r}Z`; }
    if (p.t === "arch") { const r = w / 2;
      return `M${x},${y + h}V${y + r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h}Z`; }
  }

  let layers = [];
  function build() {
    hm.innerHTML = "";
    layers = [];
    const { W, H, cols, lite, colW, colX, S, lineH, pad, ys, rowY, rowH, ROWS, words, scenes } = G;

    [["top","left"],["top","right"],["bottom","left"],["bottom","right"]].forEach(([v,h]) => {
      const c = document.createElement("i"); c.className = "hm__crop";
      c.style[v] = "-14px"; c.style[h] = "-14px";
      c.style[`border-${v === "top" ? "bottom" : "top"}-width`] = "1px";
      c.style[`border-${h === "left" ? "right" : "left"}-width`] = "1px";
      hm.appendChild(c);
    });

    const sweep = document.createElement("div"); sweep.className = "hm__sweep";
    sweep.style.width = colW + "px";

    ["ink", "inv"].forEach((kind) => {
      const L = document.createElement("div"); L.className = "hm__layer hm__layer--" + kind;
      const ref = { el: L, cols: [], rows: [], nums: [], lines: [], shapes: [] };
      if (kind === "ink") {
        for (let i = 0; i < cols; i++) {
          const c = document.createElement("i"); c.className = "hm__col";
          c.style.left = colX(i) + "px"; c.style.width = colW + "px";
          L.appendChild(c); ref.cols.push(c);
          const n = document.createElement("span"); n.className = "hm__num";
          n.textContent = String(i + 1).padStart(2, "0");
          n.style.left = colX(i) + 6 + "px"; n.style.top = "8px";
          L.appendChild(n); ref.nums.push(n);
        }
        for (let r = 0; r <= ROWS; r++) {           // linee orizzontali dei moduli
          const l = document.createElement("i"); l.className = "hm__row";
          l.style.top = (lite ? rowY(r) : r < ROWS ? rowY(r) : rowY(ROWS - 1) + rowH) + "px";
          L.appendChild(l); ref.rows.push(l);
        }
      }

      // forme
      if (lite) ref.shapes = scenes.map(() => []);
      else {
      const svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "hm__svg");
      svg.setAttribute("width", W); svg.setAttribute("height", H);
      ref.shapes = scenes.map((list) => list.map((p) => {
        const el = document.createElementNS(NS, "path");
        el.setAttribute("d", shapeD(p));
        const col = kind === "inv" ? (p.fill === "paper" ? "var(--ink)" : "var(--paper)") : p.fill === "stamp" ? "var(--stamp)" : p.fill === "paper" ? "var(--paper)" : "var(--ink)";
        if (p.t === "ring" || p.t === "o") { el.setAttribute("fill", "none"); el.setAttribute("stroke", col); el.setAttribute("stroke-width", "2"); el.setAttribute("vector-effect", "non-scaling-stroke"); }
        else el.setAttribute("fill", col);
        el.style.visibility = "hidden";
        svg.appendChild(el);
        return el;
      }));
      L.appendChild(svg);
      }

      words.forEach((seq, r) => {
        const line = document.createElement("div"); line.className = "hm__line";
        line.style.top = ys[r] + "px"; line.style.height = lineH + "px";
        const chs = seq.map((d) => [...d.w].map((c, i) => {
          const s = document.createElement("span"); s.className = "hm__ch"; s.textContent = c;
          s.style.fontSize = S + "px";
          s.style.fontVariationSettings = `"wght" ${d.wght}, "wdth" ${d.wdth}`;
          s.style.left = d.xs[i] + "px";
          s.style.top = (pad - FM.capTop) * S + "px";   // cima delle maiuscole = bordo riga + pad
          line.appendChild(s);
          return s;
        }));
        L.appendChild(line);
        ref.lines.push(chs);
      });
      if (kind === "ink") {
        const rule = document.createElement("div"); rule.className = "hm__rule";
        rule.style.top = ys[1] + lineH + Math.max(4, S * 0.03) + "px";
        L.appendChild(rule); ref.rule = rule;
        const tag = document.createElement("div"); tag.className = "hm__meta";
        tag.style.left = "0"; tag.style.top = ys[0] - 24 + "px";
        L.appendChild(tag); ref.tag = tag;
        const tc = document.createElement("div"); tc.className = "hm__meta";
        tc.style.right = "0"; tc.style.top = ys[0] - 24 + "px";
        if (cols < 12) tc.style.display = "none";            // su mobile non c'è spazio accanto alla marginalia
        L.appendChild(tc); ref.tc = tc;
        hm.appendChild(L);
        hm.appendChild(sweep); ref.sweep = sweep;
      } else hm.appendChild(L);
      layers.push(ref);
    });
    lastTag = null;
  }

  // tendina: entra scoprendo la forma da un lato, esce coprendola verso il lato opposto
  const AX = { up:["y", 1], down:["y", 0], left:["x", 0], right:["x", 0] };
  function shapeTransform(p, t, tIn, tOut) {
    const pin = outExpo(prog(t, tIn, 0.6)), pout = tOut == null ? 0 : inOut(prog(t, tOut, 0.42));
    if (pin <= 0 || pout >= 1) return null;
    const [axis, side] = AX[p.dir];
    const s = pout > 0 ? 1 - pout : pin;
    const edge = pout > 0 ? 1 - side : side;              // in uscita l'ancora passa al lato opposto
    const ax = p.x + (axis === "x" ? edge * p.w : 0), ay = p.y + (axis === "y" ? edge * p.h : 0);
    const sx = axis === "x" ? s : 1, sy = axis === "y" ? s : 1;
    let tr = `translate(${ax.toFixed(1)} ${ay.toFixed(1)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${(-ax).toFixed(1)} ${(-ay).toFixed(1)})`;
    if (p.rot != null) {
      const a = p.rot + (p.spin ? (t - tIn) * 60 : 0);
      tr += ` rotate(${a.toFixed(2)} ${(p.x + p.w / 2).toFixed(1)} ${(p.y + p.h / 2).toFixed(1)})`;
    }
    return tr;
  }

  let lastTag = null;
  function frame(t) {
    const { cols, colW, colX, words, scenes } = G;
    const [ink, inv] = layers;

    // griglia: entra dall'alto, esce verso il basso → loop senza stacco
    ink.cols.forEach((c, i) => {
      const a = prog(t, GRID_IN + i * 0.045, 0.75), b = prog(t, GRID_OUT + i * 0.045, 0.6);
      c.style.transformOrigin = b > 0 ? "bottom" : "top";
      c.style.transform = `scaleY(${(outExpo(a) * (1 - inOut(b))).toFixed(4)})`;
      ink.nums[i].style.opacity = (0.5 * prog(t, 0.4 + i * 0.045, 0.3) * (1 - prog(t, GRID_OUT - 0.3, 0.3))).toFixed(3);
    });
    // mobile: a ogni cambio di parola le righe si chiudono e si riaprono a onda, dall'alto in basso
    const seq2 = words[1];
    ink.rows.forEach((l, r) => {
      const a = prog(t, 0.35 + r * 0.06, 0.8), b = prog(t, GRID_OUT + r * 0.05, 0.6);
      let dip = 0;
      if (G.lite) for (let i = 1; i < seq2.length - 1; i++)
        dip = Math.max(dip, Math.sin(Math.PI * inOut(prog(t, seq2[i].at - 0.25 + r * 0.04, 0.75))));
      l.style.transformOrigin = b > 0 || (dip > 0 && r % 2) ? "right" : "left";
      l.style.transform = `scaleX(${(outExpo(a) * (1 - inOut(b)) * (1 - dip)).toFixed(4)})`;
    });

    // forme: ogni scena vive mentre la riga 2 mostra la sua parola
    scenes.forEach((list, si) => {
      const start = seq2[si].at, end = seq2[si + 1] ? seq2[si + 1].at : null;
      list.forEach((p, pi) => {
        const order = (p.x / G.W) * 6 + pi * 0.15;
        const tr = shapeTransform(p, t, start + 0.1 + order * 0.07, end == null ? null : end - 0.15 + order * 0.04);
        [ink, inv].forEach((L) => {
          const el = L.shapes[si][pi];
          if (tr) { el.setAttribute("transform", tr); el.style.visibility = "visible"; }
          else el.style.visibility = "hidden";
        });
      });
    });

    // lettere: ogni lettera entra dal basso e esce in alto, a cascata colonna per colonna
    words.forEach((seq, r) => seq.forEach((d, wi) => {
      const next = seq[wi + 1];
      [ink, inv].forEach((L) => L.lines[r][wi].forEach((s, i) => {
        const pin = outExpo(prog(t, d.at + i * STAGGER, IN));
        const pout = next ? inOut(prog(t, next.at + i * STAGGER * 0.8, OUT)) : 0;
        const yy = pout > 0 ? -pout : 1 - pin;
        s.style.transform = `translateY(${(yy * 130).toFixed(2)}%)`;
      }));
    }));

    // filetto rosso sotto la riga 2: misura esattamente le colonne occupate dalla parola
    let cur = 0;
    for (let i = 0; i < seq2.length; i++) if (t >= seq2[i].at) cur = i;
    const prev = cur > 0 ? seq2[cur - 1].span : 0;
    const now = t < seq2[0].at ? 0 : seq2[cur].span;
    const pr = inOut(prog(t, seq2[cur].at, 0.55));
    ink.rule.style.width = (t < seq2[0].at ? 0 : prev + (now - prev) * pr) + "px";

    const tag = t < seq2[0].at ? "" : (seq2[cur].tag || "");
    if (tag !== lastTag) { ink.tag.innerHTML = tag ? `<b>●</b>&nbsp; ${tag}` : ""; lastTag = tag; }
    const on = prog(t, 0.6, 0.4) * (1 - prog(t, 12.6, 0.3));
    ink.tag.style.opacity = ink.tc.style.opacity = on.toFixed(3);
    ink.tc.textContent = `Surreo · ${t.toFixed(2).padStart(5, "0")}″ / 14″`;

    // colonna rossa: scatta di colonna in colonna, testo e forme dentro si invertono
    const sp = prog(t, SWEEP[0], SWEEP[1] - SWEEP[0]);
    if (sp > 0 && sp < 1) {
      const f = sp * cols, ci = Math.min(cols - 1, Math.floor(f)), frac = inOut(clamp((f - ci) * 1.6, 0, 1));
      const x = colX(ci) + (ci < cols - 1 ? (colX(ci + 1) - colX(ci)) * frac : 0);
      const grow = Math.min(1, sp * 14), shrink = Math.min(1, (1 - sp) * 14);
      ink.sweep.style.left = x + "px";
      ink.sweep.style.transformOrigin = sp < .5 ? "top" : "bottom";
      ink.sweep.style.transform = `scaleY(${Math.min(grow, shrink).toFixed(3)})`;
      inv.el.style.clipPath = `inset(0 ${G.W - x - colW}px 0 ${x}px)`;
    } else {
      ink.sweep.style.transform = "scaleY(0)";
      inv.el.style.clipPath = "inset(0 100% 0 0)";
    }
  }

  // loop: gira solo quando l'hero è a schermo e tutto è pronto
  const FROZEN = new URLSearchParams(location.search).has("t");
  let t0 = 0, raf = 0, visible = true, paused = 0, ready = false;
  function tick(now) { frame(((now - t0) / 1000) % LOOP); raf = requestAnimationFrame(tick); }
  function start() { if (raf || reduce || FROZEN || !ready || !visible) return; t0 = performance.now() - paused * 1000; raf = requestAnimationFrame(tick); }
  function stop() { if (!raf) return; cancelAnimationFrame(raf); raf = 0; paused = ((performance.now() - t0) / 1000) % LOOP; }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hm);
  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => {
    if (!ready) return;
    layout();
    if (FROZEN) frame(+new URLSearchParams(location.search).get("t")); else if (reduce) frame(5.5);
  }, 150); });

  Promise.all([
    document.fonts.load('900 100px "Archivo"', "MULTIDSCPNARY"),
    document.fonts.load('100 100px "Archivo"', "WEB"),
  ]).then(() => document.fonts.ready).then(() => {
    FM = fontMetrics();
    layout();
    ready = true;
    if (FROZEN) { frame(+new URLSearchParams(location.search).get("t")); return; }   // ?t=5.2 → fotogramma fermo
    if (reduce) frame(5.5); else start();
  });
})();
