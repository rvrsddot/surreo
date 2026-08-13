/* =========================================================================
   WORKSHOK — interazioni (terminal / OS-brutalist)
   Rispetta prefers-reduced-motion / touch.
   ========================================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var ed = window.EDITION || {};
  var courses = window.COURSES || [];
  var enrollUrl = window.ENROLL_URL || "#iscrizioni";

  function $(id) { return document.getElementById(id); }
  function set(id, txt) { var el = $(id); if (el) el.textContent = txt; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function pad3(n) { return String(Math.round(n)).padStart(3, "0"); }

  /* ---------- HERO ---------- */
  set("hero-year", ed.year || "2026");
  set("hero-edition", (ed.edition || "N.—") + (ed.year ? " · " + ed.year : ""));
  set("hero-when", ed.dates || "—");
  set("hero-where", ed.city ? ed.city + ", IT" : "—");
  set("hero-format", ed.days || "3–5 giorni");

  /* Wordmark: tilt 3D che segue il mouse — solo transform (leggero).
     Off su touch/reduced-motion → mobile resta la scritta base, ferma. */
  (function () {
    var wm = document.querySelector(".hero__wordmark");
    var hero = document.querySelector(".hero");
    if (!wm || !hero || reduce || coarse) return;
    var MAX = 9, trx = 0, tryv = 0, crx = 0, cry = 0, raf = null;
    function onMove(e) {
      var r = wm.getBoundingClientRect();
      var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      nx = Math.max(-1.3, Math.min(1.3, nx));
      ny = Math.max(-1.3, Math.min(1.3, ny));
      tryv = nx * MAX;    // rotateY segue l'asse X del mouse
      trx = -ny * MAX;    // rotateX segue l'asse Y
      kick();
    }
    function frame() {
      crx += (trx - crx) * 0.09; cry += (tryv - cry) * 0.09;
      wm.style.transform = "perspective(900px) rotateX(" + crx.toFixed(2) + "deg) rotateY(" + cry.toFixed(2) + "deg)";
      if (Math.abs(trx - crx) > 0.03 || Math.abs(tryv - cry) > 0.03) { raf = requestAnimationFrame(frame); }
      else { raf = null; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", function () { trx = 0; tryv = 0; kick(); });
  })();


  /* ---------- CORSI · card → popup dettaglio ---------- */
  var cards = $("cards");
  var select = $("form-corso");

  courses.forEach(function (c, idx) {
    var soon = c.status === "coming-soon";
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card" + (soon ? " card--soon" : "") + (c.cardBlur ? " card--blur" : "");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-controls", "course-modal");
    card.setAttribute("aria-label",
      (soon ? "Slot in arrivo" : "Corso " + c.number + " — " + c.title) + " · apri i dettagli");
    card.dataset.course = String(idx);

    /* Palette per card (accento colorato) */
    var pal = c.palette || null;
    if (pal) {
      if (pal.bg) card.style.setProperty("--card-bg", pal.bg);
      if (pal.ink) card.style.setProperty("--card-ink", pal.ink);
      if (pal.accent) card.style.setProperty("--card-accent", pal.accent);
      card.classList.add("card--tinted");
    }

    var mediaItems = (c.media && Array.isArray(c.media.items)) ? c.media.items : [];
    var mediaThumbs = mediaItems.slice(0, 4).map(function (m) {
      return m.poster || m.src || "";
    }).filter(Boolean);
    var mediaHtml = "";
    if (c.cardLoop && c.cardLoop.src && !soon) {
      mediaHtml = '<div class="card__media card__media--video" aria-hidden="true">' +
        '<video src="' + esc(c.cardLoop.src) + '"' +
          (c.cardLoop.poster ? ' poster="' + esc(c.cardLoop.poster) + '"' : '') +
          ' muted loop playsinline autoplay preload="metadata"></video>' +
      '</div>';
    } else if (mediaThumbs.length && !soon) {
      mediaHtml = '<div class="card__media' + (c.cardBlur ? ' card__media--blur' : '') + '" aria-hidden="true">' +
        mediaThumbs.map(function (src) {
          return '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async" />';
        }).join("") +
      '</div>';
    }

    card.innerHTML =
      '<div class="card__topline"><span>WSK/' + esc(c.number) + '</span><span>' + (soon ? "SOON" : "OPEN") + '</span></div>' +
      '<div class="card__n">' + esc(c.number) + '</div>' +
      mediaHtml +
      '<h3 class="card__title">' + esc(c.title) + '</h3>' +
      '<p class="card__theme">' + esc(c.theme || "") + '</p>' +
      '<div class="card__meta">' +
        (c.tutor ? '<span>' + esc(c.tutor) + '</span>' : '') +
        (c.dates ? '<span>' + esc(c.dates) + '</span>' : '') +
      '</div>' +
      '<div class="card__frontcta">' +
        '<span class="card__hint">apri scheda</span>' +
        '<span class="card__enroll" aria-hidden="true">Dettagli →</span>' +
      '</div>';

    cards.appendChild(card);

    if (!soon) {
      card.addEventListener("click", function () { openCourse(idx); });
      if (select) {
        var opt = document.createElement("option");
        opt.value = c.title; opt.textContent = c.number + " — " + c.title;
        select.appendChild(opt);
      }
    } else {
      card.disabled = true;
    }
  });

  /* ---------- POPUP CORSO ---------- */
  var cmodal = $("course-modal");
  var cbody = $("cmodal-body");
  var cslug = $("cmodal-slug");
  var cenroll = $("cmodal-enroll");
  var cclose = $("course-close");
  var cLastFocus = null;

  function paraHtml(v) {
    if (!v) return "";
    var arr = Array.isArray(v) ? v : [v];
    return arr.map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("");
  }

  function mediaHtml(c) {
    var m = c.media;
    if (!m || !m.items || !m.items.length) return "";
    var isVideo = m.kind === "video";
    function slide(it, i, dup) {
      if (isVideo) {
        // Lazy: usa data-src, il video parte solo quando è visibile nel .cmedia.
        // Il poster viene mostrato subito come immagine → nessun caricamento pesante iniziale.
        return '<div class="cmedia__slide" data-idx="' + i + '"' + (dup ? ' aria-hidden="true"' : '') + '>' +
          '<video class="cmedia__video" data-src="' + esc(it.src) + '"' +
          ' muted playsinline preload="none" loop' +
          (it.poster ? ' poster="' + esc(it.poster) + '"' : '') +
          ' aria-label="Anteprima video del workshop"></video></div>';
      }
      return '<div class="cmedia__slide" data-idx="' + i + '"' + (dup ? ' aria-hidden="true"' : '') + '>' +
        '<img class="cmedia__img" src="' + esc(it.src) + '" alt="' + (dup ? '' : esc(it.alt || "")) + '" loading="lazy" decoding="async" />' +
        '</div>';
    }
    var one = m.items.map(function (it, i) { return slide(it, i, false); }).join("");
    var two = m.items.map(function (it, i) { return slide(it, i, true); }).join("");
    var kindLabel = isVideo ? "// Video del corso" : "// Immagini del corso";
    return (
      '<section class="cmodal__section cmodal__section--media">' +
        '<h3 class="cmodal__sec-title">' + kindLabel + '</h3>' +
        '<div class="cmedia" data-kind="' + (isVideo ? "video" : "image") + '">' +
          '<div class="cmedia__track">' + one + two + '</div>' +
        '</div>' +
      '</section>'
    );
  }

  /* Mini parser: **bold** dentro le stringhe di prose */
  function inline(txt) {
    return esc(txt)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(https?:\/\/[^\s<>()]+)/g, function (m) {
        var url = m.replace(/[.,;:!?)\]"']+$/, "");
        var trail = m.slice(url.length);
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a>" + trail;
      });
  }

  function renderCourse(c) {
    var spec = [
      ["Docente", c.tutor],
      ["Tool", c.tool],
      ["Date", c.dates],
      ["Durata", c.days || c.hours],
      ["Posti", c.seats],
      ["Dove", c.location],
      ["CFU", c.cfu],
      ["Aperto a", c.audience],
    ].filter(function (r) { return r[1]; })
     .map(function (r) {
       return '<li><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></li>';
     }).join("");

    return (
      '<article class="cmodal__head">' +
        '<span class="cmodal__eyebrow">WSK/' + esc(c.number) + ' · ' + esc(c.dates || "") + '</span>' +
        '<h2 id="cmodal-title" class="cmodal__title">' + esc(c.title) + '</h2>' +
        '<p class="cmodal__theme">' + esc(c.theme || "") + '</p>' +
        (c.tutor ? '<p class="cmodal__by">con <b>' + esc(c.tutor) + '</b>' +
          (c.tutorRole ? ' — <em>' + esc(c.tutorRole) + '</em>' : '') + '</p>' : '') +
      '</article>' +

      mediaHtml(c) +

      '<section class="cmodal__section cmodal__section--spec">' +
        '<h3 class="cmodal__sec-title">// Info workshop</h3>' +
        '<ul class="cmodal__spec">' + spec + '</ul>' +
        (c.recommended ? '<p class="cmodal__reco"><b>Consigliato a:</b> ' + esc(c.recommended) + '</p>' : '') +
      '</section>' +

      '<section class="cmodal__section">' +
        '<h3 class="cmodal__sec-title">// Obiettivo workshop</h3>' +
        '<div class="cmodal__prose">' + paraHtml(c.description) + '</div>' +
      '</section>' +

      (c.result ? (
        '<section class="cmodal__section">' +
          '<h3 class="cmodal__sec-title">// W# Result</h3>' +
          '<div class="cmodal__prose">' + paraHtml(c.result) + '</div>' +
        '</section>'
      ) : '') +

      (c.tutorBio ? (
        '<section class="cmodal__section cmodal__section--tutor">' +
          '<h3 class="cmodal__sec-title">// Il docente</h3>' +
          '<div class="cmodal__prose">' +
            '<p class="cmodal__tutorname">' + esc(c.tutor) +
              (c.tutorRole ? '<span> — ' + esc(c.tutorRole) + '</span>' : '') + '</p>' +
            paraHtml(c.tutorBio) +
          '</div>' +
        '</section>'
      ) : '') +

      (c.cfu ? '<p class="cmodal__cfu">' + esc(c.cfu) + '</p>' : '') +
      (c.note ? '<p class="cmodal__note">' + esc(c.note) + '</p>' : '')
    );
  }

  function activateMediaAutoplay(root) {
    // Lazy load: swap data-src → src + play SOLO quando il video è visibile
    // dentro il .cmedia (viewport della finestra scroll). Fuori, pausa.
    var wrap = root.querySelector(".cmedia");
    if (!wrap) return;
    var vids = wrap.querySelectorAll(".cmedia__video");
    if (!vids.length) return;
    if (!("IntersectionObserver" in window)) {
      // Fallback: attiva tutto (browser vecchi)
      vids.forEach(function (v) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else {
          try { v.pause(); } catch (e) {}
        }
      });
    }, { root: wrap, threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
    // salva reference per disconnect in closeCourse
    wrap._mediaIO = io;
  }

  function openCourse(idx) {
    var c = courses[idx];
    if (!cmodal || !c) return;
    cLastFocus = document.activeElement;
    /* palette sul modal */
    var pal = c.palette || {};
    if (pal.bg) cmodal.style.setProperty("--cm-bg", pal.bg); else cmodal.style.removeProperty("--cm-bg");
    if (pal.ink) cmodal.style.setProperty("--cm-ink", pal.ink); else cmodal.style.removeProperty("--cm-ink");
    if (pal.accent) cmodal.style.setProperty("--cm-accent", pal.accent); else cmodal.style.removeProperty("--cm-accent");
    cmodal.classList.toggle("cmodal--tinted", !!(pal.bg || pal.ink));
    if (cslug) cslug.textContent = c.number || "—";
    if (cenroll) {
      cenroll.href = enrollUrl;
      cenroll.setAttribute("data-enroll", c.title);
      // apre in nuova scheda solo se link esterno
      if (/^https?:/i.test(enrollUrl)) {
        cenroll.target = "_blank";
        cenroll.rel = "noopener noreferrer";
      } else {
        cenroll.target = "_self";
        cenroll.rel = "";
      }
    }
    if (cbody) cbody.innerHTML = renderCourse(c);
    cmodal.hidden = false;
    document.documentElement.style.overflow = "hidden";
    if (cclose) cclose.focus();
    // scroll interno al top
    var panel = cmodal.querySelector(".cmodal__body");
    if (panel) panel.scrollTop = 0;
    activateMediaAutoplay(cmodal);
  }

  function closeCourse() {
    if (!cmodal) return;
    var wrap = cmodal.querySelector(".cmedia");
    if (wrap && wrap._mediaIO) { try { wrap._mediaIO.disconnect(); } catch (e) {} wrap._mediaIO = null; }
    cmodal.querySelectorAll(".cmedia__video").forEach(function (v) { try { v.pause(); } catch (e) {} });
    cmodal.hidden = true;
    document.documentElement.style.overflow = "";
    if (cLastFocus && cLastFocus.focus) cLastFocus.focus();
  }

  if (cmodal) {
    if (cclose) cclose.addEventListener("click", closeCourse);
    cmodal.addEventListener("click", function (e) { if (e.target === cmodal) closeCourse(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !cmodal.hidden) closeCourse();
    });
    if (cenroll) {
      cenroll.addEventListener("click", function () {
        var v = cenroll.getAttribute("data-enroll");
        if (v && select) select.value = v;
        // se è un'ancora interna, chiudi il popup così vede lo scroll
        if (!/^https?:/i.test(cenroll.getAttribute("href") || "")) closeCourse();
      });
    }
  }

  /* ---------- COLLAB · marquee + popup ---------- */
  var partners = window.PARTNERS || [];
  var mq = $("marquee");
  if (mq) {
    var chunk = partners.map(function (p) {
      return '<span class="marquee__item">' + esc(p) + '</span>';
    }).join("");
    mq.innerHTML = chunk + chunk; // duplicato per loop -50%
  }

  var pmodal = $("partners-modal");
  var plist = $("pmodal-list");
  var pcount = $("pmodal-count");
  if (pmodal && plist) {
    plist.innerHTML = partners.map(function (p) {
      return "<li>" + esc(p) + "</li>";
    }).join("");
    if (pcount) pcount.textContent = partners.length;

    var lastFocus = null;
    function openModal() {
      lastFocus = document.activeElement;
      pmodal.hidden = false;
      document.documentElement.style.overflow = "hidden";
      var closeBtn = $("partners-close");
      if (closeBtn) closeBtn.focus();
    }
    function closeModal() {
      pmodal.hidden = true;
      document.documentElement.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    var openTriggers = [$("marquee-btn"), $("partners-open")];
    openTriggers.forEach(function (btn) {
      if (btn) btn.addEventListener("click", openModal);
    });
    var closeBtn = $("partners-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    pmodal.addEventListener("click", function (e) {
      if (e.target === pmodal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pmodal.hidden) closeModal();
    });
  }

  /* ---------- SELECTED (credenziale) ---------- */
  var sel = window.SELECTED;
  var selEl = $("selected");
  if (sel && selEl) {
    selEl.innerHTML =
      '<b>' + esc(sel.label) + '</b>' +
      '<span>' + esc(sel.org) + '</span>' +
      '<em>' + esc(sel.title) + '</em>' +
      '<span>' + esc(sel.dates) + '</span>';
  }

  /* ---------- Cursore + coordinate live ---------- */
  var cur = document.querySelector(".cursor");
  if (!reduce && !coarse && cur) {
    window.addEventListener("mousemove", function (e) {
      cur.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
      set("sb-x", pad3(e.clientX)); set("sb-y", pad3(e.clientY));
    });
    document.querySelectorAll("a, button, input, select, textarea, .card, .dial, .win__bar").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cur.classList.add("is-hot"); });
      el.addEventListener("mouseleave", function () { cur.classList.remove("is-hot"); });
    });
  }

  /* ---------- Dati di sistema (version · credit · coordinate) ---------- */
  var site = window.SITE || {};
  set("sys-ver", site.version || "v1.0");
  set("foot-credit", site.credit || "—");
  set("sb-coords", site.coords || "—");

  /* ---------- Orologio (Europe/Rome) ---------- */
  function tick() {
    try {
      set("sb-clock", new Date().toLocaleTimeString("it-IT", { hour12: false, timeZone: "Europe/Rome" }));
    } catch (err) {
      var d = new Date();
      set("sb-clock", pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()));
    }
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Status bar · typewriter ---------- */
  var sbMsg = $("sb-msg");
  if (sbMsg) {
    var lines = [
      "SAAD WORKSHOP WEEK // " + (ed.year || ""),
      "3 CORSI · " + (ed.days || "3–5 GG") + " · " + (ed.city || "ASCOLI").toUpperCase(),
      "DESIGN + ARCHITETTURA @ VELOCITÀ DEL LAMPO",
      "ISCRIZIONI APERTE — POSTI LIMITATI",
      "EST. 2018 — ASCOLI PICENO, IT",
    ];
    if (reduce) { sbMsg.textContent = lines[0]; }
    else {
      var li = 0;
      typeLine(lines[0], function loop() {
        setTimeout(function () { li = (li + 1) % lines.length; typeLine(lines[li], loop); }, 2600);
      });
    }
    function typeLine(txt, done) {
      var i = 0; sbMsg.textContent = "";
      (function step() {
        sbMsg.textContent = txt.slice(0, i);
        if (i++ <= txt.length) setTimeout(step, 26);
        else if (done) done();
      })();
    }
  }

  /* ---------- LAMPO su scroll (singolo flash, throttlato) ---------- */
  var flashEl = document.querySelector(".flash");
  if (!reduce && flashEl) {
    var lastFlash = 0, lastY = window.scrollY, accum = 0;
    var MIN_GAP = 5000;     // max un lampo ogni 5s
    var DIST = 1400;        // servono ~1400px scrollati
    flashEl.addEventListener("animationend", function () { flashEl.classList.remove("is-on"); });
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      accum += Math.abs(y - lastY); lastY = y;
      var now = Date.now();
      if (accum > DIST && now - lastFlash > MIN_GAP && Math.random() < 0.5) {
        accum = 0; lastFlash = now;
        flashEl.classList.remove("is-on");
        void flashEl.offsetWidth;      // reflow per ri-triggerare
        flashEl.classList.add("is-on");
      }
    }, { passive: true });
  }

  /* ---------- Scramble reveal (scroll-in + hover) ---------- */
  var CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/\\<>*#%@0123456789";
  function scramble(el, dur) {
    if (reduce) return;
    var real = el.dataset._t || (el.dataset._t = el.textContent);
    var start = performance.now(); dur = dur || 520;
    (function frame(now) {
      var p = Math.min(1, (now - start) / dur);
      var reveal = Math.floor(p * real.length); var out = "";
      for (var i = 0; i < real.length; i++) {
        if (real[i] === " ") { out += " "; continue; }
        out += i < reveal ? real[i] : CH[(Math.random() * CH.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = real;
    })(start);
  }
  var scr = document.querySelectorAll("[data-scramble]");
  if (!reduce && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { scramble(en.target); so.unobserve(en.target); } });
    }, { threshold: 0.6 });
    scr.forEach(function (el) { so.observe(el); el.addEventListener("mouseenter", function () { scramble(el, 340); }); });
  }

  /* ---------- Nav attiva su scroll ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  var tabMap = {};
  tabs.forEach(function (t) { tabMap[t.getAttribute("href").slice(1)] = t; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var t = tabMap[en.target.id];
        if (t && en.isIntersecting) { tabs.forEach(function (x) { x.classList.remove("is-active"); }); t.classList.add("is-active"); }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["corsi", "about", "collab"].forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }

  /* ---------- Finestre collassabili (click sulla barra → si ritira su) ---------- */
  (function () {
    var wins = Array.prototype.slice.call(document.querySelectorAll(".win"));
    wins.forEach(function (win) {
      var bar = win.querySelector(".win__bar");
      var status = win.querySelector(".win__status");
      if (!bar) return;
      var orig = status ? status.textContent : "";
      bar.setAttribute("role", "button");
      bar.setAttribute("tabindex", "0");
      bar.setAttribute("aria-expanded", "true");
      bar.setAttribute("aria-label", "Chiudi / apri la sezione");
      function toggle() {
        var collapsed = win.classList.toggle("is-collapsed");
        bar.setAttribute("aria-expanded", String(!collapsed));
        if (status) status.textContent = collapsed ? "[ + OPEN ]" : orig;
      }
      bar.addEventListener("click", toggle);
      bar.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });
  })();
})();
