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
  // Corsi non ancora pubblici: le card mantengono la grafica ma sono coperte
  // da un overlay sfocato "COMING SOON". Mettere a false quando escono i corsi veri.
  var LOCK_ALL = true;

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
  set("hero-format", (courses.length || 3) + " corsi · " + (ed.days || "3–5 giorni"));

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


  /* ---------- CORSI · card flip ---------- */
  var cards = $("cards");
  var select = $("form-corso");

  courses.forEach(function (c) {
    var soon = c.status === "coming-soon";
    var card = document.createElement("div");
    card.className = "card" + (soon ? " card--soon" : "");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", (soon ? "Slot in arrivo" : "Corso " + c.title) + " — apri per i dettagli");

    var frontCta = soon
      ? '<div class="card__frontcta"><span class="card__hint">gira</span></div>'
      : '<div class="card__frontcta"><span class="card__hint">gira per info</span>' +
        '<a class="card__enroll" href="#iscrizioni" data-enroll="' + esc(c.title) + '">Iscriviti →</a></div>';

    var front =
      '<div class="card__face card__face--front">' +
        '<div class="card__topline"><span>WSK/' + esc(c.number) + '</span><span>' + (soon ? "SOON" : "OPEN") + '</span></div>' +
        '<div class="card__n">' + esc(c.number) + '</div>' +
        '<h3 class="card__title">' + esc(c.title) + '</h3>' +
        '<p class="card__theme">' + esc(c.theme) + '</p>' +
        frontCta +
      '</div>';

    var back;
    if (soon) {
      back =
        '<div class="card__face card__face--back">' +
          '<div class="card__topline"><span>WSK/' + esc(c.number) + '</span><span>SOON</span></div>' +
          '<h3 class="card__title">In arrivo</h3>' +
          '<p class="card__soonmsg">' + esc(c.blurb || "Il terzo corso si sblocca a breve.") + '</p>' +
          '<a class="card__enroll" href="#iscrizioni">Avvisami →</a>' +
        '</div>';
    } else {
      back =
        '<div class="card__face card__face--back">' +
          '<div class="card__topline"><span>WSK/' + esc(c.number) + '</span><span>' + esc(c.days || "") + '</span></div>' +
          '<h3 class="card__title">' + esc(c.title) + '</h3>' +
          '<p class="card__desc">' + esc(c.blurb || "") + '</p>' +
          '<ul class="card__list">' +
            '<li>Tema<span>' + esc(c.theme) + '</span></li>' +
            (c.tutor ? '<li>Tutor<span>' + esc(c.tutor) + '</span></li>' : '') +
            '<li>Durata<span>' + esc(c.days || "—") + '</span></li>' +
          '</ul>' +
          '<a class="card__enroll" href="#iscrizioni" data-enroll="' + esc(c.title) + '">Iscriviti →</a>' +
        '</div>';
    }

    card.innerHTML = '<div class="card__inner">' + front + back + '</div>';
    cards.appendChild(card);

    // Corso non ancora pubblico: overlay sfocato "COMING SOON", niente flip.
    if (LOCK_ALL) {
      var lock = document.createElement("div");
      lock.className = "card__lock";
      lock.innerHTML = '<span>Coming&nbsp;Soon<small>// IN ARRIVO</small></span>';
      card.appendChild(lock);
      card.setAttribute("aria-label", "Corso in arrivo — Coming Soon");
      card.setAttribute("aria-disabled", "true");
      card.removeAttribute("aria-pressed");
      card.tabIndex = -1;
      return; // salta flip + preselezione form
    }

    function toggle() {
      var flip = !card.classList.contains("is-flipped");
      card.classList.toggle("is-flipped", flip);
      card.setAttribute("aria-pressed", String(flip));
    }
    // click: gira, tranne se clicco un link (Iscriviti)
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      toggle();
    });
    // tastiera
    card.addEventListener("keydown", function (e) {
      if (e.target.closest("a")) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });

    if (!soon && select) {
      var opt = document.createElement("option");
      opt.value = c.title; opt.textContent = c.number + " — " + c.title;
      select.appendChild(opt);
    }
  });

  // Corsi non ancora pubblici: il form diventa lista d'attesa (un'unica voce).
  if (LOCK_ALL && select) {
    var wl = document.createElement("option");
    wl.value = "Lista d'attesa"; wl.textContent = "Lista d'attesa — tutti i corsi";
    select.appendChild(wl);
  }

  // link "Iscriviti" -> preseleziona il corso nel form
  document.querySelectorAll("[data-enroll]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-enroll");
      if (v && select) select.value = v;
    });
  });

  /* ---------- COLLAB · marquee ---------- */
  var mq = $("marquee");
  if (mq) {
    var chunk = (window.PARTNERS || []).map(function (p) {
      return '<span class="marquee__item">' + esc(p) + '</span>';
    }).join("");
    mq.innerHTML = chunk + chunk; // duplicato per loop -50%
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
