/* =========================================================================
   WORKSHOK — SOCIAL.EXE · TEMPLATES
   Ogni template esporta:
     - id, label, fields[]   (metadata per la UI)
     - render(fmt, data, pal) → stringa SVG (viewBox coincide con il formato)
   ========================================================================= */

/* --------- FORMATI ---------- */
const FORMATS = {
  "1x1":  { w: 1080, h: 1080, label: "1:1 · 1080x1080" },
  "4x5":  { w: 1080, h: 1350, label: "4:5 · 1080x1350" },
  "9x16": { w: 1080, h: 1920, label: "9:16 · 1080x1920" },
};

/* --------- PALETTE ---------- */
const PALETTES = {
  dark:  { bg: "#14130a", ink: "#f1f5e0", dim: "rgba(241,245,224,0.55)", line: "rgba(241,245,224,0.22)", hot: "#ff3b1f" },
  light: { bg: "#f1f5e0", ink: "#14130a", dim: "rgba(20,19,10,0.55)",    line: "rgba(20,19,10,0.22)",    hot: "#ff3b1f" },
};

/* --------- ESCAPE HELPERS ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));

/* --------- WRAP TESTO IN TSPAN ---------- */
function wrapTspans(text, x, maxChars) {
  const words = String(text || "").trim().split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (test.length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines.map((ln, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : "1.2em"}">${esc(ln)}</tspan>`).join("");
}

/* --------- CROSSHAIR + CORNER MARKS + GRID (comuni) ---------- */
function frameDecor(w, h, pal) {
  const pad = 40;
  const armLen = 34;
  const arm = (x, y, sx, sy) => `
    <line x1="${x}" y1="${y}" x2="${x + sx * armLen}" y2="${y}" stroke="${pal.ink}" stroke-width="2"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + sy * armLen}" stroke="${pal.ink}" stroke-width="2"/>
  `;
  return `
    <g class="frame-decor" opacity="0.9">
      ${arm(pad, pad, 1, 1)}
      ${arm(w - pad, pad, -1, 1)}
      ${arm(pad, h - pad, 1, -1)}
      ${arm(w - pad, h - pad, -1, -1)}
    </g>
  `;
}
function gridBg(w, h, pal, step = 90) {
  let lines = "";
  for (let x = step; x < w; x += step) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${pal.line}" stroke-width="1"/>`;
  for (let y = step; y < h; y += step) lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${pal.line}" stroke-width="1"/>`;
  return `<g opacity="0.5">${lines}</g>`;
}

/* --------- WORDMARK MINI (fallback tipografico) ---------- */
function wordmarkMini(x, y, pal, size = 30) {
  return `
    <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}" font-size="${size}">
      <text x="${x}" y="${y}" letter-spacing="-0.02em">WORKSHOK<tspan fill="${pal.hot}">!</tspan></text>
    </g>
  `;
}

/* --------- EDITION STRIP (top) ---------- */
function editionStrip(w, pal, ed) {
  return `
    <g font-family="Space Mono, monospace" font-size="16" fill="${pal.dim}" letter-spacing="0.14em">
      <text x="50" y="72" text-anchor="start">// ${esc(ed.edition || "N.08")} · ${esc(ed.title || "SAAD WORKSHOP WEEK")} · ${esc(ed.city || "ASCOLI PICENO")} · ${esc(ed.year || "2026")}</text>
      <text x="${w - 50}" y="72" text-anchor="end">CUR X:000 Y:000</text>
    </g>
  `;
}

/* --------- HELPERS NUOVA DIREZIONE (editorial condensed) ---------- */
function edition() {
  return window.EDITION || { edition:"N.08", title:"SAAD WORKSHOP WEEK", city:"ASCOLI PICENO", year:"2026" };
}

/* Fascia superiore nera con testi in mono ai due estremi */
function topBar(w, leftText, rightText, height = 90) {
  return `
    <rect x="0" y="0" width="${w}" height="${height}" fill="#14130a"/>
    <g font-family="Space Mono, monospace" font-size="20" fill="#f1f5e0" letter-spacing="0.14em">
      <text x="50" y="${height * 0.65}">${esc(leftText)}</text>
      <text x="${w - 50}" y="${height * 0.65}" text-anchor="end">${esc(rightText)}</text>
    </g>
  `;
}

/* Chip rosso con testo mono centrato */
function chipRed(x, y, w, h, text, fontSize = 20) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ff3b1f"/>
    <text x="${x + w/2}" y="${y + h * 0.68}" text-anchor="middle" font-family="Space Mono, monospace" font-size="${fontSize}" font-weight="700" fill="#14130a" letter-spacing="0.14em">${esc(text)}</text>
  `;
}

/* Banner nero orizzontale con testo mono */
function blackBanner(x, y, w, h, text, fontSize = 22, align = "left") {
  const tx = align === "center" ? x + w/2 : (align === "right" ? x + w - 20 : x + 20);
  const anchor = align === "center" ? "middle" : (align === "right" ? "end" : "start");
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#14130a"/>
    <text x="${tx}" y="${y + h * 0.68}" text-anchor="${anchor}" font-family="Space Mono, monospace" font-size="${fontSize}" font-weight="700" fill="#f1f5e0" letter-spacing="0.14em">${esc(text)}</text>
  `;
}

/* Griglia verticale sottile in background (n colonne) */
function verticalGrid(w, h, cols, pal, marginTop = 120, marginBottom = 120) {
  const step = w / cols;
  let out = "";
  for (let i = 1; i < cols; i++) {
    const x = Math.round(i * step);
    out += `<line x1="${x}" y1="${marginTop}" x2="${x}" y2="${h - marginBottom}" stroke="${pal.line}" stroke-width="1"/>`;
  }
  return `<g opacity="0.9">${out}</g>`;
}

/* Numero enorme "architettura" (font condensed pesante) */
function hugeCondensedNumber(x, y, num, fontSize, color) {
  return `
    <g font-family="Barlow Condensed, Impact, sans-serif" font-weight="900" fill="${color}">
      <text x="${x}" y="${y}" font-size="${fontSize}" letter-spacing="-0.06em">${esc(num)}</text>
    </g>
  `;
}

/* Titolo condensed pesante multi-riga (auto-scale) */
function hugeCondensedTitle(x, y, text, opts) {
  const o = Object.assign({ maxWidth: 480, size: 180, lineH: 0.9, color: "#14130a", weight: 800, dotColor: null, dotChar: "" }, opts || {});
  // wrap per parole se ci sono più parole; se una parola sola, non wrappare
  const words = String(text || "").trim().split(/\s+/);
  const lines = [];
  if (words.length === 1) {
    lines.push(words[0]);
  } else {
    // spezza a metà se ci sono 2 parole, altrimenti wrap per lunghezza
    if (words.length === 2) {
      lines.push(words[0]);
      lines.push(words[1]);
    } else {
      // wrap per numero massimo di caratteri per riga
      const maxChars = 12;
      let cur = "";
      for (const w of words) {
        const test = cur ? cur + " " + w : w;
        if (test.length > maxChars && cur) { lines.push(cur); cur = w; }
        else cur = test;
      }
      if (cur) lines.push(cur);
    }
  }
  const dot = o.dotColor && o.dotChar
    ? `<tspan fill="${o.dotColor}">${esc(o.dotChar)}</tspan>`
    : "";
  const lineHpx = Math.round(o.size * o.lineH);
  return lines.map((ln, i) => {
    const isLast = i === lines.length - 1;
    const suffix = isLast ? dot : "";
    return `<text x="${x}" y="${y + i * lineHpx}" font-family="Barlow Condensed, Impact, sans-serif" font-weight="${o.weight}" font-size="${o.size}" fill="${o.color}" letter-spacing="-0.02em">${esc(ln)}${suffix}</text>`;
  }).join("");
}

/* Corpo testo in Barlow Condensed (medium) */
function bodyCondensed(x, y, text, opts) {
  const o = Object.assign({ size: 32, maxChars: 42, color: "#14130a", weight: 500, lineH: 1.15 }, opts || {});
  const words = String(text || "").trim().split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (test.length > o.maxChars && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  const lineHpx = Math.round(o.size * o.lineH);
  return lines.map((ln, i) =>
    `<text x="${x}" y="${y + i * lineHpx}" font-family="Barlow Condensed, sans-serif" font-weight="${o.weight}" font-size="${o.size}" fill="${o.color}">${esc(ln)}</text>`
  ).join("");
}

/* Stack di metadata: LABEL mono in alto, VALUE condensed sotto, con divisori */
function metadataStack(x, y, w, items, opts) {
  const o = Object.assign({ labelSize: 15, valueSize: 40, gap: 34, color: "#14130a", divider: true }, opts || {});
  let cy = y;
  const rows = items.map((it, i) => {
    const isLast = i === items.length - 1;
    const rowH = o.valueSize + o.gap + 20;
    const block = `
      <text x="${x}" y="${cy}" font-family="Space Mono, monospace" font-size="${o.labelSize}" fill="${o.color}" opacity="0.55" letter-spacing="0.14em">${esc(it.label)}</text>
      <text x="${x}" y="${cy + o.labelSize + 22}" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="${o.valueSize}" fill="${o.color}" letter-spacing="-0.02em">${esc(it.value)}</text>
      ${o.divider && !isLast ? `<line x1="${x}" y1="${cy + o.labelSize + 22 + 16}" x2="${x + w}" y2="${cy + o.labelSize + 22 + 16}" stroke="${o.color}" stroke-width="1.5" opacity="0.7"/>` : ""}
    `;
    cy += rowH;
    return block;
  }).join("");
  return rows;
}

/* Fascia inferiore nera divisa in N celle (label + valore) */
function stripBottomCells(w, h, cells, opts) {
  const o = Object.assign({ height: 200 }, opts || {});
  const y = h - o.height;
  const colW = w / cells.length;
  const inner = cells.map((c, i) => {
    const cx = i * colW + 30;
    const isLast = i === cells.length - 1;
    // ultima cella: mostrare CTA rossa se `cta: true`
    if (c.cta) {
      return `
        <text x="${cx}" y="${y + 45}" font-family="Space Mono, monospace" font-size="14" fill="rgba(241,245,224,0.55)" letter-spacing="0.14em">${esc(c.label)}</text>
        <text x="${cx}" y="${y + 90}" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="28" fill="#f1f5e0" letter-spacing="0.02em">${esc(c.value)}</text>
        <rect x="${cx}" y="${y + 115}" width="${Math.min(240, colW - 60)}" height="50" fill="#ff3b1f"/>
        <text x="${cx + Math.min(240, colW - 60)/2}" y="${y + 150}" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="700" fill="#14130a" letter-spacing="0.14em">${esc(c.cta)}</text>
      `;
    }
    return `
      <text x="${cx}" y="${y + 45}" font-family="Space Mono, monospace" font-size="14" fill="rgba(241,245,224,0.55)" letter-spacing="0.14em">${esc(c.label)}</text>
      <text x="${cx}" y="${y + 125}" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="72" fill="#f1f5e0" letter-spacing="-0.02em">${esc(c.value)}</text>
    `;
  }).join("");
  const dividers = cells.slice(0, -1).map((_, i) => {
    const dx = (i + 1) * colW;
    return `<line x1="${dx}" y1="${y}" x2="${dx}" y2="${h}" stroke="rgba(241,245,224,0.16)" stroke-width="1"/>`;
  }).join("");
  return `
    <rect x="0" y="${y}" width="${w}" height="${o.height}" fill="#14130a"/>
    ${dividers}
    ${inner}
  `;
}

/* Wordmark WORKSHOK! con "!" rosso — condensed */
function wordmarkCondensed(x, y, size, color, dotColor) {
  return `
    <text x="${x}" y="${y}" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="${size}" fill="${color}" letter-spacing="-0.02em" text-anchor="end">WORKSHOK<tspan fill="${dotColor || "#ff3b1f"}">!</tspan></text>
  `;
}

/* --------- FOTO clippata (cover) ----------
   `onColor` = colore del piano su cui poggia (per placeholder leggibile). */
function coverImage(id, href, x, y, w, h, pal, onColor) {
  const base = onColor || pal.bg;
  // scegli un ink leggibile sul base: se base chiaro → ink scuro, se scuro → chiaro
  const isLight = /^#(f|e|d)/i.test(base) || base.toLowerCase().includes("f1f5") || base.toLowerCase().includes("f6f9");
  const inkOn = isLight ? "#14130a" : "#f1f5e0";
  const dimOn = isLight ? "rgba(20,19,10,0.55)" : "rgba(241,245,224,0.55)";
  if (!href) {
    return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${isLight ? 'rgba(20,19,10,0.04)' : 'rgba(241,245,224,0.04)'}" stroke="${inkOn}" stroke-width="2" stroke-dasharray="10 8"/>
        <g font-family="Space Mono, monospace" font-size="18" fill="${dimOn}" text-anchor="middle" letter-spacing="0.12em">
          <text x="${x + w/2}" y="${y + h/2 - 4}">[ NO PHOTO ]</text>
          <text x="${x + w/2}" y="${y + h/2 + 22}" font-size="13">carica dal disco</text>
        </g>
      </g>
    `;
  }
  return `
    <defs>
      <clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
    </defs>
    <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}"
           preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${id})"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${inkOn}" stroke-width="2"/>
  `;
}

/* =========================================================================
   TEMPLATE 01 · ANNUNCIO CORSO — 2 LAYOUTS
   ========================================================================= */
const TPL_COURSE = {
  id: "course",
  label: "Annuncio Corso",
  defaults: () => {
    const c = (window.COURSES && window.COURSES[0]) || {};
    return {
      number: c.number || "01",
      title: c.title || "Metodi Sporchi",
      theme: c.theme || "Grafica editoriale + risografia",
      tutor: c.tutor && c.tutor !== "TBA" ? c.tutor : "Nome Cognome",
      role:  "Graphic Designer",
      studio:"Studio · Città",
      days:  c.days  || "3 giorni · 12–14 Mag",
      dates: "12–14 MAG",
      duration: "3 giorni",
      blurb: c.blurb || "Dallo scarabocchio alla stampa: layout brutalisti, mezzetinte e inchiostri che sbavano.",
    };
  },
  fields: [
    { key: "number", label: "Numero (01/02/03)", type: "text", maxLength: 4 },
    { key: "title",  label: "Titolo corso",       type: "text" },
    { key: "theme",  label: "Tema",               type: "text" },
    { key: "tutor",  label: "Tutor / Docente",    type: "text" },
    { key: "role",   label: "Ruolo tutor",        type: "text" },
    { key: "studio", label: "Studio / città",     type: "text" },
    { key: "dates",  label: "Date brevi (es. 12–14 MAG)", type: "text" },
    { key: "duration", label: "Durata (es. 3 giorni)",     type: "text" },
    { key: "days",   label: "Giorni · date estese",       type: "text" },
    { key: "blurb",  label: "Descrizione breve",  type: "textarea" },
    { key: "prefill", label: "PRECOMPILA DA COURSES.JS", type: "prefill", options: () => (window.COURSES||[]).map((c,i)=>({value:i, label:`${c.number||("0"+(i+1))} · ${c.title||"—"}`})) },
  ],
  applyPrefill(state, index) {
    const c = (window.COURSES || [])[index];
    if (!c) return state;
    return { ...state,
      number: c.number || state.number,
      title:  c.title  || state.title,
      theme:  c.theme  || state.theme,
      tutor:  c.tutor && c.tutor !== "TBA" ? c.tutor : state.tutor,
      days:   c.days   || state.days,
      blurb:  c.blurb  || state.blurb,
    };
  },
  layouts: [
    {
      id: "v1",
      label: "V1 · Numero-Architettura",
      render(fmt, d, pal, photoHref) {
        const { w, h } = FORMATS[fmt];
        const ed = edition();
        const isVertical = fmt === "9x16";
        const isSquare = fmt === "1x1";

        // proporzioni adattive
        const topH = 90;
        const bottomH = isSquare ? 160 : 200;
        const contentTop = topH + 60;
        const contentBottom = h - bottomH - 30;

        // linea verticale separatrice
        const divX = Math.round(w * 0.47);

        // NUMERO come architettura — occupa la zona alta della colonna sinistra
        const numSize = isVertical ? Math.round(h * 0.36) : (isSquare ? Math.round(h * 0.44) : Math.round(h * 0.42));
        const numX = 30;
        const numY = topH + 40 + Math.round(numSize * 0.82);  // baseline vicino alla fine del glyph

        // FOTO — occupa zona bassa della colonna sinistra, sotto il numero
        const photoW = divX - 60;
        const photoTop = numY + 40;
        const photoBottom = contentBottom - 20;
        const photoH = photoBottom - photoTop;
        const photoX = 30;
        const photoY = photoTop;

        // TITOLO — colonna destra
        const titleSize = isVertical ? Math.round(w * 0.135) : Math.round(w * 0.16);
        const titleX = divX + 30;
        const titleY = contentTop + Math.round(titleSize * 0.85);
        // Titolo su 2 righe max — dopo la seconda riga:
        const titleH = Math.round(titleSize * 0.9) * 2;
        const themeY = titleY + titleH - Math.round(titleSize * 0.2);

        // body
        const bodyY = themeY + 100;

        // tutor info sotto body (colonna destra)
        const tutorX = divX + 30;
        const tutorY = bodyY + 190;

        return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>
  ${verticalGrid(w, h, 6, pal, topH + 20, bottomH + 20)}

  ${topBar(w, `${ed.edition || "N.08"} · SAAD WORKSHOP WEEK · ${ed.year || "2026"}`, `${ed.city || "ASCOLI PICENO"} — IT`, topH)}

  <!-- chip CORSO -->
  ${chipRed(50, topH + 20, 220, 46, `CORSO ${esc(d.number || "01")}/03`, 18)}

  <!-- numero come architettura -->
  ${hugeCondensedNumber(numX, numY, d.number || "01", numSize, pal.ink)}

  <!-- linea divisoria verticale -->
  <line x1="${divX}" y1="${contentTop - 20}" x2="${divX}" y2="${contentBottom + 20}" stroke="${pal.ink}" stroke-width="3"/>

  <!-- titolo condensato -->
  ${hugeCondensedTitle(titleX, titleY, d.title || "—", { size: titleSize, color: pal.ink, weight: 800 })}

  <!-- fascia tema (nera) -->
  ${blackBanner(titleX - 10, themeY, w - titleX - 40, 58, `${(d.theme || "").toUpperCase()}`, 22, "left")}

  <!-- descrizione -->
  ${bodyCondensed(titleX, bodyY + 40, d.blurb || "", { size: 30, maxChars: isVertical ? 22 : 28, color: pal.ink, weight: 500 })}

  <!-- foto slot con banner TUTOR sopra -->
  ${coverImage("courseph", photoHref, photoX, photoY + 46, photoW, photoH - 46, pal, pal.bg)}
  ${blackBanner(photoX, photoY, photoW, 46, `TUTOR · ${(d.tutor || "—").toUpperCase()}`, 18, "left")}

  <!-- metadata tutor a destra -->
  <g>
    ${metadataStack(tutorX, tutorY, w - tutorX - 40, [
      { label: "TUTOR",  value: (d.tutor || "—").toUpperCase() },
      { label: "RUOLO",  value: (d.role  || "").toUpperCase() },
      { label: "STUDIO", value: (d.studio|| "").toUpperCase() },
    ], { color: pal.ink, labelSize: 14, valueSize: 36, gap: 16, divider: true })}
  </g>

  <!-- fascia inferiore 3 celle -->
  ${stripBottomCells(w, h, [
    { label: "DATE",       value: (d.dates || "").toUpperCase() },
    { label: "DURATA",     value: (d.duration || "").toUpperCase() },
    { label: "ISCRIVITI",  value: "RVRSDDOT.GITHUB.IO", cta: "/WORKSHOK ↗" },
  ], { height: bottomH })}

  ${wordmarkCondensed(w - 40, h - 20, 28, "#f1f5e0")}
</svg>`.trim();
      }
    },
    {
      id: "v2",
      label: "V2 · Foto Full-Bleed",
      render(fmt, d, pal, photoHref) {
        const { w, h } = FORMATS[fmt];
        const ed = edition();
        const isVertical = fmt === "9x16";
        const isSquare = fmt === "1x1";

        // costanti verticali (ancoraggio bottom-up)
        const topH = 90;
        const bottomH = isSquare ? 150 : 170;
        const bottomY = h - bottomH;

        // body — fino a 3 righe di descrizione appena sopra la fascia bottom
        const bodySize = 28;
        const bodyLineH = Math.round(bodySize * 1.15);
        const bodyLines = 3;
        const bodyBottom = bottomY - 20;
        const bodyY = bodyBottom - Math.round(bodySize * 0.25) - (bodyLines - 1) * bodyLineH;

        // theme banner appena sopra la prima riga del body
        const themeH = 58;
        const themeGap = 24;
        const themeY = bodyY - Math.round(bodySize * 0.75) - themeGap - themeH;

        // titolo condensed sopra il theme banner (2 righe max)
        const titleSize = isVertical ? Math.round(w * 0.135) : Math.round(w * 0.15);
        const titleLineH = Math.round(titleSize * 0.9);
        const titleLines = 2;
        // baseline dell'ULTIMA riga:
        const titleLastY = themeY - 34;
        // baseline della PRIMA riga (che è quella passata a hugeCondensedTitle):
        const titleFirstY = titleLastY - titleLineH * (titleLines - 1);

        // separator (barra nera) sopra il titolo
        const separatorY = titleFirstY - Math.round(titleSize * 0.78) - 40;

        // photo full-bleed dal topH fino al separator
        const photoY = topH;
        const photoH = separatorY - photoY;

        // targhetta rossa nome tutor (entra dentro la foto in basso)
        const tagW = Math.min(560, Math.round(w * 0.62));
        const tagH = 88;
        const tagX = 50;
        const tagY = photoY + photoH - tagH - 30;

        return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>

  <!-- foto full bleed -->
  ${coverImage("courseph2", photoHref, 0, photoY, w, photoH, pal, pal.bg)}

  <!-- top bar sopra foto -->
  ${topBar(w, `${ed.edition || "N.08"} · SWW · ${ed.year || "2026"}`, `CORSO ${esc(d.number || "01")} / 03`, topH)}

  <!-- targhetta rossa col nome tutor -->
  ${chipRed(tagX, tagY, tagW, tagH, (d.tutor || "—").toUpperCase(), 34)}

  <!-- separatore -->
  <rect x="0" y="${separatorY}" width="${w}" height="6" fill="#14130a"/>

  <!-- titolo condensed -->
  ${hugeCondensedTitle(50, titleFirstY, d.title || "—", { size: titleSize, color: pal.ink, weight: 900, dotColor: "#ff3b1f", dotChar: "." })}

  <!-- fascia tema -->
  ${blackBanner(50, themeY, w - 100, themeH, (d.theme || "").toUpperCase(), 22, "left")}

  <!-- descrizione -->
  ${bodyCondensed(50, bodyY, d.blurb || "", { size: bodySize, maxChars: isVertical ? 30 : 44, color: pal.ink, weight: 500, lineH: 1.15 })}

  <!-- fascia inferiore chiara 3 celle -->
  <line x1="0" y1="${bottomY}" x2="${w}" y2="${bottomY}" stroke="${pal.ink}" stroke-width="2"/>
  <line x1="${Math.round(w/3)}" y1="${bottomY}" x2="${Math.round(w/3)}" y2="${h}" stroke="${pal.ink}" stroke-width="1.5"/>
  <line x1="${Math.round(2*w/3)}" y1="${bottomY}" x2="${Math.round(2*w/3)}" y2="${h}" stroke="${pal.ink}" stroke-width="1.5"/>
  <g font-family="Space Mono, monospace" font-size="14" fill="${pal.ink}" opacity="0.6" letter-spacing="0.14em">
    <text x="50" y="${bottomY + 40}">DATE</text>
    <text x="${Math.round(w/3) + 30}" y="${bottomY + 40}">DURATA</text>
    <text x="${Math.round(2*w/3) + 30}" y="${bottomY + 40}">ISCRIVITI</text>
  </g>
  <g font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="56" fill="${pal.ink}" letter-spacing="-0.02em">
    <text x="50" y="${h - 40}">${esc((d.dates || "").toUpperCase())}</text>
    <text x="${Math.round(w/3) + 30}" y="${h - 40}">${esc((d.duration || "").toUpperCase())}</text>
  </g>
  <g font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="26" fill="${pal.ink}" letter-spacing="0.02em">
    <text x="${Math.round(2*w/3) + 30}" y="${h - 68}">RVRSDDOT.GITHUB.IO</text>
    <text x="${Math.round(2*w/3) + 30}" y="${h - 36}" fill="#ff3b1f">/WORKSHOK ↗</text>
  </g>
</svg>`.trim();
      }
    }
  ]
};

/* =========================================================================
   TEMPLATE 02 · CARD DOCENTE
   Ritratto grande, nome enorme sotto, bio breve, "chip TUTOR".
   ========================================================================= */
const TPL_TUTOR = {
  id: "tutor",
  label: "Card Docente",
  defaults: () => ({
    tutor: "Nome Cognome",
    role: "Graphic Designer · Studio XYZ",
    course: "01 · Metodi Sporchi",
    bio: "Lavora tra editoria, lettering e progetti di identità. Ha collaborato con studi indipendenti in Italia e all'estero. Insegna metodo, non stile.",
    ig: "@handle",
  }),
  fields: [
    { key: "tutor",  label: "Nome docente", type: "text" },
    { key: "role",   label: "Ruolo / Studio", type: "text" },
    { key: "course", label: "Corso associato", type: "text" },
    { key: "bio",    label: "Bio breve (2-3 righe)", type: "textarea" },
    { key: "ig",     label: "Instagram (@handle)", type: "text" },
  ],
  render(fmt, d, pal, photoHref) {
    const { w, h } = FORMATS[fmt];
    const ed = (window.EDITION || {});

    // foto: full-bleed sulla metà superiore (adatta al formato)
    const photoH = fmt === "1x1" ? Math.round(h * 0.58) : (fmt === "4x5" ? Math.round(h * 0.62) : Math.round(h * 0.68));
    const photoY = 0;

    const nameSize = Math.round(w * (fmt === "9x16" ? 0.095 : 0.11));
    const roleSize = Math.round(w * 0.026);
    const bioSize  = Math.round(w * 0.024);

    const textStartY = photoH + 90;

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>

  <!-- foto -->
  ${coverImage("tutorbig", photoHref, 0, 0, w, photoH, pal, pal.bg)}

  <!-- gradient scuro sopra la foto per leggibilità del chip -->
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${pal.ink}" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="${pal.ink}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${Math.round(photoH * 0.35)}" fill="url(#fade)"/>

  <!-- chip TUTOR -->
  <g font-family="Space Mono, monospace" font-size="18" letter-spacing="0.16em">
    <rect x="40" y="40" width="240" height="42" fill="${pal.hot}" stroke="${pal.ink}" stroke-width="2"/>
    <text x="160" y="68" text-anchor="middle" fill="${pal.ink}" font-weight="700">TUTOR · SWW8</text>

    <text x="${w - 40}" y="68" text-anchor="end" fill="#f1f5e0" opacity="0.9">${esc(d.course || "—")}</text>
  </g>

  <!-- linea separatore -->
  <line x1="40" y1="${photoH + 30}" x2="${w - 40}" y2="${photoH + 30}" stroke="${pal.ink}" stroke-width="2"/>

  <!-- nome -->
  <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}">
    <text x="40" y="${textStartY}" font-size="${nameSize}" letter-spacing="-0.03em">${wrapTspans(d.tutor || "—", 40, fmt === "9x16" ? 12 : 14)}</text>
  </g>

  <!-- ruolo/studio -->
  <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${roleSize}" letter-spacing="0.08em">
    <text x="40" y="${textStartY + nameSize + 20}">// ${esc(d.role || "—")}</text>
  </g>

  <!-- bio -->
  <g font-family="Space Grotesk, sans-serif" fill="${pal.ink}" font-size="${bioSize}">
    <text x="40" y="${textStartY + nameSize + 90}">${wrapTspans(d.bio || "—", 40, fmt === "9x16" ? 34 : 42)}</text>
  </g>

  <!-- footer -->
  <g font-family="Space Mono, monospace" fill="${pal.dim}" font-size="18" letter-spacing="0.12em">
    <text x="40" y="${h - 55}">IG ${esc(d.ig || "—")}</text>
  </g>
  ${wordmarkMini(w - 320, h - 55, pal, 30)}

  ${frameDecor(w, h, pal)}
</svg>`.trim();
  }
};

