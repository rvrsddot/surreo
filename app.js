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
    // "Virtual & VR Experience" ha pochi items → in fondo
    const vIdx = CATS.findIndex((c) => /virtual/i.test(c.name));
    if (vIdx >= 0) CATS.push(CATS.splice(vIdx, 1)[0]);
    CATS.forEach(renderCategory);
    buildCatPicker(CATS);
  }

  /* --- selettore categorie (griglia grayscale sopra la sezione progetti) --- */
  function buildCatPicker(CATS) {
    const projects = document.querySelector(".projects");
    if (!projects) return;
    const picker = document.createElement("section");
    picker.className = "cat-picker";
    picker.setAttribute("aria-label", "Scegli categoria");
    const inner = document.createElement("div");
    inner.className = "cat-picker__inner";
    inner.innerHTML =
      '<div class="cat-picker__head"><h2>Categorie</h2>' +
      '<p class="cat-picker__hint">Clicca un quadrato per aprire la categoria</p></div>';
    const grid = document.createElement("div");
    grid.className = "cat-picker__grid";
    grid.style.setProperty("--n", CATS.length);
    CATS.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.className = "cat-picker__sq";
      btn.type = "button";
      btn.dataset.cat = i;
      btn.style.setProperty("--i", i);
      btn.setAttribute("aria-label", "Apri " + c.name);
      const label = document.createElement("span");
      label.className = "cat-picker__label";
      label.textContent = c.name;
      btn.appendChild(label);
      btn.addEventListener("click", () => openCategoryFromPicker(i));
      grid.appendChild(btn);
    });
    inner.appendChild(grid);
    picker.appendChild(inner);
    projects.parentNode.insertBefore(picker, projects);
  }

  function openCategoryFromPicker(idx) {
    const cat = document.querySelectorAll("#app > .cat")[idx];
    if (cat) open(cat, 0);
  }

  // miniatura 256px generata da make_thumbs.py: assets/projects/<id>/NN.jpg -> .../<id>/t/NN.jpg
  const toThumb = (src) => src.replace(/\/([^/]+)$/, "/t/$1");
  const thumbURL = (it) => (it.kind === "proj" ? (it.frames[0] ? toThumb(it.frames[0]) : "") : YT_THUMB(it.vid));

  // colori accent per categoria (in ordine)
  const CAT_ACCENTS = ["#ff2bd6", "#2be5ff", "#b5ff2b", "#ff8a2b", "#b02bff", "#ff2b7e"];

  function renderCategory(cat, index) {
    const el = document.createElement("section");
    el.className = "cat";
    el.style.setProperty("--accent", CAT_ACCENTS[index % CAT_ACCENTS.length]);
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
      e.stopPropagation(); open(el, 0);
    });
    closed.querySelector(".cat__name").addEventListener("click", (e) => {
      e.stopPropagation(); open(el, 0);
    });
    const strip = document.createElement("div");
    strip.className = "strip";
    cat.items.forEach((it, i) => {
      const b = document.createElement("button");
      b.className = "thumb"; b.type = "button"; b.setAttribute("aria-label", "Apri " + it.name);
      b.innerHTML = '<img loading="lazy" alt="' + it.name + '" src="' + thumbURL(it) + '">';
      b.addEventListener("click", (e) => { e.stopPropagation(); open(el, i); });
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
    if (!reduce && cat.items.length > 1) {
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
            clone.addEventListener("click", (e) => { e.stopPropagation(); open(el, i); });
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
    // iOS Safari: scrollend può non arrivare durante scroll-snap; ripasso periodico finché aperto
    car.addEventListener("touchend", () => { setTimeout(animate, 120); setTimeout(animate, 360); }, { passive: true });
    el._animate = animate; el._car = car;

    app.appendChild(el);
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
    const r = el.getBoundingClientRect();
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
