/* hero eye — un occhio a mandorla sopra l'animazione dell'hero (hero-motion.js).
   La mandorla è costruita con due archi sulla griglia (colonne 3–10, tre righe di moduli);
   l'iride segue il mouse (senza mouse si guarda intorno), la pupilla prende la forma della
   disciplina scritta in quel momento, e a ogni cambio di parola l'occhio sbatte le palpebre.
   Solo desktop (sul telefono l'hero è la versione ridotta senza forme). */
(() => {
  const hm = document.getElementById("hm");
  if (!hm) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const INK = "#16140f", PAP = "#eceae1", RED = "#b83b2e";
  const KEYS = ["graphic", "motion", "web", "space", "type"];

  let G = null, svg = null, mx = null, my = null, lastKey = "", blinkT = -9, visible = true, raf = 0;
  addEventListener("mousemove", (e) => { const r = hm.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
  document.addEventListener("mouseleave", () => { mx = my = null; });

  // griglia letta dall'hero: colonne, righe di moduli, gutter
  function geom() {
    const L = hm.querySelector(".hm__layer"); if (!L) return null;
    const cols = [...L.querySelectorAll(".hm__col")].map((c) => ({ x: parseFloat(c.style.left), w: parseFloat(c.style.width) }));
    const rows = [...L.querySelectorAll(".hm__row")].map((r) => parseFloat(r.style.top));
    if (cols.length < 12 || rows.length < 4) return null;          // versione mobile: niente occhio
    const gut = cols[1].x - cols[0].x - cols[0].w, rowH = (rows[3] - rows[0] - 2 * gut) / 3;
    return { cols, colW: cols[0].w, gut, rowY: (r) => rows[0] + r * (rowH + gut), rowH, w: hm.clientWidth };
  }
  const key = () => {
    const s = ((hm.querySelector(".hm__meta") || {}).textContent || "").toLowerCase();
    for (const k of KEYS) if (s.includes(k)) return k;
    return s.includes("surreo") ? "studio" : "disciplinary";
  };
  // pupilla: la forma della disciplina, centrata in (x,y) con raggio r
  function pupil(k, x, y, r, t) {
    const q = `M${x - r},${y + r}V${y - r}A${2 * r},${2 * r} 0 0 1 ${x + r},${y + r}Z`;
    if (k === "graphic") return `<path d="${q}" fill="${INK}"/>`;
    if (k === "motion") return `<path transform="rotate(${(t * 180) % 360} ${x} ${y})" d="${q}" fill="${INK}"/>`;
    if (k === "web") return `<rect x="${x - r * .85}" y="${y - r * .85}" width="${r * 1.7}" height="${r * 1.7}" fill="${INK}"/>`;
    if (k === "space") return `<path d="M${x - r},${y + r}V${y}A${r},${r} 0 0 1 ${x + r},${y}V${y + r}Z" fill="${INK}"/>`;
    if (k === "type") return `<rect x="${x - r * .28}" y="${y - r}" width="${r * .56}" height="${r * 2}" fill="${INK}"/>`;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
  }
  // sguardo verso il mouse; senza mouse, un giro lento
  function look(cx, cy, max, t) {
    if (mx != null) { const dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 400); return [dx / d * max * k, dy / d * max * k]; }
    if (reduce) return [0, 0];
    return [Math.cos(t * .7) * max * .8, Math.sin(t * 1.3) * max * .45];
  }
  const lidAt = (t) => { const d = t - blinkT; return d < 0 || d > .32 ? 0 : Math.sin(Math.PI * d / .32); };

  function draw(g, k, t) {
    const x0 = g.cols[2].x, x1 = g.cols[9].x + g.colW, cx = (x0 + x1) / 2;
    const y0 = g.rowY(0), y1 = g.rowY(2) + g.rowH, cy = (y0 + y1) / 2, hh = (y1 - y0) / 2;
    const h = hh * .62 * (1 - lidAt(t) * .98), w = (x1 - x0) / 2, rr = (w * w + h * h) / (2 * Math.max(h, 1));
    const almond = `M${x0},${cy}A${rr},${rr} 0 0 1 ${x1},${cy}A${rr},${rr} 0 0 1 ${x0},${cy}Z`;
    const [ox, oy] = look(cx, cy, w * .38, t), IR = hh * .5, PR = hh * .24, ix = cx + ox, iy = cy + oy * .5;
    return `<clipPath id="hmEyeClip"><path d="${almond}"/></clipPath>
      <path d="${almond}" fill="${PAP}" opacity=".88"/>
      <g clip-path="url(#hmEyeClip)"><circle cx="${ix}" cy="${iy}" r="${IR}" fill="${INK}"/><circle cx="${ix}" cy="${iy}" r="${IR * .72}" fill="${RED}"/>
        ${pupil(k, cx + ox * 1.1, cy + oy * .55, PR, t)}<circle cx="${ix + PR * .55}" cy="${iy - PR * .6}" r="${PR * .28}" fill="${PAP}"/></g>
      <path d="${almond}" fill="none" stroke="${INK}" stroke-width="2.5"/>
      <line x1="${x0 - g.gut}" y1="${cy}" x2="${x0}" y2="${cy}" stroke="${INK}" stroke-width="2.5"/>
      <line x1="${x1}" y1="${cy}" x2="${x1 + g.gut}" y2="${cy}" stroke="${INK}" stroke-width="2.5"/>`;
  }

  const T0 = performance.now();
  function loop(now) {
    // l'hero ricostruisce la griglia quando cambia misura: se il livello è stato tolto lo rimetto
    if (!svg || !svg.isConnected || !G || G.w !== hm.clientWidth) {
      G = geom();
      if (svg && svg.isConnected) svg.remove();
      svg = null;
      if (G) { svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "hm__eye"); svg.setAttribute("aria-hidden", "true"); hm.appendChild(svg); }
    }
    if (svg) {
      const t = (now - T0) / 1000, k = key();
      if (k !== lastKey) { lastKey = k; if (!reduce) blinkT = t; }
      svg.innerHTML = draw(G, k, t);
    }
    raf = visible ? requestAnimationFrame(loop) : 0;
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(hm);
})();