/* =========================================================================
   TEMPLATE 03 · COUNTDOWN / QUOTE
   Grande tipografia centrale — quote o data.
   ========================================================================= */
const TPL_QUOTE = {
  id: "quote",
  label: "Countdown / Quote",
  defaults: () => ({
    kicker: "MANCA POCO",
    big: "12 MAG",
    sub: "SWW8 · ASCOLI PICENO",
    tail: "Tre workshop. Una settimana. Rompi la griglia.",
  }),
  fields: [
    { key: "kicker", label: "Kicker (piccolo sopra)", type: "text" },
    { key: "big",    label: "Testo grande (data / quote)", type: "textarea" },
    { key: "sub",    label: "Sottotitolo", type: "text" },
    { key: "tail",   label: "Coda / tagline", type: "textarea" },
  ],
  render(fmt, d, pal /*, photoHref */) {
    const { w, h } = FORMATS[fmt];
    const ed = (window.EDITION || {});

    const bigText = String(d.big || "").trim();
    const bigLen  = bigText.length;
    // dimensione grande: si scala in base alla lunghezza (dopo wrap)
    let bigSize;
    if (bigLen <= 4)        bigSize = Math.round(w * 0.26);
    else if (bigLen <= 8)   bigSize = Math.round(w * 0.20);
    else if (bigLen <= 14)  bigSize = Math.round(w * 0.15);
    else if (bigLen <= 25)  bigSize = Math.round(w * 0.11);
    else if (bigLen <= 45)  bigSize = Math.round(w * 0.08);
    else                    bigSize = Math.round(w * 0.06);

    const kickSize = Math.round(w * 0.028);
    const subSize  = Math.round(w * 0.028);
    const tailSize = Math.round(w * 0.026);

    const maxChars = bigLen <= 4 ? 4 : (bigLen <= 8 ? 8 : (bigLen <= 14 ? 10 : (bigLen <= 25 ? 14 : (bigLen <= 45 ? 22 : 30))));

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>
  ${gridBg(w, h, pal, 72)}
  ${frameDecor(w, h, pal)}

  <!-- diagonali di sfondo -->
  <g stroke="${pal.hot}" stroke-width="3" opacity="0.85">
    <line x1="0" y1="${h * 0.18}" x2="${w}" y2="${h * 0.18}"/>
    <line x1="0" y1="${h * 0.82}" x2="${w}" y2="${h * 0.82}"/>
  </g>

  <!-- kicker -->
  <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${kickSize}" letter-spacing="0.24em">
    <text x="${w/2}" y="${h * 0.28}" text-anchor="middle">■ ${esc(d.kicker || "")}</text>
  </g>

  <!-- big -->
  <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}">
    <text x="${w/2}" y="${h * 0.52}" text-anchor="middle" font-size="${bigSize}" letter-spacing="-0.04em" dominant-baseline="middle">${wrapTspans(bigText, w/2, maxChars)}</text>
  </g>

  <!-- sub -->
  <g font-family="Space Mono, monospace" fill="${pal.ink}" font-size="${subSize}" letter-spacing="0.16em">
    <text x="${w/2}" y="${h * 0.7}" text-anchor="middle">${esc(d.sub || "")}</text>
  </g>

  <!-- tail -->
  <g font-family="Space Grotesk, sans-serif" fill="${pal.dim}" font-size="${tailSize}" font-style="italic">
    <text x="${w/2}" y="${h * 0.78}" text-anchor="middle">${wrapTspans(d.tail || "", w/2, 44)}</text>
  </g>

  <!-- bottom strip -->
  <g font-family="Space Mono, monospace" font-size="18" fill="${pal.dim}" letter-spacing="0.12em">
    <text x="50" y="${h - 55}">${esc(ed.edition || "N.08")} · ${esc(ed.year || "2026")} · ${esc(ed.city || "ASCOLI PICENO")}</text>
  </g>
  ${wordmarkMini(w - 320, h - 55, pal, 30)}
</svg>`.trim();
  }
};

/* =========================================================================
   TEMPLATE 04 · SAVE THE DATE (poster brutale)
   Data spezzata su più righe, kicker "SAVE THE DATE", luogo grande.
   ========================================================================= */
const TPL_SAVEDATE = {
  id: "savedate",
  label: "Save the Date",
  defaults: () => ({
    kicker: "SAVE THE DATE",
    d1: "12", d2: "MAG", d3: "2026",
    place: "ASCOLI PICENO",
    tag: "SAAD Workshop Week · N.08",
  }),
  fields: [
    { key: "kicker", label: "Kicker", type: "text" },
    { key: "d1",     label: "Data · giorno (o mese)", type: "text", maxLength: 4 },
    { key: "d2",     label: "Data · mese (o giorno)", type: "text", maxLength: 4 },
    { key: "d3",     label: "Data · anno", type: "text", maxLength: 4 },
    { key: "place",  label: "Luogo", type: "text" },
    { key: "tag",    label: "Tag / edizione", type: "text" },
  ],
  render(fmt, d, pal) {
    const { w, h } = FORMATS[fmt];
    const kickerSize = Math.round(w * 0.036);

    // dimensione basata sulla riga più lunga (per non sfondare)
    const maxLen = Math.max(String(d.d1||"").length, String(d.d2||"").length, String(d.d3||"").length);
    let bigSize;
    if (maxLen <= 2)      bigSize = Math.round(w * 0.32);
    else if (maxLen <= 3) bigSize = Math.round(w * 0.24);
    else if (maxLen <= 4) bigSize = Math.round(w * 0.19);
    else                  bigSize = Math.round(w * 0.14);

    const placeSize = Math.round(w * 0.045);
    const tagSize = Math.round(w * 0.022);

    // 3 righe di data allineate a sinistra
    const startY = fmt === "9x16" ? h * 0.34 : h * 0.32;
    const lineH = bigSize * 0.9;

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>
  ${gridBg(w, h, pal, 72)}
  ${frameDecor(w, h, pal)}

  <!-- kicker in alto -->
  <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${kickerSize}" letter-spacing="0.22em">
    <text x="50" y="150">■ ${esc(d.kicker || "SAVE THE DATE")}</text>
  </g>

  <!-- linea di taglio -->
  <line x1="50" y1="180" x2="${w - 50}" y2="180" stroke="${pal.ink}" stroke-width="2"/>

  <!-- 3 righe data -->
  <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}" letter-spacing="-0.05em">
    <text x="50" y="${startY + lineH * 0}" font-size="${bigSize}">${esc(d.d1 || "")}</text>
    <text x="50" y="${startY + lineH * 1}" font-size="${bigSize}" fill="${pal.hot}">${esc(d.d2 || "")}</text>
    <text x="50" y="${startY + lineH * 2}" font-size="${bigSize}">${esc(d.d3 || "")}</text>
  </g>

  <!-- luogo -->
  <g font-family="Space Grotesk, sans-serif" font-weight="600" fill="${pal.ink}" font-size="${placeSize}" letter-spacing="0.02em">
    <text x="${w - 50}" y="${h - 220}" text-anchor="end">${esc(d.place || "")}</text>
  </g>

  <!-- tag -->
  <g font-family="Space Mono, monospace" fill="${pal.dim}" font-size="${tagSize}" letter-spacing="0.12em">
    <text x="${w - 50}" y="${h - 180}" text-anchor="end">// ${esc(d.tag || "")}</text>
  </g>

  <!-- bottom -->
  <g font-family="Space Mono, monospace" font-size="18" fill="${pal.dim}" letter-spacing="0.12em">
    <text x="50" y="${h - 55}">RVRSDDOT.GITHUB.IO/WORKSHOK</text>
  </g>
  ${wordmarkMini(w - 320, h - 55, pal, 30)}
</svg>`.trim();
  }
};

