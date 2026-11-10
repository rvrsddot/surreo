/* SURREO B/N — header, menu, footer, glitch, decodifica, scanner (mockup condiviso) */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOB = () => matchMedia('(max-width:700px)').matches;
  const page = document.body.dataset.page || '';
  const H = '/';

  /* ---------- header + menu + barra mobile ---------- */
  const nav = [
    ['/progetti.html', 'Projects', 'Showcase · Video · Motion · Website', 'progetti'],
    ['/fotovideo.html', 'Photo &amp; Film', 'Photography · Moving image', 'fotovideo'],
    ['/lapidary.html', 'Lapidary', 'Scrittura · Font trovati per strada', 'lapidary', 1],
    [H + '#about', 'About', 'Studio · Manifesto · Come lavoriamo', 'about'],
    ['/workshok/', 'Workshok', 'Design · Architettura · Since 2018', 'workshok', 1],
    ['mailto:surreocreative@gmail.com', 'Mail · WhatsApp', 'surreocreative@gmail.com', 'mail'],
  ];
  const strip = s => s.replace(/&amp;/g, '&');
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="hd">
    <a class="hd__logo" href="${H}">SURREO</a>
    <nav class="hd__nav mono">${nav.slice(0, 5).map(n => `<a href="${n[0]}"${n[3] === page ? ' aria-current="page"' : ''}>${n[1]}</a>`).join('')}</nav>
    <div class="hd__r mono"><button class="hd__menu mono" id="menuOpen">Menu</button></div>
  </header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <nav class="bb mono" id="bb" aria-label="Contatti rapidi">
    <a href="mailto:surreocreative@gmail.com"><span>Parliamone</span><span>→</span></a>
    <a href="tel:+393313510091"><span>Chiama</span><span>↗</span></a>
    <a href="https://wa.me/393313510091"><span>WhatsApp</span><span>↗</span></a>
  </nav>
`);

  /* fascia contatti + footer (se la pagina ha <footer data-bn>) */
  const ft = document.querySelector('footer[data-bn]');
  if (ft) {
    ft.className = 'dark';
    ft.innerHTML = `${ft.dataset.bn === 'cta' ? `
    <div class="g cta">
      <h2 class="cta__q disp dec">Hai un’idea,<br>anche solo <span class="it">a metà?</span></h2>
      <div class="cta__b mono">
        <a class="btn" href="mailto:surreocreative@gmail.com"><span>Mail me</span><span>↗</span></a>
        <a class="btn" href="tel:+393313510091"><span>Chiama</span><span>↗</span></a>
        <a class="btn" href="https://wa.me/393313510091"><span>WhatsApp</span><span>↗</span></a>
        <a class="btn" href="https://www.instagram.com/surreo_studio/" target="_blank" rel="noopener"><span>@surreo_studio</span><span>↗</span></a>
      </div>
    </div><div class="rule"></div>` : ''}
    <div class="g ft mono">
      <span>Surreo Studio</span><a href="/cv.html">CV</a><a href="/privacy.html">Privacy</a>
      <a href="https://www.instagram.com/surreo_studio/" target="_blank" rel="noopener">Instagram</a>
      <span>Unbased #Design Studio · IT / DE · © 2026</span>
    </div>`;
  }

  /* ---------- titoli a riga singola che riempiono la larghezza ([data-fit]=corpo massimo px) ---------- */
  const fit = () => document.querySelectorAll('[data-fit]').forEach(el => {
    el.style.whiteSpace = 'nowrap'; el.style.fontSize = '100px';
    const r = document.createRange(); r.selectNodeContents(el);
    const cs = getComputedStyle(el), avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), need = r.getBoundingClientRect().width;
    if (avail && need) el.style.fontSize = Math.min(+el.dataset.fit || 300, 100 * avail / need * .985) + 'px';
  });
  window.bnFit = fit; fit(); addEventListener('resize', fit);
  document.fonts && document.fonts.ready.then(fit);

  /* ---------- glitch ---------- */
  const kick = el => { if (!el) return; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); };
  window.bnKick = kick;
  document.addEventListener('mouseover', e => {
    const g = e.target.closest('.gl, [data-gk]');
    if (g && !g.contains(e.relatedTarget)) kick(g.matches('[data-gk]') ? (g.querySelector('.gl') || g) : g);
  });

  /* ---------- decodifica titoli (.dec) ---------- */
  const GL = '#/\\_-+*<>=01█▓▒░';
  const decode = el => {
    const nodes = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) nodes.push([w.currentNode, w.currentNode.textContent]);
    const total = nodes.reduce((a, [, s]) => a + s.length, 0) || 1; const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / 900); let k = 0;
      nodes.forEach(([n, s]) => {
        n.textContent = [...s].map(c => { const i = k++ / total; return c === ' ' || i < p ? c : (i < p + .18 ? GL[Math.random() * GL.length | 0] : ' '); }).join('');
      });
      if (p < 1) requestAnimationFrame(step); else nodes.forEach(([n, s]) => n.textContent = s);
    };
    requestAnimationFrame(step);
  };
  window.bnDecode = decode;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); if (!RM) decode(e.target); } }), { threshold: .3 });
  window.bnObserve = el => io.observe(el);
  document.querySelectorAll('.dec').forEach(el => io.observe(el));

  /* ---------- scanner mobile: la riga al centro schermo fa da hover ---------- */
  const els = []; let cur = null, raf = 0;
  const upd = () => {
    raf = 0;
    if (!MOB()) { if (cur) cur.classList.remove('on'); cur = null; return; }
    const mid = innerHeight / 2; let best = null;
    for (const el of els) {
      if (!el.offsetParent) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { best = el; break; }
    }
    if (best === cur) return;
    if (cur) cur.classList.remove('on');
    cur = best;
    if (cur) { cur.classList.add('on'); kick(cur.querySelector('.gl') || cur); }
  };
  window.bnScan = el => els.push(el);

  /* ---------- barra mobile ---------- */
  const bb = document.getElementById('bb');
  const bbUpd = () => {
    const end = ft ? ft.getBoundingClientRect().top < innerHeight * .9 : false;
    bb.classList.toggle('on', scrollY > innerHeight * .6 && !end);
  };
  addEventListener('scroll', () => { bbUpd(); raf || (raf = requestAnimationFrame(upd)); }, { passive: true });

  /* ---------- menu "Indice" (file separato, condiviso con la home) ---------- */
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/bn/menu.css">');
  const ms = document.createElement('script'); ms.src = '/bn/menu.js'; document.body.appendChild(ms);
})();
