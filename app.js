(() => {
  "use strict";

  const app = document.getElementById("app");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // backdrop condiviso
  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  document.body.appendChild(backdrop);

  let openEl = null, ph = null;

  // pagina progetti (progetti.html) = indice + pannello; home = vetrina che rimanda lì
  const INDEX = document.getElementById("indice");
  // telefono / tablet stretto: layout dedicato (swipe in home, feed nella pagina progetti).
  // Se si attraversa la soglia ridimensionando, si ricarica per ricostruire il layout giusto.
  const MQ = matchMedia("(max-width: 860px)");
  const MOBILE = MQ.matches;
  MQ.addEventListener && MQ.addEventListener("change", () => location.reload());
  const goProjects = (cat) => { location.href = "progetti.html" + (cat && cat.id ? "?cat=" + cat.id : ""); };

  /* --- altezza per l'embed Readymag: comunica al parent l'altezza reale --- */
  if (window.parent !== window) {
    let lastH = 0;
    const sendHeight = () => {
      const h = Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0);
      if (h !== lastH) { lastH = h; try { window.parent.postMessage({ type: "surreo:height", height: h }, "*"); } catch (e) {} }
    };
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight, { passive: true });
    new ResizeObserver(sendHeight).observe(document.documentElement);
  }

  /* --- le animazioni CSS in loop (marquee, logo, manifesto, about) si fermano fuori schermo --- */
  if ("IntersectionObserver" in window) {
    const offIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)), { rootMargin: "200px 0px" });
    document.querySelectorAll(".landing, .about, .collateral").forEach((el) => offIO.observe(el));
    window.__offIO = offIO;
  }

  /* --- dati --- */
  Promise.all([
    fetch("projects.json", { cache: "no-cache" }).then((r) => r.json()),
    fetch("videos.json", { cache: "no-cache" }).then((r) => r.json()).catch(() => ({})),
  ])
    .then(([data, vids]) => build(data.sections || [], vids || {}))
    .catch((e) => { app.innerHTML = '<p style="color:#b00;padding:20px">Impossibile caricare i progetti (' + e + ")</p>"; });

  const YT_THUMB = (id) => "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  // copertina piccola 320x180, già 16:9 (senza bande nere): per miniature e righe
  const YT_THUMB_S = (id) => "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
  const YT_EMBED = (id) => "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&mute=1&rel=0&playsinline=1&loop=1&playlist=" + id;
  const pretty = (s) => (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* --- costruzione categorie --- */
  function build(sections, vids) {
    const CATS = [];
    sections.forEach((s) => {
      const items = (s.projects || []).map((p) => ({
        kind: "proj", name: p.name, frames: p.frames || [],
        type: p.type || null, description: p.description || null, tags: p.tags || []
      }));
      if (s.id === "exhibit" && vids.exhibitCards && vids.exhibitCards.items) {
        vids.exhibitCards.items.forEach((it) => items.push({ kind: "video", name: it.title, vid: it.id }));
      }
      if (s.id === "virtual" && vids.virtualCards && vids.virtualCards.items) {
        vids.virtualCards.items.forEach((it) => items.push({ kind: "video", name: it.title, vid: it.id }));
      }
      CATS.push({ id: s.id, name: s.title, items });
    });
    if (vids.visual && vids.visual.items) {
      const items = [];
      vids.visual.items.forEach((it) => (it.videos || []).forEach((v) => items.push({ kind: "video", name: it.id ? pretty(it.id) : "Videoclip", vid: v })));
      CATS.push({ id: "videoclip", name: "Videoclip & Motion", items });
    }
    if (vids.website && vids.website.items) {
      CATS.push({ id: "website", name: "Website", items: vids.website.items.map((it) => ({ kind: "site", name: it.title, vid: it.id, url: it.url })) });
    }
    // "Virtual & VR Experience" ha pochi items → in fondo
    const vIdx = CATS.findIndex((c) => /virtual/i.test(c.name));
    if (vIdx >= 0) CATS.push(CATS.splice(vIdx, 1)[0]);
    if (MOBILE) { document.body.classList.add("is-mobile"); INDEX ? buildFeed(CATS) : buildMobileHome(CATS); return; }
    if (INDEX) { CATS.forEach(renderCategory); buildIndex(CATS); }
    else { buildCatPicker(CATS); buildShowcase(CATS); }
  }

  /* --- selettore categorie: manifesto tipografico sopra la sezione progetti ---
     Ogni riga è scalata per riempire la gabbia; ogni lettera è un cubo 3D che rotola
     (nero → rosso → contorno → nero) e l'onda attraversa le righe in loop. */
  const PICKER_LINES = [["graphic"], ["industrial", "exhibit"], ["videoclip", "website", "virtual"]];
  function buildCatPicker(CATS) {
    const projects = document.querySelector(".projects");
    if (!projects) return;
    const byId = {};
    CATS.forEach((c) => (byId[c.id] = c));
    const total = CATS.reduce((n, c) => n + c.items.length, 0);
    const esc = (t) => t.replace(/&/g, "&amp;");
    let k = 0;
    const cube = (txt, line) => [...txt].map((ch) => {
      const d = (k++) * 45 + line * 350;
      return ch === " " ? '<span class="ch" style="--d:' + d + '">&nbsp;</span>'
        : '<span class="ch" style="--d:' + d + '" aria-hidden="true"><i>' + esc(ch) + "</i><i>" + esc(ch) + "</i><i>" + esc(ch) + "</i><i>" + esc(ch) + "</i></span>";
    }).join("");
    const picker = document.createElement("section");
    picker.className = "cat-picker";
    picker.setAttribute("aria-label", "What we do");
    picker.innerHTML = '<div class="cat-picker__inner"><h2 class="mf__title">What we do</h2><nav class="mf">' +
      PICKER_LINES.map((ids, li) => {
        k = 0;
        return '<div class="mf__ln">' + ids.filter((id) => byId[id]).map((id) => {
          const c = byId[id];
          return '<a class="mf__w" href="progetti.html?cat=' + id + '" aria-label="' + esc(c.name) + " — " + c.items.length + ' lavori">' +
            cube(c.name, li) + "<sup>" + c.items.length + "</sup></a>";
        }).join('<span class="mf__dot" aria-hidden="true">·</span>') + "</div>";
      }).join("") +
      '<div class="mf__foot"><span><b>' + CATS.length + " discipline</b> — " + total + " lavori</span>" +
      '<a href="#contact">Non partiamo da una disciplina. Partiamo da un’idea →</a></div></nav></div>';
    projects.parentNode.insertBefore(picker, projects);
    if (window.__offIO) window.__offIO.observe(picker);
    const mf = picker.querySelector(".mf");
    const fit = () => mf.querySelectorAll(".mf__ln").forEach((ln) => {
      ln.style.fontSize = "100px";
      const w = [...ln.children].reduce((s, el) => s + el.getBoundingClientRect().width, 0) + (ln.children.length - 1) * 30;
      ln.style.fontSize = Math.min(220, (100 * mf.clientWidth / w) * 0.985) + "px";
    });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
    addEventListener("resize", fit);
  }


  /* --- vetrina home "spazio 3D": i lavori sospesi in uno spazio configurabile (canvas 2D,
     proiezione prospettica a mano: niente librerie). Ogni disciplina si ricompone nella sua
     figura, gli altri lavori restano come punti. Trascina = ruota, rotella = zoom, viste.
     Leggera: miniature 256px già in grigio (pre-render una volta), gira solo a schermo. --- */
  const SHW = {
    graphic:    ["GR", ["Brand identity", "Editoria", "Packaging", "Social"]],
    industrial: ["ID", ["Concept", "3D", "Render", "Display"]],
    exhibit:    ["EX", ["Allestimenti", "Videomapping", "AR"]],
    videoclip:  ["VC", ["Regia", "Montaggio", "Motion", "Spot"]],
    website:    ["WB", ["Web design", "Sviluppo", "SEO", "Tour 360°"]],
    virtual:    ["VR", ["Unreal", "VR", "Metaverso"]]
  };
  // figure 3D: n punti nel cubo [-1,1]^3
  const FIG = {
    all(n) { const k = Math.ceil(Math.cbrt(n * 1.4)), L = Math.ceil(n / (k * k)) - 1 || 1;
      return [...Array(n)].map((_, i) => [((i % k) / (k - 1) - 0.5) * 1.5, (((i / k | 0) % k) / (k - 1) - 0.5) * 1.3, ((i / (k * k) | 0) / L - 0.5) * 1.2]); },
    graphic(n) { return [...Array(n)].map((_, i) => { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), t = i * 2.39996; return [Math.cos(t) * r * 0.85, y * 0.85, Math.sin(t) * r * 0.85]; }); },
    industrial(n) { const c = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]; return [...Array(n)].map((_, i) => c[i % 8].map((v) => v * 0.55)); },
    exhibit(n) { return [...Array(n)].map((_, i) => { const t = Math.PI * (i + 0.5) / n; return [-Math.cos(t) * 0.75, -Math.sin(t) * 0.85 + 0.4, ((i % 2) - 0.5) * 0.5]; }); },
    videoclip(n) { const p = []; let c = 4, col = 0; while (p.length < n) { for (let j = 0; j < c && p.length < n; j++) p.push([-0.6 + col * 0.4, (j - (c - 1) / 2) * 0.38, ((j + col) % 2 - 0.5) * 0.3]); c--; col++; if (c < 1) { c = 4; col = 0; } } return p; },
    website(n) { const c = Math.ceil(Math.sqrt(n * 1.5)); return [...Array(n)].map((_, i) => [((i % c) / (c - 1 || 1) - 0.5) * 1.2, ((i / c | 0) - 0.5) * 0.6, 0]); },
    virtual(n) { return [...Array(n)].map((_, i) => { const t = i / n * 2 * Math.PI; return [Math.cos(t) * 0.8, Math.sin(i * 1.7) * 0.12, Math.sin(t) * 0.8]; }); }
  };
  function buildShowcase(CATS) {
    const sec = document.querySelector(".projects");
    sec.classList.add("projects--shw");
    const pad = (n) => String(n).padStart(2, "0");
    const code6 = (s) => { let h = 5381; for (const c of s) h = (h * 33 ^ c.charCodeAt(0)) >>> 0; return String(500000 + h % 99999); };
    const IDS = CATS.map((c) => c.id).filter((id) => SHW[id]);
    const CAT = {}; CATS.forEach((c) => (CAT[c.id] = c));
    const A = [];
    CATS.forEach((c) => c.items.forEach((it, ii) => { if (thumbURL(it)) A.push({ cat: c.id, name: it.name, src: thumbURL(it), code: code6(it.name), href: "progetti.html?cat=" + c.id + "&p=" + (ii + 1) }); }));
    const count = (id) => A.filter((a) => a.cat === id).length;
    const short = (c) => c.name.split(/[ ,]/)[0];

    app.innerHTML =
      '<div class="shw"><div class="shw__bar"><span class="shw__lbl">Scene / Layer</span><div class="shw__pills"></div></div>' +
      '<div class="shw__stage"><canvas></canvas><div class="shw__views"></div></div><div class="shw__cap"></div></div>';
    const stage = app.querySelector(".shw__stage"), cv = stage.querySelector("canvas"), ctx = cv.getContext("2d"),
      pills = app.querySelector(".shw__pills"), cap = app.querySelector(".shw__cap"), vb = app.querySelector(".shw__views");
    pills.innerHTML = '<button type="button" class="shw__pill" data-c="all">All<sup>' + A.length + "</sup></button>" +
      IDS.map((id) => '<button type="button" class="shw__pill" data-c="' + id + '">' + short(CAT[id]) + "<sup>" + count(id) + "</sup></button>").join("");

    // immagini: originale (hover, a colori) + copia in grigio fatta una volta sola
    // si scaricano solo quando il palco sta per entrare a schermo (vedi loadImgs più sotto)
    const G = 96;
    A.forEach((a) => {
      a.img = new Image(); a.img.decoding = "async";
      a.img.onload = () => {
        const g = document.createElement("canvas"), r = a.img.width / a.img.height;
        g.width = r >= 1 ? G : Math.round(G * r); g.height = r >= 1 ? Math.round(G / r) : G;
        const c = g.getContext("2d"); c.filter = "grayscale(1) contrast(1.1)"; c.drawImage(a.img, 0, 0, g.width, g.height);
        a.gray = g; a.ar = r; a.ok = true;
      };
      a.p = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]; a.t = a.p.slice(); a.sz = 0; a.tsz = 1; a.delay = 0;
    });

    let W = 0, H = 0, DPR = 1;
    const size = () => { DPR = Math.min(1.5, devicePixelRatio || 1); W = stage.clientWidth; H = stage.clientHeight; cv.width = W * DPR; cv.height = H * DPR; };
    size(); let rT = 0; addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(size, 100); });

    let mode = "all", nodes = [];
    const go = (c) => {
      mode = c;
      const on = c === "all" ? A : A.filter((a) => a.cat === c), pts = FIG[c](on.length), now = performance.now();
      on.forEach((a, i) => { a.t = pts[i]; a.tsz = c === "all" ? 0.9 : 1.5; a.delay = now + i * 18; a.on = true; });
      A.forEach((a) => { if (!on.includes(a)) { a.t = [(Math.random() - 0.5) * 1.9, (Math.random() - 0.5) * 1.9, (Math.random() - 0.5) * 1.9]; a.tsz = 0.12; a.on = false; a.delay = now; } });
      nodes = on.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(4, on.length));
      const n = on.length;
      cap.innerHTML = "<span><b>" + (c === "all" ? "All" : SHW[c][0] + "·" + pad(IDS.indexOf(c) + 1)) + "</b> " + (c === "all" ? IDS.length + " discipline" : CAT[c].name) + " — " + pad(n) + " lavori</span>" +
        "<span>" + (c === "all" ? IDS.map((k) => SHW[k][0]).join(" · ") : SHW[c][1].join(" · ")) + "</span>" +
        '<a href="progetti.html' + (c === "all" ? "" : "?cat=" + c) + '">' + (c === "all" ? "Tutti i progetti" : "Vedi i " + n + " progetti") + " →</a>";
      pills.querySelectorAll(".shw__pill").forEach((p) => p.classList.toggle("is-on", p.dataset.c === c));
    };
    // ferma su "All": si configura solo al click su un livello
    let visible = false;
    pills.addEventListener("click", (e) => { const p = e.target.closest(".shw__pill"); if (p && p.dataset.c !== mode) go(p.dataset.c); });

    // camera: trascina = ruota, rotella = zoom, viste preimpostate
    let hover = null, yaw = 0.6, pitch = 0.38, zoom = 1, tYaw = null, tPitch = null, drag = null, spin = !reduce, moved = 0, mx = -1, my = -1;
    cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; moved = 0; spin = false; tYaw = tPitch = null; cv.setPointerCapture(e.pointerId); setView(""); });
    cv.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); yaw += dx * 0.008; pitch = Math.max(-0.1, Math.min(1.45, pitch + dy * 0.006)); drag = { x: e.clientX, y: e.clientY }; }
    });
    cv.addEventListener("pointerup", () => { drag = null; if (moved < 5 && hover) location.href = hover.href; });
    cv.addEventListener("pointerleave", () => { mx = -1; });
    cv.addEventListener("wheel", (e) => { e.preventDefault(); zoom = Math.max(0.6, Math.min(2.2, zoom * Math.exp(-e.deltaY * 0.001))); }, { passive: false });
    const VIEWS = { persp: [0.6, 0.38], top: [0, 1.45], front: [0, 0.02], side: [Math.PI / 2, 0.05] };
    vb.innerHTML = Object.keys(VIEWS).map((k) => '<button type="button" data-v="' + k + '">' + k + "</button>").join("") + '<button type="button" data-v="orbit" class="is-on">orbit</button>';
    const setView = (k) => vb.querySelectorAll("button").forEach((b) => b.classList.toggle("is-on", b.dataset.v === k));
    vb.addEventListener("click", (e) => {
      const k = e.target.dataset.v; if (!k) return; setView(k);
      if (k === "orbit") { spin = true; tYaw = tPitch = null; return; }
      spin = false; tYaw = VIEWS[k][0] + Math.round((yaw - VIEWS[k][0]) / (2 * Math.PI)) * 2 * Math.PI; tPitch = VIEWS[k][1];
    });

    const HUD = [...Array(6)].map(() => String(Math.random() * 1e6 | 0).padStart(6, "0"));
    const INK = (a) => "rgba(236,234,225," + a + ")", BLUE = "#2a3cff", FY = 1.1;
    let raf = 0;
    const frame = (now) => {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      if (spin) yaw += 0.0022;
      if (tYaw != null) { yaw += (tYaw - yaw) * 0.08; pitch += (tPitch - pitch) * 0.08; }
      const ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pitch), sb = Math.sin(pitch);
      const S = Math.min(W * 0.5, H) * 0.42 * zoom, cx = W / 2, cy = H * 0.5, f = 5.5;
      const P = (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb, k = f / (f + z2); return [cx + x1 * S * k, cy + y1 * S * k, k, z2]; };
      // pavimento a griglia + assi
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i += 0.5) {
        const al = i % 1 === 0 ? 0.16 : 0.07;
        let p = P(i, FY, -3), q = P(i, FY, 3); ctx.strokeStyle = INK(al); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        p = P(-3, FY, i); q = P(3, FY, i); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
      ctx.font = "600 9px ui-monospace,monospace";
      [[[-3, FY, 0], [3, FY, 0], "X"], [[0, FY, -3], [0, FY, 3], "Z"], [[0, FY, 0], [0, -1.4, 0], "Y"]].forEach(([a, b, l]) => {
        const p = P(...a), q = P(...b); ctx.strokeStyle = l === "Y" ? "rgba(42,60,255,.6)" : INK(0.4); ctx.setLineDash(l === "Y" ? [3, 4] : []);
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = INK(0.7); ctx.fillText(l, q[0] + 4, q[1] - 4);
      });
      // HUD
      ctx.fillStyle = INK(0.55); HUD.forEach((h, i) => ctx.fillText(h, 18, 24 + i * 13));
      const deg = (v) => ((v * 57.2958 % 360 + 360) % 360).toFixed(1) + "°";
      ctx.textAlign = "right"; ctx.fillText("CAM YAW " + deg(yaw) + "  PITCH " + deg(pitch), W - 18, 24);
      ctx.fillText("ZOOM " + zoom.toFixed(2) + "  ·  N " + (mode === "all" ? A.length : count(mode)) + "/" + A.length, W - 18, 37); ctx.textAlign = "left";
      const gx = 40, gy = H - 40;
      [[1, 0, 0, "X", INK(0.9)], [0, -1, 0, "Y", BLUE], [0, 0, 1, "Z", INK(0.9)]].forEach(([x, y, z, l, c]) => {
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb;
        ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + x1 * 20, gy + y1 * 20); ctx.stroke(); ctx.fillText(l, gx + x1 * 26 - 3, gy + y1 * 26 + 3);
      });
      ctx.lineWidth = 1;
      // movimento verso le figure
      A.forEach((a) => { if (now < a.delay) return; for (let k = 0; k < 3; k++) a.p[k] += (a.t[k] - a.p[k]) * 0.07; a.sz += (a.tsz - a.sz) * 0.08; });
      const L = A.map((a) => { const q = P(a.p[0], a.p[1], a.p[2]); return { a, x: q[0], y: q[1], k: q[2], z: q[3] }; }).sort((p, q) => q.z - p.z);
      hover = null;
      if (mx >= 0 && !drag) for (let i = L.length - 1; i >= 0; i--) { const o = L[i]; if (!o.a.on) continue; const s = 50 * o.a.sz * o.k; if (Math.abs(mx - o.x) < s / 2 && Math.abs(my - o.y) < s / 2) { hover = o.a; break; } }
      cv.style.cursor = drag ? "grabbing" : hover ? "pointer" : "grab";
      // linee di quota fino al pavimento
      ctx.setLineDash([2, 3]); ctx.strokeStyle = INK(0.16); ctx.beginPath();
      L.forEach((o) => { if (!o.a.on) return; const fl = P(o.a.p[0], FY, o.a.p[2]); ctx.moveTo(o.x, o.y); ctx.lineTo(fl[0], fl[1]); });
      ctx.stroke(); ctx.setLineDash([]);
      L.forEach((o) => {
        const a = o.a, s = 50 * a.sz * o.k;
        if (!a.on) { const d = Math.max(1.5, s * 0.35); ctx.fillStyle = INK(0.2 + o.k * 0.25); ctx.fillRect(o.x - d / 2, o.y - d / 2, d, d); return; }
        if (!a.ok) return;
        const hs = a === hover ? 1.7 : 1, w = (a.ar >= 1 ? s : s * a.ar) * hs, h = (a.ar >= 1 ? s / a.ar : s) * hs;
        ctx.globalAlpha = Math.min(1, Math.max(0.4, o.k * 0.95));
        ctx.drawImage(a === hover ? a.img : a.gray, o.x - w / 2, o.y - h / 2, w, h);
        ctx.strokeStyle = a === hover ? BLUE : INK(0.5); ctx.lineWidth = a === hover ? 2 : 1; ctx.strokeRect(o.x - w / 2, o.y - h / 2, w, h); ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
      });
      // nodi blu con numeri (+ nome sotto il mouse)
      const show = hover && !nodes.includes(hover) ? [...nodes, hover] : nodes;
      ctx.font = "600 10px ui-monospace,monospace";
      show.forEach((a, i) => {
        const q = P(a.p[0], a.p[1], a.p[2]), right = q[0] > cx, ex = q[0] + (right ? 1 : -1) * (70 + i * 14), ey = q[1] - 56 - i * 16;
        ctx.strokeStyle = INK(0.75); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(q[0], q[1], i === 0 ? 9 : 3.5, 0, 7); ctx.fill();
        ctx.fillStyle = INK(1); ctx.textAlign = right ? "left" : "right";
        ctx.fillText(a === hover ? a.name.toUpperCase() + "  " + a.code : a.code, ex + (right ? 4 : -4), ey + 3); ctx.textAlign = "left";
      });
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    go("all");
    new IntersectionObserver((e, o) => {
      if (e[0].isIntersecting) { A.forEach((a) => (a.img.src = a.src)); o.disconnect(); }
    }, { rootMargin: "800px 0px" }).observe(stage);
    new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }, { threshold: 0.15 }).observe(stage);
  }

  // miniatura 256px generata da make_thumbs.py: assets/projects/<id>/NN.jpg -> .../<id>/t/NN.jpg
  const toThumb = (src) => src.replace(/\/([^/]+)$/, "/t/$1");
  const thumbURL = (it) => (it.kind === "proj" ? (it.frames[0] ? toThumb(it.frames[0]) : "") : YT_THUMB_S(it.vid));

  // colori accent per categoria (in ordine)
  const CAT_ACCENTS = ["#ff2bd6", "#2be5ff", "#b5ff2b", "#ff8a2b", "#b02bff", "#ff2b7e"];

  function renderCategory(cat, index) {
    const el = document.createElement("section");
    el.className = "cat";
    el.style.setProperty("--accent", CAT_ACCENTS[index % CAT_ACCENTS.length]);
    const act = (i) => (INDEX ? open(el, i) : goProjects(cat));
    if (/videoclip|website|exhibit|virtual/i.test(cat.name)) el.classList.add("cat--wide");

    // --- chiuso ---
    const closed = document.createElement("div");
    closed.className = "cat__closed";
    closed.innerHTML =
      '<div class="cat__top"><span class="cat__name">' + cat.name + "</span>" +
      '<button class="cat__count" type="button" aria-label="Apri categoria ' + cat.name + '">' +
        String(cat.items.length).padStart(2, "0") + " progetti &rarr;</button></div>" +
      '<div class="cat__line"></div>';
    closed.querySelector(".cat__count").addEventListener("click", (e) => {
      e.stopPropagation(); act(0);
    });
    closed.querySelector(".cat__name").addEventListener("click", (e) => {
      e.stopPropagation(); act(0);
    });
    const strip = document.createElement("div");
    strip.className = "strip";
    cat.items.forEach((it, i) => {
      const b = document.createElement("button");
      b.className = "thumb"; b.type = "button"; b.setAttribute("aria-label", "Apri " + it.name);
      b.innerHTML = '<img loading="lazy" alt="' + it.name + '" src="' + thumbURL(it) + '">';
      b.addEventListener("click", (e) => { e.stopPropagation(); act(i); });
      if (it.kind === "proj") b.classList.add("is-proj");
      if (it.kind === "proj" && it.frames && it.frames.length > 1) {
        b._frames = it.frames.map(toThumb);
        attachHoverGif(b);
      }
      strip.appendChild(b);
    });
    closed.appendChild(strip);
    el.appendChild(closed);

    // marquee: LOOP seamless con clonazione.
    // Cloniamo il set originale N volte finché la larghezza totale supera 2× viewport.
    // Retry robusto: se al primo giro il layout non è pronto (scrollWidth o clientWidth = 0),
    // riproviamo via rAF, load, ResizeObserver e timer di fallback finché non parte.
    if (!reduce && !INDEX && cat.items.length > 1) {
      let setupDone = false;
      const setupMarquee = () => {
        if (setupDone) return true;
        const originalW = strip.scrollWidth;
        const viewW = strip.clientWidth;
        if (!viewW || !originalW) return false;
        setupDone = true;

        let paused = false, userLock = false, userTimer = 0;
        const release = (ms) => { clearTimeout(userTimer); userTimer = setTimeout(() => { userLock = false; }, ms); };
        strip.addEventListener("mouseenter", () => { paused = true; });
        strip.addEventListener("mouseleave", () => { paused = false; });
        strip.addEventListener("wheel", () => { userLock = true; release(1400); }, { passive: true });
        strip.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") { userLock = true; } }, { passive: true });
        strip.addEventListener("pointerup",   (e) => { if (e.pointerType !== "mouse") { release(1800); } }, { passive: true });
        const speed = 0.35;

        // direzione: pari →, dispari ← (marquee asimmetrico)
        const dirSign = (index % 2 === 0) ? 1 : -1;

        const baseHalf = originalW;
        const originals = Array.from(strip.children);
        const minTotal = Math.max(viewW * 2 + originalW, originalW * 2);
        let totalW = originalW, safety = 0;
        while (totalW < minTotal && safety < 20) {
          originals.forEach((btn, i) => {
            const clone = btn.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            clone.setAttribute("tabindex", "-1");
            clone.addEventListener("click", (e) => { e.stopPropagation(); act(i); });
            if (btn._frames) { clone._frames = btn._frames; attachHoverGif(clone); }
            strip.appendChild(clone);
          });
          totalW += originalW;
          safety++;
        }

        if (dirSign === -1) strip.scrollLeft = baseHalf;
        // posizione in float: su schermi 1× (o con zoom) il browser arrotonda scrollLeft
        // al pixel intero, quindi "scrollLeft += 0.35" rileggerebbe sempre lo stesso valore
        // e la riga resterebbe ferma. Si risincronizza solo se l'utente ha scrollato a mano.
        let pos = strip.scrollLeft;
        const step = () => {
          if (!paused && !userLock && !el.classList.contains("is-open")) {
            if (Math.abs(strip.scrollLeft - pos) > 2) pos = strip.scrollLeft;
            pos += speed * dirSign;
            if (pos >= baseHalf) pos -= baseHalf;
            else if (pos <= 0) pos += baseHalf;
            strip.scrollLeft = pos;
          }
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        return true;
      };
      // tentativi multipli finché il layout è pronto
      requestAnimationFrame(() => requestAnimationFrame(setupMarquee));
      [80, 250, 600, 1400, 3000].forEach((ms) => setTimeout(setupMarquee, ms));
      window.addEventListener("load", setupMarquee);
      if (typeof ResizeObserver === "function") {
        const ro = new ResizeObserver(() => { if (setupMarquee()) ro.disconnect(); });
        ro.observe(strip);
      }
    }

    // --- aperto --- (solo nella pagina progetti: la home è una vetrina e non apre pannelli;
    // costruirli lì faceva partire player YouTube e foto grandi nascosti)
    if (!INDEX) { app.appendChild(el); return; }
    const openW = document.createElement("div");
    openW.className = "cat__open"; openW.setAttribute("aria-hidden", "true");
    openW.innerHTML =
      '<div class="open__bar"><span class="open__name">' + cat.name + "</span>" +
      '<button class="close" type="button" aria-label="Chiudi sezione">&times;</button></div>';
    const car = document.createElement("div");
    car.className = "carousel";
    cat.items.forEach((it, i) => car.appendChild(makeCard(it, cat)));
    openW.appendChild(car);
    const foot = document.createElement("div");
    foot.className = "open__foot";
    foot.innerHTML = "<span>Scorri &rarr; · click card = info</span>" +
      '<span class="mono g-pos">01 / ' + String(cat.items.length).padStart(2, "0") + "</span>";
    openW.appendChild(foot);
    el.appendChild(openW);

    openW.querySelector(".close").addEventListener("click", (e) => { e.stopPropagation(); close(); });

    // --- animazione scroll: card centrata = attiva (gif/video) + contatore ---
    const pos = foot.querySelector(".g-pos"), tot = cat.items.length;
    const animate = () => {
      if (!el.classList.contains("is-open")) return;   // pannello chiuso: niente gif/video
      const cx = car.getBoundingClientRect().left + car.clientWidth / 2;
      let best = 1e9, idx = 0, list = car.querySelectorAll(".pcard");
      list.forEach((c, i) => { const r = c.getBoundingClientRect(); const dc = (r.left + r.width / 2) - cx; if (Math.abs(dc) < best) { best = Math.abs(dc); idx = i; } });
      list.forEach((c, i) => setActive(c, i === idx));
      pos.textContent = String(idx + 1).padStart(2, "0") + " / " + String(tot).padStart(2, "0");
    };
    let raf = null;
    car.addEventListener("scroll", () => { if (raf) return; raf = requestAnimationFrame(() => { animate(); raf = null; }); }, { passive: true });
    // iOS Safari: scrollend può non arrivare durante scroll-snap; ripasso periodico finché aperto
    car.addEventListener("touchend", () => { setTimeout(animate, 120); setTimeout(animate, 360); }, { passive: true });
    el._animate = animate; el._car = car;

    app.appendChild(el);
  }

  /* --- pagina progetti: indice (filtro per categoria) + elenco + anteprima --- */
  const CODES = { graphic: "GR", industrial: "ID", exhibit: "EX", videoclip: "VC", website: "WB", virtual: "VR" };
  function buildIndex(CATS) {
    const pad = (n) => String(n).padStart(2, "0");
    const catEls = document.querySelectorAll("#app > .cat");
    const tot = CATS.reduce((s, c) => s + c.items.length, 0);
    const nav = INDEX.querySelector(".ix-idx"), list = INDEX.querySelector(".ix-list");
    let prevStop = null, prevTimer = 0;
    const stopPrev = () => {
      if (prevStop) { prevStop(); prevStop = null; }
      clearTimeout(prevTimer);
      const f = prev.querySelector("iframe"); if (f) f.remove();
    };
    // il riquadro prende la forma di ciò che mostra (16:9 video, quadrato/verticale progetti):
    // largo quanto la colonna, ma mai più alto dello spazio che resta sotto l'indice
    let prevAR = 1;
    const sizePrev = (ar) => {
      if (ar) prevAR = ar;
      const wrap = prev.parentElement, cap = wrap.querySelector("figcaption");
      const aw = wrap.clientWidth, ah = wrap.clientHeight - (cap ? cap.offsetHeight + 6 : 0);
      if (!aw || ah <= 0) return;
      let w = aw, h = w / prevAR;
      if (h > ah) { h = ah; w = h * prevAR; }
      prev.style.width = Math.floor(w) + "px"; prev.style.height = Math.floor(h) + "px";
    };
    addEventListener("resize", () => sizePrev());
    const prev = INDEX.querySelector(".ix-prev__box"), prevN = INDEX.querySelector(".ix-prev__n"), prevT = INDEX.querySelector(".ix-prev__t");

    const li = (id, n, name, count) =>
      '<li><button type="button" data-cat="' + id + '"><span class="n">' + n + '</span><span class="t">' + name +
      '</span><span class="d"></span><span class="c">' + count + "</span></button></li>";
    nav.innerHTML = li("", "00", "Tutti", tot) + CATS.map((c, i) => li(c.id, pad(i + 1), c.name, pad(c.items.length))).join("");

    CATS.forEach((c, ci) => {
      const sec = document.createElement("section");
      sec.className = "ix-sec"; sec.dataset.cat = c.id;
      sec.innerHTML = '<h2 class="ix-sec__h"><span>§ ' + pad(ci + 1) + " — " + c.name + '</span><span class="ix-sec__c">' + pad(c.items.length) + " voci</span></h2>";
      c.items.forEach((it, ii) => {
        const row = document.createElement("button");
        row.type = "button"; row.className = "ix-row" + (it.kind === "proj" ? "" : " is-wide");
        const code = (CODES[c.id] || "XX") + "·" + pad(ii + 1);
        const tags = (it.tags && it.tags.length ? it.tags : [it.kind === "site" ? "Website" : "Video"]).slice(0, 3).join(" / ");
        row.innerHTML = '<span class="ix-row__n">' + code + '</span><span class="ix-row__th"><img loading="lazy" alt="" src="' + thumbURL(it) + '"></span>' +
          '<span class="ix-row__nm">' + it.name + '</span><span class="ix-row__tg">' + tags + "</span>";
        const show = () => {
          if (prev._it === it) return;
          stopPrev(); prev._it = it;
          // anteprima grande: foto intera (la miniatura 256px qui si vedrebbe sgranata)
          prev.innerHTML = '<img alt="" src="' + (it.kind === "proj" && it.frames[0] ? it.frames[0] : thumbURL(it)) + '">'; prev.classList.toggle("is-wide", it.kind !== "proj");
          prevN.textContent = "fig. " + code; prevT.textContent = it.name;
          // in hover l'anteprima si anima: gif per i progetti, video muto per video/siti
          // (il video parte dopo una breve pausa, così scorrendo veloce non si aprono decine di player)
          const img = prev.querySelector("img");
          if (it.kind === "proj") {
            // forma reale del frame (quasi tutti quadrati, alcuni verticali 4:5)
            sizePrev(1);
            const fit = () => { if (prev._it === it && img.naturalWidth) sizePrev(img.naturalWidth / img.naturalHeight); };
            if (img.complete) fit(); else img.addEventListener("load", fit, { once: true });
            if (it.frames.length > 1) prevStop = cycleFrames(img, it.frames);
          } else {
            sizePrev(16 / 9);
            if (it.vid) prevTimer = setTimeout(() => {
              const f = document.createElement("iframe");
              f.src = YT_EMBED(it.vid); f.allow = "autoplay; encrypted-media"; f.title = it.name; f.tabIndex = -1;
              // resta invisibile (si vede la copertina) finché il player non è caricato
              f.style.opacity = "0";
              f.addEventListener("load", () => { f.style.opacity = "1"; }, { once: true });
              prev.appendChild(f);
            }, 400);
          }
        };
        row.addEventListener("mouseenter", show);
        row.addEventListener("focus", show);
        row.addEventListener("click", () => { stopPrev(); prev._it = null; const el = catEls[ci]; el._from = row; open(el, ii); });
        if (ci === 0 && ii === 0) show();
        sec.appendChild(row);
      });
      list.appendChild(sec);
    });

    // titoli troppo lunghi per la colonna (una parola che non ci sta): corpo ridotto
    // riga per riga invece di spezzare la parola
    const fitNames = () => list.querySelectorAll(".ix-row__nm").forEach((n) => {
      n.style.fontSize = "";
      let fs = parseFloat(getComputedStyle(n).fontSize);
      while (n.scrollWidth > n.clientWidth + 1 && fs > 14) { fs -= 1; n.style.fontSize = fs + "px"; }
    });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fitNames);
    let fitT = 0; addEventListener("resize", () => { clearTimeout(fitT); fitT = setTimeout(fitNames, 120); });

    // filtro: ?cat=<id> nell'indirizzo, così ogni categoria ha il suo link
    const setCat = (id) => {
      nav.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.cat === id));
      list.querySelectorAll(".ix-sec").forEach((s) => { s.hidden = !!id && s.dataset.cat !== id; });
      const u = new URL(location.href);
      id ? u.searchParams.set("cat", id) : u.searchParams.delete("cat");
      history.replaceState(null, "", u);
    };
    nav.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      setCat(b.dataset.cat);
      list.scrollTo({ top: 0, behavior: "auto" });
    });
    // arrivando da una categoria della home (?cat=) la pagina si apre già filtrata su quella
    const start = new URLSearchParams(location.search).get("cat") || "";
    setCat(CATS.some((c) => c.id === start) ? start : "");
    const startP = +(new URLSearchParams(location.search).get("p") || 0);
    const target = start && list.querySelectorAll('.ix-sec[data-cat="' + start + '"] .ix-row')[startP ? startP - 1 : 0];

    // la pagina è ferma: scorre solo l'elenco. Spazio sopra/sotto pari a mezzo rullo,
    // così anche la prima e l'ultima riga possono arrivare al centro (linea rossa)
    const pay = INDEX.querySelector(".ix-pay");
    const fit = () => {
      const first = list.querySelector(".ix-row");
      const half = list.clientHeight / 2 - (first ? first.offsetHeight / 2 : 60);
      list.style.paddingTop = list.style.paddingBottom = Math.max(0, half) + "px";
      if (pay) pay.style.top = (list.offsetTop + list.clientHeight / 2) + "px";
    };
    fit();
    addEventListener("resize", fit);
    const centerOn = (el) => { list.scrollTop = el.offsetTop - list.offsetTop - (list.clientHeight - el.offsetHeight) / 2; };
    if (target) requestAnimationFrame(() => {
      centerOn(target);
      target.dispatchEvent(new Event("mouseenter"));   // anteprima sulla categoria scelta
      // arrivando da una miniatura della home (?p=) il progetto si apre subito
      if (startP) setTimeout(() => {
        target.click();
        const u = new URL(location.href); u.searchParams.delete("p"); history.replaceState(null, "", u);
      }, 350);
    });

    // scorrimento "a rullo di slot": le righe verso il bordo alto/basso dello schermo
    // si inclinano all'indietro e sfumano, come se il rullo ruotasse
    if (!reduce) {
      const rows = [...list.querySelectorAll(".ix-row, .ix-sec__h")];
      let ticking = false;
      const drum = () => {
        ticking = false;
        const box = list.getBoundingClientRect(), mid = box.top + box.height / 2, half = box.height / 2;
        rows.forEach((r) => {
          if (r.offsetParent === null) return;               // sezione filtrata
          const b = r.getBoundingClientRect();
          if (b.bottom < box.top - 40 || b.top > box.bottom + 40) return;
          // rullo cilindrico: ogni riga ruota in proporzione alla distanza dal centro dello schermo
          const d = Math.max(-1, Math.min(1, (b.top + b.height / 2 - mid) / half));  // -1 alto … +1 basso
          const a = Math.abs(d);
          r.style.transform = "perspective(1000px) rotateX(" + (-d * 68).toFixed(1) + "deg) scale(" + (1 - a * a * 0.14).toFixed(3) + ")";
          r.style.opacity = (1 - Math.pow(a, 1.7) * 0.88).toFixed(3);
        });
      };
      const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(drum); } };
      list.addEventListener("scroll", req, { passive: true });
      addEventListener("resize", req);
      nav.addEventListener("click", () => setTimeout(req, 50));
      req();
    }
  }

  /* =====================================================================
     MOBILE — home: copertine grandi a swipe per categoria · progetti: feed
     ===================================================================== */
  const toM = (src) => src.replace(/\/([^/]+)$/, "/m/$1");            // versione 560px
  const coverM = (it) => (it.kind === "proj" ? (it.frames[0] ? toM(it.frames[0]) : "") : YT_THUMB_S(it.vid));
  const pad2 = (n) => String(n).padStart(2, "0");

  // gif che parte solo sulla copertina "in scena" (una alla volta), ferma le altre
  function gifStage() {
    let cur = null, stop = null;
    return (el, it) => {
      if (cur === el) return;
      if (stop) { stop(); stop = null; }
      if (cur) { const i = cur.querySelector("img"); if (i && cur._first) i.src = cur._first; }
      cur = el;
      if (el && it && it.kind === "proj" && it.frames.length > 1 && !reduce) {
        const img = el.querySelector("img"); el._first = img.src;
        stop = cycleFrames(img, it.frames.map(toM));
      }
    };
  }

  function buildMobileHome(CATS) {
    app.classList.add("mhome");
    const note = document.querySelector(".projects .sec-head__note");
    if (note) note.textContent = "Scorri · tocca per aprire";
    CATS.forEach((cat) => {
      const play = gifStage();                        // una gif per riga, si ferma quando la riga esce
      const sec = document.createElement("section");
      sec.className = "mcat";
      const href = "progetti.html?cat=" + cat.id;
      const cards = cat.items.slice(0, 8).map((it, i) =>
        '<a class="mcard" href="' + href + '" data-i="' + i + '"><div class="mcard__ph' + (it.kind === "proj" ? "" : " is-wide") + '">' +
        '<img loading="lazy" alt="' + it.name + '" src="' + coverM(it) + '"></div>' +
        '<div class="mcard__cap"><b>' + it.name + '</b><span>' + pad2(i + 1) + "</span></div></a>").join("");
      const more = cat.items.length > 8 ? '<a class="mcard mcard--more" href="' + href + '"><span>Tutti i ' + cat.items.length + "<br>progetti →</span></a>" : "";
      sec.innerHTML = '<a class="mcat__head" href="' + href + '"><b>' + cat.name + "</b><span>" + pad2(cat.items.length) + " →</span></a>" +
        '<div class="mcat__row">' + cards + more + "</div>";
      app.appendChild(sec);
      // copertina al centro della riga = gif in play (solo se la riga è a schermo)
      const row = sec.querySelector(".mcat__row");
      let rowOn = false, center = null;
      new IntersectionObserver((es) => { rowOn = es[0].isIntersecting; play(rowOn ? center : null, rowOn && center ? cat.items[+center.dataset.i] : null); }, { threshold: 0.5 }).observe(row);
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) center = e.target; });
        if (rowOn && center && center.dataset.i) play(center, cat.items[+center.dataset.i]);
      }, { root: row, threshold: 0.7 });
      row.querySelectorAll(".mcard[data-i]").forEach((c) => io.observe(c));
    });

    // scorrendo la pagina in giù le file si muovono di lato (direzioni alternate),
    // così si capisce che si sfogliano. Toccata una fila, la guida l'utente.
    if (reduce) return;
    const rows = [...app.querySelectorAll(".mcat__row")];
    rows.forEach((r) => {
      r.classList.add("is-auto");                         // niente aggancio mentre si muove da sola
      const take = () => { if (r._user) return; r._user = true; r.classList.remove("is-auto"); };
      r.addEventListener("touchstart", take, { passive: true });
      r.addEventListener("pointerdown", take, { passive: true });
      r.addEventListener("wheel", take, { passive: true });
    });
    let ticking = false;
    const drift = () => {
      ticking = false;
      const vh = innerHeight;
      rows.forEach((r, i) => {
        if (r._user) return;
        const b = r.getBoundingClientRect();
        if (b.bottom < 0 || b.top > vh) return;
        const p = Math.min(1, Math.max(0, (vh - b.top) / (vh + b.height)));   // 0 entra dal basso … 1 esce in alto
        const card = r.querySelector(".mcard"), span = Math.min(r.scrollWidth - r.clientWidth, (card ? card.offsetWidth : 280) * 1.4);
        r.scrollLeft = i % 2 ? span * (1 - p) : span * p;
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(drift); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    req();
  }

  function buildFeed(CATS) {
    const feed = document.createElement("div");
    feed.className = "mfeed";
    const tot = CATS.reduce((s, c) => s + c.items.length, 0);
    feed.innerHTML = '<nav class="mchips" aria-label="Categorie"><button type="button" class="on" data-cat="">Tutti <i>' + tot + "</i></button>" +
      CATS.map((c) => '<button type="button" data-cat="' + c.id + '">' + c.name.split(/[,&]/)[0].trim() + " <i>" + pad2(c.items.length) + "</i></button>").join("") + "</nav>";
    const play = gifStage();
    CATS.forEach((cat, ci) => {
      const sec = document.createElement("section");
      sec.className = "mfeed__sec"; sec.dataset.cat = cat.id;
      sec.innerHTML = '<h2 class="mfeed__h"><span>§ ' + pad2(ci + 1) + " — " + cat.name + "</span><span>" + pad2(cat.items.length) + "</span></h2>";
      cat.items.forEach((it, ii) => {
        const code = (CODES[cat.id] || "XX") + "·" + pad2(ii + 1);
        const tags = (it.tags && it.tags.length ? it.tags : [it.kind === "site" ? "Website" : "Video"]).slice(0, 3).join(" / ");
        const card = document.createElement("article");
        card.className = "mfc";
        card.innerHTML = '<button type="button" class="mfc__top" aria-expanded="false">' +
          '<div class="mfc__ph' + (it.kind === "proj" ? "" : " is-wide") + '"><img loading="lazy" alt="' + it.name + '" src="' + coverM(it) + '"></div>' +
          '<div class="mfc__meta"><span class="mfc__code">' + code + '</span><b>' + it.name + '</b><i aria-hidden="true">+</i></div>' +
          '<div class="mfc__tags">' + tags + "</div></button>" +
          '<div class="mfc__more" hidden></div>';
        const top = card.querySelector(".mfc__top"), more = card.querySelector(".mfc__more");
        top.addEventListener("click", () => {
          const open = more.hidden;
          // uno aperto alla volta
          feed.querySelectorAll(".mfc.is-open").forEach((o) => { if (o !== card) closeCard(o); });
          if (!open) { closeCard(card); return; }
          play(null);
          card.classList.add("is-open"); top.setAttribute("aria-expanded", "true"); more.hidden = false;
          let media = "";
          if (it.kind === "proj") {
            media = '<div class="mfc__gal">' + it.frames.map((f) => '<div><img loading="lazy" alt="" src="' + toM(f) + '"></div>').join("") + "</div>" +
              (it.frames.length > 1 ? '<div class="mfc__dots">' + it.frames.map((_, k) => "<i" + (k ? "" : ' class="on"') + "></i>").join("") + "</div>" : "");
          } else {
            media = '<div class="mfc__vid"><iframe src="' + YT_EMBED(it.vid) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="' + it.name + '"></iframe></div>';
          }
          // foto/video sopra al nome (al posto della copertina), descrizione sotto
          const box = document.createElement("div");
          box.className = "mfc__media"; box.innerHTML = media;
          card.insertBefore(box, top);
          more.innerHTML =
            (it.description ? '<p class="mfc__desc">' + it.description + "</p>" : "") +
            (it.url ? '<a class="mfc__link" href="' + it.url + '" target="_blank" rel="noopener">Visita il sito ↗</a>' : "");
          top.querySelector(".mfc__ph").hidden = true;
          const gal = box.querySelector(".mfc__gal");
          if (gal) gal.addEventListener("scroll", () => {
            const k = Math.round(gal.scrollLeft / gal.clientWidth);
            box.querySelectorAll(".mfc__dots i").forEach((d, j) => d.classList.toggle("on", j === k));
          }, { passive: true });
          setTimeout(() => card.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }), 30);
        });
        card._it = it;
        sec.appendChild(card);
      });
      feed.appendChild(sec);
    });
    function closeCard(c) {
      c.classList.remove("is-open");
      const m = c.querySelector(".mfc__more"); m.hidden = true; m.innerHTML = "";
      const b = c.querySelector(".mfc__media"); if (b) b.remove();                 // via iframe/galleria
      c.querySelector(".mfc__top").setAttribute("aria-expanded", "false");
      c.querySelector(".mfc__ph").hidden = false;
    }
    INDEX.appendChild(feed);
    const fitFeed = () => feed.querySelectorAll(".mfc__meta b").forEach((n) => {
      n.style.fontSize = "";
      let fs = parseFloat(getComputedStyle(n).fontSize);
      while (n.scrollWidth > n.clientWidth + 1 && fs > 14) { fs -= 1; n.style.fontSize = fs + "px"; }
    });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fitFeed);

    // gif in play sulla scheda al centro dello schermo
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        const card = e.target.closest(".mfc");
        if (e.isIntersecting && !card.classList.contains("is-open")) play(e.target, card._it);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    feed.querySelectorAll(".mfc__ph").forEach((p) => io.observe(p));

    // filtro categorie (+ ?cat= dalla home: mostra tutto e scorre a quella sezione)
    const chips = feed.querySelector(".mchips");
    const setCat = (id) => {
      chips.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.cat === id));
      feed.querySelectorAll(".mfeed__sec").forEach((s) => { s.hidden = !!id && s.dataset.cat !== id; });
    };
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      setCat(b.dataset.cat);
      b.scrollIntoView({ inline: "center", block: "nearest" });
      scrollTo({ top: feed.getBoundingClientRect().top + scrollY - 4 });
    });
    const start = new URLSearchParams(location.search).get("cat");
    const sec = start && feed.querySelector('.mfeed__sec[data-cat="' + start + '"]');
    if (sec) requestAnimationFrame(() => scrollTo({ top: sec.getBoundingClientRect().top + scrollY - chips.offsetHeight - 6 }));
  }

  /* --- singola card progetto/video --- */
  function makeCard(it, cat) {
    const card = document.createElement("div");
    card.className = "pcard" + (it.kind === "proj" ? " is-proj" : "");
    card._kind = it.kind; card._frames = it.kind === "proj" ? it.frames : null; card._vid = it.vid;

    const media =
      it.kind === "proj"
        ? '<div class="pcard__media"><img class="slide-img" loading="lazy" alt="' + it.name + '" data-src="' + (it.frames[0] || "") + '"></div>' +
          '<div class="pcard__play"><i></i> gif</div>'
        : '<div class="pcard__media"><img class="v-thumb" loading="lazy" alt="' + it.name + '" data-src="' + YT_THUMB(it.vid) + '"></div>' +
          '<div class="pcard__play"><i></i> video</div>';

    const visit = it.url ? '<a class="visit" href="' + it.url + '" target="_blank" rel="noopener">VISIT &#8599;</a>' : "<span>&larr; chiudi info</span>";

    card.innerHTML =
      '<div class="pcard__inner">' +
        '<div class="pcard__face pcard__front">' + media +
          '<div class="pcard__label"><span>' + it.name + "</span><em>info +</em></div>" +
        "</div>" +
        '<div class="pcard__face pcard__back">' +
          "<h4>" + it.name + "</h4>" +
          '<p class="m">' + (it.type || cat.name) + "</p>" +
          "<p>" + (it.description || "Work in progress") + "</p>" +
          (it.tags && it.tags.length ? '<ul class="tags">' + it.tags.map((t) => "<li>" + t + "</li>").join("") + "</ul>" : "") +
          '<div class="row"><span>Surreo Studio</span>' + visit + "</div>" +
        "</div>" +
      "</div>";

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;      // il link VISIT non gira la card
      e.stopPropagation();
      card.classList.toggle("is-flipped");
    });
    return card;
  }

  /* --- attiva/disattiva media della card centrata --- */
  function setActive(card, on) {
    if (card._active === on) return;
    card._active = on;
    card.classList.toggle("is-active", on);
    if (card._kind === "proj") { on ? startGif(card) : stopGif(card); }
    else { on ? playVideo(card) : stopVideo(card); }
  }
  // ciclo frame "a gif": avanza ogni GIF_MS, ma solo quando il frame successivo è già
  // caricato (niente scatti/attese su rete lenta). Ritorna la funzione di stop.
  const GIF_MS = 700;
  const cache = {};
  const preload = (src) => cache[src] || (cache[src] = new Promise((res) => {
    const im = new Image(); im.onload = im.onerror = () => res(); im.src = src;
  }));
  function cycleFrames(img, f) {
    let i = 0, alive = true, t = 0;
    f.forEach(preload);
    const tick = () => {
      const n = (i + 1) % f.length, due = performance.now() + GIF_MS;
      preload(f[n]).then(() => {
        if (!alive) return;
        t = setTimeout(() => { if (!alive) return; i = n; img.src = f[i]; tick(); }, Math.max(0, due - performance.now()));
      });
    };
    tick();
    return () => { alive = false; clearTimeout(t); };
  }
  function startGif(card) {
    const f = card._frames;
    if (!f || f.length < 2) return;
    card._stop = cycleFrames(card.querySelector(".slide-img"), f);
  }
  function stopGif(card) {
    if (card._stop) { card._stop(); card._stop = null; }
    const img = card.querySelector(".slide-img");
    if (img && card._frames) img.src = card._frames[0];
  }
  // hover-gif per le miniature nella strip chiusa
  function attachHoverGif(el) {
    const img = el.querySelector("img");
    if (!img) return;
    let stop = null;
    el.addEventListener("mouseenter", () => {
      const f = el._frames;
      if (!f || f.length < 2 || stop) return;
      stop = cycleFrames(img, f);
    });
    el.addEventListener("mouseleave", () => {
      if (stop) { stop(); stop = null; }
      if (el._frames && el._frames[0]) img.src = el._frames[0];
    });
  }
  function playVideo(card) {
    if (card.querySelector("iframe")) return;
    const f = document.createElement("iframe");
    f.src = YT_EMBED(card._vid);
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.setAttribute("allowfullscreen", "");
    card.querySelector(".pcard__media").appendChild(f);
  }
  function stopVideo(card) { const f = card.querySelector("iframe"); if (f) f.remove(); }

  /* --- apertura/chiusura categoria (animazione FLIP) --- */
  function targetRect() {
    const m = window.innerWidth < 640 ? 12 : 28;
    const w = Math.min(1180, window.innerWidth - m * 2), h = window.innerHeight - m * 2;
    return { top: m, left: (window.innerWidth - w) / 2, width: w, height: h };
  }
  function setRect(el, r) { el.style.top = r.top + "px"; el.style.left = r.left + "px"; el.style.width = r.width + "px"; el.style.height = r.height + "px"; }
  function centerCard(car, idx, behavior) {
    const c = car.querySelectorAll(".pcard")[idx];
    if (!c) return;
    const left = c.offsetLeft - (car.clientWidth - c.offsetWidth) / 2;
    if (behavior === "auto" && Math.abs(car.scrollLeft - left) < 4) return;
    // scroll-behavior:smooth nel CSS renderebbe animato anche "auto": lo spengo per il salto
    if (behavior === "auto") { car.style.scrollBehavior = "auto"; car.scrollLeft = left; car.style.scrollBehavior = ""; }
    else car.scrollTo({ left: left, behavior: behavior });
  }

  function open(el, idx) {
    if (openEl) return;
    openEl = el; idx = idx || 0;
    const r = (el._from || el).getBoundingClientRect();
    ph = document.createElement("div"); ph.style.height = r.height + "px"; el.after(ph);
    el.classList.add("is-fixed"); setRect(el, { top: r.top, left: r.left, width: r.width, height: r.height });
    el.getBoundingClientRect();
    document.body.classList.add("has-open"); backdrop.classList.add("is-on"); el.classList.add("is-open");
    el.querySelector(".cat__open").setAttribute("aria-hidden", "false");
    // le immagini grandi delle card si caricano solo alla prima apertura
    // (il pannello chiuso resta nel layout, quindi loading="lazy" da solo non basta)
    el.querySelectorAll(".cat__open img[data-src]").forEach((im) => { im.src = im.dataset.src; im.removeAttribute("data-src"); });
    requestAnimationFrame(() => setRect(el, targetRect()));
    el.querySelector(".close").focus({ preventScroll: true });
    // parti una card prima di quella cliccata, poi slitta solo l'ultimo tratto -> gif/video parte.
    // (uno smooth scroll lungo migliaia di px veniva interrotto durante l'apertura e
    // centrava il progetto sbagliato, quindi le ultime card non si attivavano mai)
    centerCard(el._car, Math.max(0, idx - 1), "auto");
    setTimeout(() => { if (openEl === el) { centerCard(el._car, idx, reduce ? "auto" : "smooth"); el._animate(); } }, 240);
    [440, 640, 900].forEach((t) => setTimeout(() => { if (openEl === el) el._animate(); }, t));
    // verifica finale: se non è centrata (scroll interrotto), correggi senza animazione
    setTimeout(() => { if (openEl === el) { centerCard(el._car, idx, "auto"); el._animate(); } }, 1300);
  }

  function close() {
    if (!openEl) return;
    const el = openEl;
    el.querySelectorAll(".pcard").forEach((c) => setActive(c, false));   // stop media
    const r = (el._from || ph).getBoundingClientRect();
    backdrop.classList.remove("is-on"); el.classList.remove("is-open");
    el.querySelector(".cat__open").setAttribute("aria-hidden", "true");
    el.querySelectorAll(".pcard.is-flipped").forEach((c) => c.classList.remove("is-flipped"));
    setRect(el, { top: r.top, left: r.left, width: r.width, height: r.height });
    const done = () => {
      el.classList.remove("is-fixed"); el.style.cssText = "";
      if (ph) { ph.remove(); ph = null; }
      document.body.classList.remove("has-open");
      el.removeEventListener("transitionend", done);
      openEl = null;
    };
    el.addEventListener("transitionend", done);
    setTimeout(() => { if (openEl === el) done(); }, 650);
  }

  backdrop.addEventListener("click", close);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  window.addEventListener("resize", () => { if (openEl) { setRect(openEl, targetRect()); openEl._animate(); } });

  /* --- hero reactive: parallax magnetico sul titolo + spotlight morbido --- */
  (function heroReactive(){
    if (reduce) return;
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const svg = hero.querySelector(".hero__title-svg");
    let raf = 0, pending = null;
    const apply = () => {
      raf = 0;
      if (!pending) return;
      const { x, y, w, h } = pending;
      hero.style.setProperty("--mx", (x / w * 100) + "%");
      hero.style.setProperty("--my", (y / h * 100) + "%");
      if (svg) {
        const dx = (x / w - 0.5);   // -0.5 .. 0.5
        const dy = (y / h - 0.5);
        svg.style.setProperty("--tx", (dx * 18).toFixed(1) + "px");
        svg.style.setProperty("--ty", (dy * 14).toFixed(1) + "px");
        svg.style.setProperty("--rz", (dx * 1.4).toFixed(2) + "deg");
      }
    };
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;   // no touch
      const r = hero.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
      hero.classList.add("is-lit");
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      hero.classList.remove("is-lit");
      if (svg) {
        svg.style.setProperty("--tx", "0px");
        svg.style.setProperty("--ty", "0px");
        svg.style.setProperty("--rz", "0deg");
      }
    }, { passive: true });
  })();
})();