/* =========================================================================
   TEMPLATE 05 · TESTIMONIAL / QUOTE DA DOCENTE
   Grandi virgolette, quote centrale, autore.
   ========================================================================= */
const TPL_TESTIMONIAL = {
  id: "testimonial",
  label: "Testimonial",
  defaults: () => ({
    quote: "Non insegno stile. Insegno un metodo per rompere il tuo.",
    author: "Nome Cognome",
    role: "Tutor SWW8 · Studio XYZ",
  }),
  fields: [
    { key: "quote",  label: "Citazione", type: "textarea" },
    { key: "author", label: "Autore",    type: "text" },
    { key: "role",   label: "Ruolo",     type: "text" },
  ],
  render(fmt, d, pal, photoHref) {
    const { w, h } = FORMATS[fmt];
    const ed = window.EDITION || {};

    const qLen = String(d.quote || "").length;
    let qSize;
    if (qLen <= 40)       qSize = Math.round(w * 0.075);
    else if (qLen <= 90)  qSize = Math.round(w * 0.055);
    else if (qLen <= 160) qSize = Math.round(w * 0.042);
    else                  qSize = Math.round(w * 0.034);

    const qWrap = qLen <= 40 ? 16 : (qLen <= 90 ? 22 : (qLen <= 160 ? 28 : 34));
    const quoteY = fmt === "9x16" ? h * 0.4 : h * 0.44;

    // avatar piccolo circolare in basso a sinistra
    const avSize = Math.round(w * 0.13);
    const avX = 60, avY = h - avSize - 130;

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>
  ${gridBg(w, h, pal, 90)}
  ${frameDecor(w, h, pal)}

  <!-- grande virgoletta di apertura -->
  <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.hot}" opacity="0.9">
    <text x="60" y="${h * 0.32}" font-size="${Math.round(w * 0.28)}" letter-spacing="-0.05em">"</text>
  </g>

  <!-- quote -->
  <g font-family="Space Grotesk, sans-serif" fill="${pal.ink}" font-weight="500">
    <text x="60" y="${quoteY}" font-size="${qSize}" letter-spacing="-0.02em">${wrapTspans(d.quote || "—", 60, qWrap)}</text>
  </g>

  <!-- avatar cerchio -->
  <defs>
    <clipPath id="clip-avatar"><circle cx="${avX + avSize/2}" cy="${avY + avSize/2}" r="${avSize/2}"/></clipPath>
  </defs>
  ${photoHref
    ? `<image href="${photoHref}" x="${avX}" y="${avY}" width="${avSize}" height="${avSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-avatar)"/>
       <circle cx="${avX + avSize/2}" cy="${avY + avSize/2}" r="${avSize/2}" fill="none" stroke="${pal.ink}" stroke-width="2"/>`
    : `<circle cx="${avX + avSize/2}" cy="${avY + avSize/2}" r="${avSize/2}" fill="${pal.hot}" stroke="${pal.ink}" stroke-width="2"/>
       <text x="${avX + avSize/2}" y="${avY + avSize/2 + 12}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="${Math.round(avSize * 0.4)}" fill="${pal.ink}">${esc(String(d.author||"?").trim().charAt(0).toUpperCase())}</text>`
  }

  <!-- autore + ruolo -->
  <g font-family="Space Grotesk, sans-serif" fill="${pal.ink}">
    <text x="${avX + avSize + 30}" y="${avY + avSize/2 - 4}" font-size="${Math.round(w * 0.036)}" font-weight="700" letter-spacing="-0.02em">— ${esc(d.author || "—")}</text>
    <text x="${avX + avSize + 30}" y="${avY + avSize/2 + 34}" font-size="${Math.round(w * 0.024)}" fill="${pal.dim}" font-family="Space Mono, monospace" letter-spacing="0.1em">${esc(d.role || "")}</text>
  </g>

  <!-- bottom strip -->
  <g font-family="Space Mono, monospace" font-size="16" fill="${pal.dim}" letter-spacing="0.12em">
    <text x="50" y="${h - 55}">// ${esc(ed.edition || "N.08")} · ${esc(ed.title || "SAAD WORKSHOP WEEK")} · ${esc(ed.year || "2026")}</text>
  </g>
  ${wordmarkMini(w - 320, h - 55, pal, 28)}
</svg>`.trim();
  }
};

/* =========================================================================
   TEMPLATE 06 · PARTNER HIGHLIGHT
   "IN COLLABORAZIONE CON" + nome partner gigante + logo/immagine + descrizione.
   ========================================================================= */
const TPL_PARTNER = {
  id: "partner",
  label: "Partner",
  defaults: () => ({
    kicker: "IN COLLABORAZIONE CON",
    name: "Studio XYZ",
    role: "Design partner · SWW8",
    blurb: "Studio di grafica e ricerca visiva basato a Milano. Ci accompagna nella settimana con talk e critiche.",
  }),
  fields: [
    { key: "kicker", label: "Kicker", type: "text" },
    { key: "name",   label: "Nome partner", type: "text" },
    { key: "role",   label: "Ruolo / etichetta", type: "text" },
    { key: "blurb",  label: "Descrizione", type: "textarea" },
    { key: "prefill", label: "PREFILL DA PARTNERS", type: "prefill",
      options: () => (window.PARTNERS||[]).map((p,i) => ({ value:i, label:p })) },
  ],
  applyPrefill(state, index) {
    const p = (window.PARTNERS || [])[index];
    if (!p) return state;
    return { ...state, name: p };
  },
  render(fmt, d, pal, photoHref) {
    const { w, h } = FORMATS[fmt];

    const kickerSize = Math.round(w * 0.03);
    const nameLen = String(d.name || "").length;
    const nameSize = nameLen <= 10 ? Math.round(w * 0.16)
                     : nameLen <= 18 ? Math.round(w * 0.11)
                     : nameLen <= 30 ? Math.round(w * 0.075)
                     : Math.round(w * 0.055);
    const roleSize = Math.round(w * 0.026);
    const bodySize = Math.round(w * 0.024);

    // header immagine
    const headerH = Math.round(h * (fmt === "9x16" ? 0.42 : 0.36));

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>

  <!-- header immagine -->
  ${coverImage("prtimg", photoHref, 0, 0, w, headerH, pal, pal.bg)}
  <rect x="0" y="0" width="${w}" height="${headerH}" fill="url(#partner-fade)"/>
  <defs>
    <linearGradient id="partner-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${pal.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="${pal.bg}" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <!-- kicker -->
  <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${kickerSize}" letter-spacing="0.24em">
    <text x="50" y="${headerH + 90}">■ ${esc(d.kicker || "IN COLLABORAZIONE CON")}</text>
  </g>

  <!-- nome partner -->
  <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}">
    <text x="50" y="${headerH + 90 + nameSize + 20}" font-size="${nameSize}" letter-spacing="-0.03em">${wrapTspans(d.name || "—", 50, nameLen <= 10 ? 10 : (nameLen <= 18 ? 15 : 22))}</text>
  </g>

  <!-- ruolo -->
  <g font-family="Space Mono, monospace" fill="${pal.dim}" font-size="${roleSize}" letter-spacing="0.1em">
    <text x="50" y="${h - 300}">${esc(d.role || "")}</text>
  </g>

  <!-- descrizione -->
  <g font-family="Space Grotesk, sans-serif" fill="${pal.ink}" font-size="${bodySize}">
    <text x="50" y="${h - 240}">${wrapTspans(d.blurb || "", 50, fmt === "9x16" ? 34 : 42)}</text>
  </g>

  <!-- bottom -->
  <line x1="50" y1="${h - 100}" x2="${w - 50}" y2="${h - 100}" stroke="${pal.ink}" stroke-width="2"/>
  <g font-family="Space Mono, monospace" font-size="16" fill="${pal.dim}" letter-spacing="0.12em">
    <text x="50" y="${h - 55}">WORKSHOK · SWW8 · ASCOLI PICENO</text>
  </g>
  ${wordmarkMini(w - 320, h - 55, pal, 28)}

  ${frameDecor(w, h, pal)}
</svg>`.trim();
  }
};

