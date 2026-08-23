(() => {
  "use strict";

  const app = document.getElementById("app");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // backdrop condiviso
  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  document.body.appendChild(backdrop);

  let openEl = null, ph = null;

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

  /* --- dati --- */
  Promise.all([
    fetch("projects.json", { cache: "no-store" }).then((r) => r.json()),
    fetch("videos.json", { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
  ])
    .then(([data, vids]) => build(data.sections || [], vids || {}))
    .catch((e) => { app.innerHTML = '<p style="color:#b00;padding:20px">Impossibile caricare i progetti (' + e + ")</p>"; });

  const YT_THUMB = (id) => "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  const YT_EMBED = (id) => "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&mute=1&rel=0&playsinline=1&loop=1&playlist=" + id;
  const pretty = (s) => (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* --- costruzione categorie --- */
  function build(sections, vids) {
    const CATS = [];
    sections.forEach((s) => {
      const items = (s.projects || []).map((p) => ({ kind: "proj", name: p.name, frames: p.frames || [] }));
      if (s.id === "exhibit" && vids.exhibitCards && vids.exhibitCards.items) {
        vids.exhibitCards.items.forEach((it) => items.push({ kind: "video", name: it.title, vid: it.id }));
      }
      CATS.push({ name: s.title, items });
    });
    if (vids.visual && vids.visual.items) {
      const items = [];
      vids.visual.items.forEach((it) => (it.videos || []).forEach((v) => items.push({ kind: "video", name: it.id ? pretty(it.id) : "Videoclip", vid: v })));
      CATS.push({ name: "Videoclip & Motion", items });
    }
    if (vids.website && vids.website.items) {
      CATS.push({ name: "Website", items: vids.website.items.map((it) => ({ kind: "site", name: it.title, vid: it.id, url: it.url })) });
    }
    CATS.forEach(renderCategory);
  }

  const thumbURL = (it) => (it.kind === "proj" ? (it.frames[0] || "") : YT_THUMB(it.vid));

  function renderCategory(cat) {
    const el = document.createElement("section");
    el.className = "cat";
    if (/videoclip|website/i.test(cat.name)) el.classList.add("cat--wide");

    // --- chiuso ---
    const closed = document.createElement("div");
    closed.className = "cat__closed";
    closed.innerHTML =
      '<div class="cat__top"><span class="cat__name">' + cat.name + "</span>" +
      '<span class="cat__count">' + String(cat.items.length).padStart(2, "0") + " progetti &raquo;</span></div>" +
      '<div class="cat__line"></div>';
    const strip = document.createElement("div");
    strip.className = "strip";
    cat.items.forEach((it, i) => {
      const b = document.createElement("button");
      b.className = "thumb"; b.type = "button"; b.setAttribute("aria-label", "Apri " + it.name);
      b.innerHTML = '<img loading="lazy" alt="" src="' + thumbURL(it) + '">';
      b.addEventListener("click", (e) => { e.stopPropagation(); open(el, i); });
      strip.appendChild(b);
    });
    closed.appendChild(strip);
    el.appendChild(closed);

    // --- aperto ---
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
      const cx = car.getBoundingClientRect().left + car.clientWidth / 2;
      let best = 1e9, idx = 0, list = car.querySelectorAll(".pcard");
      list.forEach((c, i) => { const r = c.getBoundingClientRect(); const dc = (r.left + r.width / 2) - cx; if (Math.abs(dc) < best) { best = Math.abs(dc); idx = i; } });
      list.forEach((c, i) => setActive(c, i === idx));
      pos.textContent = String(idx + 1).padStart(2, "0") + " / " + String(tot).padStart(2, "0");
    };
    let raf = null;
    car.addEventListener("scroll", () => { if (raf) return; raf = requestAnimationFrame(() => { animate(); raf = null; }); }, { passive: true });
    el._animate = animate; el._car = car;

    app.appendChild(el);
  }

  /* --- singola card progetto/video --- */
  function makeCard(it, cat) {
    const card = document.createElement("div");
    card.className = "pcard";
    card._kind = it.kind; card._frames = it.kind === "proj" ? it.frames : null; card._vid = it.vid;

    const media =
      it.kind === "proj"
        ? '<div class="pcard__media"><img class="slide-img" loading="lazy" alt="' + it.name + '" src="' + (it.frames[0] || "") + '"></div>' +
          '<div class="pcard__play"><i></i> gif</div>'
        : '<div class="pcard__media"><img class="v-thumb" loading="lazy" alt="' + it.name + '" src="' + YT_THUMB(it.vid) + '"></div>' +
          '<div class="pcard__play"><i></i> video</div>';

    const visit = it.url ? '<a class="visit" href="' + it.url + '" target="_blank" rel="noopener">VISIT &#8599;</a>' : "<span>&larr; chiudi info</span>";

    card.innerHTML =
      '<div class="pcard__inner">' +
        '<div class="pcard__face pcard__front">' + media +
          '<div class="pcard__label"><span>' + it.name + "</span><em>info +</em></div>" +
        "</div>" +
        '<div class="pcard__face pcard__back">' +
          "<h4>" + it.name + "</h4><p class=\"m\">" + cat.name + "</p><p>Descrizione in arrivo.</p>" +
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
  function startGif(card) {
    const f = card._frames;
    if (!f || f.length < 2 || reduce) return;
    const img = card.querySelector(".slide-img");
    f.forEach((src) => { const im = new Image(); im.src = src; });   // preload
    let i = 0;
    card._timer = setInterval(() => { i = (i + 1) % f.length; img.src = f[i]; }, 200);
  }
  function stopGif(card) {
    if (card._timer) { clearInterval(card._timer); card._timer = null; }
    const img = card.querySelector(".slide-img");
    if (img && card._frames) img.src = card._frames[0];
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
    car.scrollTo({ left: c.offsetLeft - (car.clientWidth - c.offsetWidth) / 2, behavior: behavior });
  }

  function open(el, idx) {
    if (openEl) return;
    openEl = el; idx = idx || 0;
    const r = el.getBoundingClientRect();
    ph = document.createElement("div"); ph.style.height = r.height + "px"; el.after(ph);
    el.classList.add("is-fixed"); setRect(el, { top: r.top, left: r.left, width: r.width, height: r.height });
    el.getBoundingClientRect();
    document.body.classList.add("has-open"); backdrop.classList.add("is-on"); el.classList.add("is-open");
    el.querySelector(".cat__open").setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => setRect(el, targetRect()));
    el.querySelector(".close").focus({ preventScroll: true });
    // parti da sinistra, poi slitta fino al progetto cliccato -> gif/video parte
    el._car.scrollLeft = 0;
    setTimeout(() => { if (openEl === el) { centerCard(el._car, idx, reduce ? "auto" : "smooth"); el._animate(); } }, 240);
    [440, 640].forEach((t) => setTimeout(() => { if (openEl === el) el._animate(); }, t));
  }

  function close() {
    if (!openEl) return;
    const el = openEl;
    el.querySelectorAll(".pcard").forEach((c) => setActive(c, false));   // stop media
    const r = ph.getBoundingClientRect();
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

  /* -------------------- hero grid (drift + mouse displacement) -------------------- */
  (function heroGrid(){
    const hero = document.querySelector(".hero");
    if (!hero || reduce) return;

    const canvas = document.createElement("canvas");
    canvas.className = "hero__grid";
    canvas.setAttribute("aria-hidden", "true");
    hero.prepend(canvas);
    const ctx = canvas.getContext("2d");

    const ink = (getComputedStyle(document.documentElement).getPropertyValue("--ink") || "#16140f").trim();
    const spacing = 44;
    const radius = 190;
    const strength = 30;

    let W = 0, H = 0, DPR = 1, cols = 0, rows = 0, base = null, pts = null;
    const mouse = { x: -9999, y: -9999, active: false };
    let t0 = performance.now(), rafId = 0;

    function resize(){
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = hero.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cols = Math.ceil(W / spacing) + 3;
      rows = Math.ceil(H / spacing) + 3;
      const ox = -spacing + ((W - (cols - 3) * spacing) / 2);
      const oy = -spacing + ((H - (rows - 3) * spacing) / 2);
      base = new Float32Array(cols * rows * 2);
      pts  = new Float32Array(cols * rows * 2);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++){
          const k = (j * cols + i) * 2;
          base[k]   = ox + i * spacing;
          base[k+1] = oy + j * spacing;
        }
    }

    function onMove(e){
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    }
    function onLeave(){ mouse.active = false; mouse.x = mouse.y = -9999; }

    function frame(now){
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 1;

      const mx = mouse.x, my = mouse.y, r2 = radius * radius;
      for (let k = 0; k < base.length; k += 2){
        const bx = base[k], by = base[k+1];
        let x = bx + Math.sin(by * 0.011 + t * 0.35) * 2.6;
        let y = by + Math.cos(bx * 0.011 + t * 0.28) * 2.6;
        if (mouse.active){
          const dx = x - mx, dy = y - my, d2 = dx*dx + dy*dy;
          if (d2 < r2){
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / radius;
            const push = f * f * strength;
            x += (dx / d) * push;
            y += (dy / d) * push;
          }
        }
        pts[k] = x; pts[k+1] = y;
      }

      ctx.beginPath();
      for (let j = 0; j < rows; j++){
        for (let i = 0; i < cols - 1; i++){
          const a = (j * cols + i) * 2, b = a + 2;
          ctx.moveTo(pts[a], pts[a+1]);
          ctx.lineTo(pts[b], pts[b+1]);
        }
      }
      for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows - 1; j++){
          const a = (j * cols + i) * 2, b = ((j + 1) * cols + i) * 2;
          ctx.moveTo(pts[a], pts[a+1]);
          ctx.lineTo(pts[b], pts[b+1]);
        }
      }
      ctx.stroke();
      rafId = requestAnimationFrame(frame);
    }

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", () => { resize(); }, { passive: true });

    const io = new IntersectionObserver((ents) => {
      for (const e of ents){
        if (e.isIntersecting){
          if (!rafId){ t0 = performance.now(); rafId = requestAnimationFrame(frame); }
        } else if (rafId){ cancelAnimationFrame(rafId); rafId = 0; }
      }
    }, { threshold: 0 });
    io.observe(hero);

    resize();
  })();
})();
