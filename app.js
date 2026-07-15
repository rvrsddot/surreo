(() => {
  "use strict";

  const sectionsEl = document.getElementById("sections");
  const tpl = document.getElementById("card-tpl");
  /* touch detection via CAPACITÀ del dispositivo, non larghezza viewport:
     dentro un iframe Readymag stretto su desktop, l'utente ha comunque il mouse -> hover */
  const isTouch = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let VIDEOS = {};

  /* --- se siamo dentro un iframe, comunica la nostra altezza al parent ---
     Il parent (es. widget HTML su Readymag) resta in ascolto e ridimensiona
     l'iframe automaticamente. Emette al load e ad ogni cambio di layout. */
  if (window.parent !== window) {
    let lastH = 0;
    const sendHeight = () => {
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      );
      if (h !== lastH) {
        lastH = h;
        try { window.parent.postMessage({ type: "surreo:height", height: h }, "*"); } catch (e) {}
      }
    };
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight, { passive: true });
    // segnala altezza anche mentre le immagini si caricano progressivamente
    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.documentElement);
  }

  Promise.all([
    fetch("projects.json", { cache: "no-store" }).then((r) => r.json()),
    fetch("videos.json", { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
  ])
    .then(([data, vids]) => { VIDEOS = vids || {}; init(data.sections || []); })
    .catch((e) => {
      sectionsEl.innerHTML = '<p style="color:#b00">Impossibile caricare i progetti (' + e + ")</p>";
    });

  /* --- mappa slug-progetto -> [{id,title}] per il PULSANTE-video (solo 'beside') --- */
  function buildVideoMap(vids) {
    const map = {};
    Object.entries((vids.beside || {})).forEach(([slug, ids]) => {
      if (Array.isArray(ids)) map[slug] = ids.map((id) => ({ id: id, title: "" }));
    });
    return map;
  }

  /* --- facciata video inline (thumbnail + play rosso), al click carica l'iframe --- */
  function makeFacade(id, title, url) {
    const v = document.createElement("div");
    v.className = "vc-video";
    v.innerHTML =
      '<img class="vc-thumb" loading="lazy" alt="" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" />' +
      (title ? '<span class="vc-title">' + title + "</span>" : "") +
      (url ? '<a class="vc-visit" href="' + url + '" target="_blank" rel="noopener">VISIT ↗</a>' : "") +
      '<button class="vc-play" type="button" aria-label="Play"><svg viewBox="0 0 68 48">' +
      '<path class="vc-play-bg" d="M66.5 7.7c-.8-2.9-2.5-5.2-5.4-6C55.8.5 34 .5 34 .5S12.2.5 6.9 1.6C4 2.4 2.3 4.8 1.5 7.7.4 13 .4 24 .4 24s0 11 1.1 16.3c.8 2.9 2.5 5.2 5.4 6C12.2 47.5 34 47.5 34 47.5s21.8 0 27.1-1.1c2.9-.8 4.6-3.1 5.4-6C67.6 35 67.6 24 67.6 24s0-11-1.1-16.3z"/>' +
      '<path d="M27 34l18-10L27 14v20z" fill="#fff"/></svg></button>';
    v.querySelector(".vc-play").addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      f.className = "vc-iframe";
      v.innerHTML = "";
      v.appendChild(f);
    });
    return v;
  }

  /* --- pulsante-video (stesso stile della freccia: cerchio bianco, bordo nero) --- */
  function makeVideoBtn(videos, name) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "video-btn";
    b.setAttribute("aria-label", "Guarda i video del progetto");
    b.innerHTML =
      '<svg viewBox="0 0 143.61 143.61" aria-hidden="true">' +
      '<rect class="vb-bg" x="1.42" y="1.42" width="140.78" height="140.78" rx="70.39" ry="70.39" fill="#fff" stroke="#000" stroke-width="2.83"/>' +
      '<path class="vb-play" d="M58 46 L58 98 L102 72 Z" fill="#000"/></svg>';
    b.addEventListener("click", (e) => { e.stopPropagation(); openModal(videos, name); });
    return b;
  }

  /* --- card-video singola: thumbnail YouTube + pulsante-video, senza flip --- */
  function makeVideoCard(id, title) {
    const art = document.createElement("article");
    art.className = "card card--video";
    art.innerHTML =
      '<div class="card__inner"><div class="card__face card__front">' +
      '<div class="stage">' +
      '<img class="stage__img is-active" alt="" loading="lazy" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" />' +
      '<div class="card__tools"></div>' +
      "</div>" +
      '<div class="titlebox"><span class="card__name">' + title + "</span></div>" +
      "</div></div>";
    art.querySelector(".card__tools").appendChild(makeVideoBtn([{ id: id, title: title }], title));
    art.classList.add("is-in"); // niente animazione d'ingresso: appare subito
    return art;
  }

  /* --- overlay video condiviso --- */
  let modal;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "vmodal";
    modal.innerHTML =
      '<button class="vmodal__close" type="button" aria-label="Chiudi">✕</button>' +
      '<div class="vmodal__box">' +
      '  <div class="vmodal__stage"></div>' +
      '  <div class="vmodal__bar"><span class="vmodal__title"></span><div class="vmodal__tabs"></div></div>' +
      "</div>";
    document.body.appendChild(modal);
    const close = () => {
      modal.classList.remove("is-open");
      modal.querySelector(".vmodal__stage").innerHTML = "";
      document.body.style.overflow = "";
    };
    modal.querySelector(".vmodal__close").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    return modal;
  }
  function playInModal(id) {
    const f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true;
    const stage = modal.querySelector(".vmodal__stage");
    stage.innerHTML = "";
    stage.appendChild(f);
  }
  function openModal(videos, name) {
    ensureModal();
    modal.querySelector(".vmodal__title").textContent = name || "";
    const tabs = modal.querySelector(".vmodal__tabs");
    tabs.innerHTML = "";
    if (videos.length > 1) {
      videos.forEach((v, i) => {
        const t = document.createElement("button");
        t.className = "vmodal__tab" + (i === 0 ? " is-active" : "");
        t.textContent = v.title || "Video " + (i + 1);
        t.addEventListener("click", () => {
          tabs.querySelectorAll(".vmodal__tab").forEach((x) => x.classList.remove("is-active"));
          t.classList.add("is-active");
          playInModal(v.id);
        });
        tabs.appendChild(t);
      });
    }
    playInModal(videos[0].id);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  let VIDEO_MAP = {};

  function makeHead(title) {
    const head = document.createElement("div");
    head.className = "section__head";
    head.innerHTML =
      '<h2 class="section__title">' + title + "</h2>" +
      '<span class="section__dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    return head;
  }

  /* --- sezione VIDEOCLIP: per progetto -> intestazione (nome+linea) + riga immagine + video --- */
  function appendVideoclip(items, title, projById) {
    const sec = document.createElement("section");
    sec.className = "section section--vclip";
    sec.appendChild(makeHead(title));
    const list = document.createElement("div");
    list.className = "vclip-list";
    items.forEach((it) => {
      const slug = it.id || it.slug;
      const p = projById[slug];
      const name = (p && p.name) || it.title || slug;

      const item = document.createElement("div");
      const single = (it.videos || []).length <= 1;
      item.className = "vclip-item " + (single ? "vclip-item--single" : "vclip-item--double");
      const head = document.createElement("div");
      head.className = "vclip-head";
      head.innerHTML = "<span>" + name + "</span>";
      const row = document.createElement("div");
      row.className = "vclip-row";
      const media = document.createElement("div");
      media.className = "vclip-media";
      media.innerHTML =
        '<div class="vclip-sq">' +
        (p && p.frames && p.frames[0]
          ? '<img loading="lazy" alt="" src="' + p.frames[0] + '" />'
          : '<span class="vclip-noimg"></span>') +
        "</div>";
      row.appendChild(media);
      (it.videos || []).forEach((id) => row.appendChild(makeFacade(id, "", "")));
      item.appendChild(head);
      item.appendChild(row);
      list.appendChild(item);
    });
    sec.appendChild(list);
    sectionsEl.appendChild(sec);
  }

  /* --- sezione SITI/WEBSITE: solo video, 3 colonne --- */
  function appendWebsite(items, title) {
    const sec = document.createElement("section");
    sec.className = "section section--sites";
    sec.appendChild(makeHead(title));
    const grid = document.createElement("div");
    grid.className = "grid grid--3";
    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "site-card";
      card.appendChild(makeFacade(it.id, it.title, it.url));
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    sectionsEl.appendChild(sec);
  }

  /* --- calcola le due altezze: righe a 2 video (piena) e a 1 video (mezza) --- */
  function fitVclip() {
    const list = document.querySelector(".vclip-list");
    if (!list) return;
    const row = list.querySelector(".vclip-row");
    if (!row) return;
    const innerGap = parseFloat(getComputedStyle(row).columnGap) || 9;
    const colGap = parseFloat(getComputedStyle(list).columnGap) || 20;
    const W = list.clientWidth;
    // double: q + 2*(16/9)q + 2*innerGap = W  ->  q = (W - 2*innerGap) / 4.5556
    const hD = (W - 2 * innerGap) / 4.5556;
    // single (2 per riga): larghezza cella = (W - colGap) / 2; q + (16/9)q + innerGap = cella
    const halfCol = (W - colGap) / 2;
    const hS = (halfCol - innerGap) / 2.7778;
    document.documentElement.style.setProperty("--vclip-h", Math.floor(hD) + "px");
    document.documentElement.style.setProperty("--vclip-h1", Math.floor(hS) + "px");
  }

  /* --- linea nome: con grid la larghezza e' gia' quella della cella, niente da fare --- */
  function alignVclipHeads() { /* noop: gestito da CSS grid */ }

  /* --- ordine desiderato per le prime file di ogni sezione --- */
  const PRIORITY = {
    graphic: [
      "caffe-meletti", "donna-mayla", "mybestlazio", "castelmania", "shine-soap",
      "appicciafuoco", "palandrani-technical", "gizzi-fisioterapista", "handmade",
    ],
  };
  function reorderProjects(sec) {
    const pri = PRIORITY[sec.id];
    if (!pri || !sec.projects) return;
    const byId = Object.fromEntries(sec.projects.map((p) => [p.id, p]));
    const head = pri.map((id) => byId[id]).filter(Boolean);
    const usedIds = new Set(head.map((p) => p.id));
    const tail = sec.projects.filter((p) => !usedIds.has(p.id));
    sec.projects = head.concat(tail);
  }

  function init(sections) {
    VIDEO_MAP = buildVideoMap(VIDEOS);
    sections.forEach(reorderProjects);
    const projById = {};
    const cards = [];
    let total = 0;

    sections.forEach((sec, si) => {
      if (!sec.projects || !sec.projects.length) return;
      total += sec.projects.length;

      const secEl = document.createElement("section");
      secEl.className = "section";
      const head = makeHead(sec.title);
      const grid = document.createElement("div");
      grid.className = "grid";

      sec.projects.forEach((p) => {
        projById[p.id] = p;
        const c = build(p);
        cards.push(c);
        grid.appendChild(c.el);
      });

      // card-video singole nella sezione Exhibit
      if (sec.id === "exhibit" && VIDEOS.exhibitCards && VIDEOS.exhibitCards.items) {
        VIDEOS.exhibitCards.items.forEach((it) => {
          grid.appendChild(makeVideoCard(it.id, it.title));
        });
      }

      secEl.appendChild(head);
      secEl.appendChild(grid);
      sectionsEl.appendChild(secEl);
    });

    // sezioni video dedicate (dopo le sezioni immagini)
    if (VIDEOS.visual && VIDEOS.visual.items) appendVideoclip(VIDEOS.visual.items, "Videoclip & Motion", projById);
    if (VIDEOS.website && VIDEOS.website.items) appendWebsite(VIDEOS.website.items, "Website");
    const layoutVclip = () => {
      fitVclip();
      // secondo frame: il reflow di --vclip-h e' completato, ora misuro le righe
      requestAnimationFrame(alignVclipHeads);
    };
    layoutVclip();
    requestAnimationFrame(layoutVclip);
    window.addEventListener("load", layoutVclip);
    window.addEventListener("resize", layoutVclip, { passive: true });

    // entrata + lazy activation
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const c = en.target.__card;
          if (!c) return;
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            c.load();
            c.active = true;
          } else {
            c.active = false;
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    cards.forEach((c) => io.observe(c.el));

    if (isTouch && !reduce) startScrub(cards);
    else if (!reduce) startAutoplay(cards);
  }

  function build(p) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const stage = node.querySelector(".stage");
    const tools = node.querySelector(".card__front .card__tools");
    const nameEls = node.querySelectorAll(".card__name, .back__name");
    const tot = node.querySelector(".tot");
    const cur = node.querySelector(".cur");
    const backN = node.querySelector(".back__n");

    nameEls.forEach((n) => (n.textContent = p.name));
    tot.textContent = p.frames.length;
    backN.textContent = "01 — " + String(p.frames.length).padStart(2, "0");

    const state = {
      el: node,
      frames: p.frames,
      layers: [],        // un <img> per frame, impilati e precaricati
      idx: 0,
      active: false,
      loaded: false,
    };

    // tutti i frame come layer sovrapposti: il crossfade tocca solo l'opacita'
    // (nessun cambio di src -> nessun flash bianco)
    p.frames.forEach((src, i) => {
      const im = document.createElement("img");
      im.className = "stage__img";
      im.alt = "";
      im.decoding = "async";
      im.dataset.src = src;
      if (i === 0) im.classList.add("is-active");
      stage.insertBefore(im, tools);
      state.layers[i] = im;
    });

    function paint(i) {
      i = ((i % p.frames.length) + p.frames.length) % p.frames.length;
      if (i === state.idx && state.layers[i].classList.contains("is-active")) return;
      state.layers[state.idx].classList.remove("is-active");
      state.layers[i].classList.add("is-active");
      cur.textContent = i + 1;
      backN.textContent =
        String(i + 1).padStart(2, "0") + " — " + String(p.frames.length).padStart(2, "0");
      state.idx = i;
    }

    state.load = function () {
      if (state.loaded) return;
      state.loaded = true;
      state.layers.forEach((im) => { im.src = im.dataset.src; });
    };
    state.paint = paint;

    // flip
    node.querySelectorAll(".flip-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        node.classList.toggle("is-flipped");
        const flipped = node.classList.contains("is-flipped");
        node.querySelector(".flip-btn").setAttribute(
          "aria-label",
          flipped ? "Torna al progetto" : "Mostra info progetto"
        );
      })
    );

    // pulsante-video sotto la freccia (la card resta quadrata)
    const vids = VIDEO_MAP[p.id];
    if (vids && vids.length) {
      node.classList.add("has-video");
      node.querySelector(".card__tools").appendChild(makeVideoBtn(vids, p.name));
    }

    node.__card = state;
    return state;
  }

  /* ---------- DESKTOP: loop SOLO al passaggio mouse (niente movimento a riposo) ---------- */
  function startAutoplay(cards) {
    const STEP = 220; // scorrimento veloce al passaggio del mouse
    cards.forEach((c) => {
      let timer = null;
      const start = () => {
        if (timer || c.el.classList.contains("is-flipped")) return;
        if (c.loaded) c.paint(c.idx + 1);
        timer = setInterval(() => {
          if (!c.el.classList.contains("is-flipped")) c.paint(c.idx + 1);
        }, STEP);
      };
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
      c.el.addEventListener("mouseenter", start);
      c.el.addEventListener("mouseleave", stop);
    });
  }

  /* ---------- MOBILE: scrub allo scroll, sincrono col gesto utente ----------
     Nessun autoplay/fallback: se non c'è scroll, le card restano ferme.
     Dentro un iframe (Readymag) il parent ci comunica scrollY + iframeTop + vh
     via postMessage, così calcoliamo la posizione REALE della card nel viewport
     del parent (non dell'iframe, che essendo scrolling="no" è alto tutto il contenuto). */
  function startScrub(cards) {
    cards.forEach((c) => c.el.classList.add("is-scrub"));
    let ticking = false;
    let parentOffset = 0;  // scrollY parent - iframeTop, usato per riportare r.top nel viewport parent
    let parentVh = 0;      // viewport height del parent (0 = fallback a window.innerHeight)

    function update() {
      ticking = false;
      const vh = parentVh || window.innerHeight;
      if (vh <= 0) return;
      cards.forEach((c) => {
        if (!c.loaded) return;
        const r = c.el.getBoundingClientRect();
        const top = r.top - parentOffset; // top della card nel viewport parent
        // fuori viewport (con buffer): niente aggiornamento
        if (top + r.height < -50 || top > vh + 50) return;
        // prog = 0 quando la card entra dal basso, 1 quando esce dall'alto
        const prog = (vh - top) / (vh + r.height);
        const clamped = Math.min(1, Math.max(0, prog));
        const i = Math.round(clamped * (c.frames.length - 1));
        if (i !== c.idx) c.paint(i);
      });
    }
    const req = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };

    // scroll standalone (aprendo il sito direttamente su mobile)
    window.addEventListener("scroll", req, { passive: true });

    // scroll parent (embed Readymag): riceviamo scrollY, iframeTop assoluto, vh
    window.addEventListener("message", (e) => {
      if (!e.data || e.data.type !== "surreo:parent-scroll") return;
      if (typeof e.data.y === "number") {
        parentOffset = e.data.y - (e.data.iframeTop || 0);
      }
      if (typeof e.data.vh === "number" && e.data.vh > 0) parentVh = e.data.vh;
      req();
    });

    window.addEventListener("resize", req, { passive: true });
    setTimeout(update, 300);
  }
})();