/* =========================================================================
   TEMPLATE 07 · CAROSELLO (slide numerata)
   Numero slide + foto full-bleed + caption/kicker sotto.
   ========================================================================= */
const TPL_CAROUSEL = {
  id: "carousel",
  label: "Slide Carosello",
  defaults: () => ({
    n: "01",
    total: "05",
    kicker: "DIETRO LE QUINTE",
    caption: "Prime prove in tipografia — mezzetinte e sovrastampe.",
  }),
  fields: [
    { key: "n",       label: "N. slide (01, 02…)", type: "text", maxLength: 3 },
    { key: "total",   label: "Totale slide", type: "text", maxLength: 3 },
    { key: "kicker",  label: "Kicker (tema slide)", type: "text" },
    { key: "caption", label: "Caption sotto la foto", type: "textarea" },
  ],
  render(fmt, d, pal, photoHref) {
    const { w, h } = FORMATS[fmt];

    // foto full-bleed occupa 65% dell'altezza
    const photoH = Math.round(h * (fmt === "9x16" ? 0.7 : 0.65));

    const nSize = Math.round(w * 0.075);
    const kickerSize = Math.round(w * 0.028);
    const capSize = Math.round(w * 0.032);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>

  <!-- foto -->
  ${coverImage("carimg", photoHref, 0, 0, w, photoH, pal, pal.bg)}

  <!-- numero slide chip in alto a sinistra -->
  <g font-family="Space Mono, monospace" font-weight="700" letter-spacing="0.14em">
    <rect x="40" y="40" width="200" height="60" fill="${pal.bg}" stroke="${pal.ink}" stroke-width="2"/>
    <text x="140" y="82" text-anchor="middle" font-size="${nSize}" fill="${pal.ink}" letter-spacing="0.06em">${esc(d.n || "01")}/${esc(d.total || "05")}</text>
  </g>

  <!-- kicker sotto la foto -->
  <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${kickerSize}" letter-spacing="0.2em">
    <text x="50" y="${photoH + 90}">■ ${esc(d.kicker || "")}</text>
  </g>

  <!-- caption -->
  <g font-family="Space Grotesk, sans-serif" fill="${pal.ink}" font-size="${capSize}" font-weight="500">
    <text x="50" y="${photoH + 170}">${wrapTspans(d.caption || "", 50, fmt === "9x16" ? 30 : 38)}</text>
  </g>

  <!-- freccia scorri -->
  <g font-family="Space Mono, monospace" font-size="20" fill="${pal.dim}" letter-spacing="0.15em">
    <text x="${w - 50}" y="${h - 55}" text-anchor="end">SCORRI →</text>
  </g>
  ${wordmarkMini(50, h - 55, pal, 26)}

  ${frameDecor(w, h, pal)}
</svg>`.trim();
  }
};

/* =========================================================================
   TEMPLATE 08 · MEET THE TUTORS (roster · 3 slot)
   ========================================================================= */
const TPL_ROSTER = {
  id: "roster",
  label: "Meet the Tutors",
  defaults: () => ({
    title: "I TUTOR",
    sub: "SWW8 · 2026",
    t1: "Tutor #1", r1: "Corso 01",
    t2: "Tutor #2", r2: "Corso 02",
    t3: "Tutor #3", r3: "Corso 03",
  }),
  fields: [
    { key: "title", label: "Titolo",     type: "text" },
    { key: "sub",   label: "Sottotitolo", type: "text" },
    { key: "t1",    label: "Slot 1 — nome", type: "text" },
    { key: "r1",    label: "Slot 1 — ruolo", type: "text" },
    { key: "t2",    label: "Slot 2 — nome", type: "text" },
    { key: "r2",    label: "Slot 2 — ruolo", type: "text" },
    { key: "t3",    label: "Slot 3 — nome", type: "text" },
    { key: "r3",    label: "Slot 3 — ruolo", type: "text" },
  ],
  render(fmt, d, pal, photoHref) {
    const { w, h } = FORMATS[fmt];
    const titleSize = Math.round(w * 0.09);
    const subSize   = Math.round(w * 0.028);

    // header
    const headerH = 260;

    // 3 slot: colonna (9:16, 4:5) o riga (1:1)
    const stack = (fmt !== "1x1");
    const areaY = headerH + 40;
    const areaH = h - areaY - 140;
    const cellSize = stack
      ? { w: w - 80, h: (areaH - 40) / 3 }
      : { w: (w - 80 - 40) / 3, h: areaH };

    const cells = [
      { name: d.t1, role: d.r1 },
      { name: d.t2, role: d.r2 },
      { name: d.t3, role: d.r3 },
    ].map((c, i) => {
      const x = 40 + (stack ? 0 : i * (cellSize.w + 20));
      const y = areaY + (stack ? i * (cellSize.h + 20) : 0);
      const photoW = stack ? Math.round(cellSize.h * 0.85) : cellSize.w;
      const photoH = stack ? cellSize.h : Math.round(cellSize.h * 0.7);
      const txtX = stack ? x + photoW + 24 : x + 8;
      const txtY = stack ? y + Math.round(photoH * 0.5) : y + photoH + 46;
      const nameSize = stack ? Math.round(w * 0.045) : Math.round(w * 0.032);
      const roleSize = Math.round(w * 0.022);

      // solo la prima cella riceve la foto (photoHref è single); altre placeholder
      const href = i === 0 ? photoHref : null;
      return `
        ${coverImage("cell"+i, href, x, y, photoW, photoH, pal, pal.bg)}
        <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}">
          <text x="${txtX}" y="${txtY}" font-size="${nameSize}" letter-spacing="-0.02em">${esc(c.name || "—")}</text>
        </g>
        <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${roleSize}" letter-spacing="0.08em">
          <text x="${txtX}" y="${txtY + nameSize + 8}">// ${esc(c.role || "")}</text>
        </g>
      `;
    }).join("");

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${pal.bg}"/>
  ${gridBg(w, h, pal, 90)}
  ${frameDecor(w, h, pal)}

  <!-- header -->
  <g font-family="Space Grotesk, sans-serif" font-weight="700" fill="${pal.ink}">
    <text x="40" y="${headerH * 0.6}" font-size="${titleSize}" letter-spacing="-0.03em">${esc(d.title || "I TUTOR")}</text>
  </g>
  <g font-family="Space Mono, monospace" fill="${pal.hot}" font-size="${subSize}" letter-spacing="0.16em">
    <text x="40" y="${headerH * 0.6 + subSize + 24}">// ${esc(d.sub || "")}</text>
  </g>
  <line x1="40" y1="${headerH + 20}" x2="${w - 40}" y2="${headerH + 20}" stroke="${pal.ink}" stroke-width="2"/>

  ${cells}

  <!-- bottom -->
  <g font-family="Space Mono, monospace" font-size="16" fill="${pal.dim}" letter-spacing="0.12em">
    <text x="40" y="${h - 55}">FOTO: PLACEHOLDER · UNA FOTO PER RENDER (carousel per gli altri)</text>
  </g>
  ${wordmarkMini(w - 320, h - 55, pal, 28)}
</svg>`.trim();
  }
};

/* =========================================================================
   NORMALIZZAZIONE — assicura che ogni template abbia `layouts[]`
   I template che non ne hanno vengono avvolti in un layout unico "base"
   ottenuto dal loro `render()` originale.
   ========================================================================= */
function normalizeTemplate(tpl) {
  if (!tpl.layouts) {
    tpl.layouts = [{
      id: "base",
      label: "Layout base",
      render: tpl.render,
    }];
  }
  return tpl;
}

/* =========================================================================
   REGISTRY
   ========================================================================= */
window.TEMPLATES = {
  course:      normalizeTemplate(TPL_COURSE),
  tutor:       normalizeTemplate(TPL_TUTOR),
  quote:       normalizeTemplate(TPL_QUOTE),
  savedate:    normalizeTemplate(TPL_SAVEDATE),
  testimonial: normalizeTemplate(TPL_TESTIMONIAL),
  partner:     normalizeTemplate(TPL_PARTNER),
  carousel:    normalizeTemplate(TPL_CAROUSEL),
  roster:      normalizeTemplate(TPL_ROSTER),
};
window.FORMATS = FORMATS;
window.PALETTES = PALETTES;
