/* SURREO B/N — menu "Indice": costruisce il pannello e lo collega al pulsante #menuOpen */
(() => {
  const page = document.body.dataset.page || '';
  const onHome = page === 'home';
  const EN = document.documentElement.lang === 'en';
  const T = (it, en) => EN ? en : it;
  const H = '/';
  const ITEMS = [
    ['progetti', 'Projects', 'Showcase · Video · Motion · Website', '/progetti.html'],
    ['fotovideo', 'Photo & Film', 'Photography · Moving image', '/fotovideo.html'],
    ['lapidary', 'Lapidary', T('Scrittura · Font trovati per strada', 'Lettering · Fonts found on the street'), '/lapidary.html', 1],
    ['about', 'About', T('Studio · Manifesto · Come lavoriamo', 'Studio · Manifesto · How we work'), onHome ? '#about' : H + '#about'],
    ['workshok', 'Workshok', T('Design · Architettura · Since 2018', 'Design · Architecture · Since 2018'), '/workshok/', 1],
  ];
  const esc = s => s.replace(/&/g, '&amp;');
  document.body.insertAdjacentHTML('beforeend', `
  <div class="mn" id="mn" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">
    <div class="mn__top">
      <a class="mn__logo" href="${H}">SURREO</a>
      <span class="mn__cnt mono">${T('Menu · 05 sezioni', 'Menu · 05 sections')}</span>
      <div class="mn__r"><span class="mn__lg mono"><span data-l="it">IT</span><span data-l="en">EN</span></span><button class="mn__x" id="menuClose"><i></i>${T('Chiudi', 'Close')}</button></div>
    </div>
    <div class="mn__g">
      <aside class="mn__aside mono">
        <dl>
          <div><dt>Studio</dt><dd>Surreo — Unbased #Design Studio<br>${T('Italia · Germania', 'Italy · Germany')}</dd></div>
          <div><dt>${T('Scrivici', 'Write to us')}</dt><dd><a href="mailto:surreocreative@gmail.com">surreocreative@gmail.com</a><br><a href="https://wa.me/393313510091">WhatsApp +39 331 3510091</a></dd></div>
          <div><dt>${T('Segui', 'Follow')}</dt><dd><a href="https://www.instagram.com/surreo_studio/" target="_blank" rel="noopener">Instagram @surreo_studio</a></dd></div>
        </dl>
        <div><dt style="color:var(--g);margin-bottom:6px">${T('Lingua', 'Language')}</dt><span class="mn__lg"><span data-l="it">IT</span><span data-l="en">EN</span></span>
          <div class="mn__leg"><a href="/cv.html">CV</a><a href="/privacy.html">Privacy</a><span>© 2026</span></div></div>
      </aside>
      <nav class="mn__nav" aria-label="${T('Sezioni', 'Sections')}">${ITEMS.map((x, i) => `
        <a href="${x[3]}"${x[4] ? ' class="ext"' : ''} style="--i:${i}"${x[0] === page ? ' aria-current="page"' : ''}>
          <span class="mn__n mono">0${i + 1}</span>
          <span class="mn__nm"><b>${esc(x[1])}</b>${x[0] === page ? `<span class="mn__here">${T('Sei qui', 'You are here')}</span>` : ''}</span>
          <span class="mn__d">${esc(x[2])}</span><span class="mn__ar">${x[4] ? '↗' : '→'}</span></a>`).join('')}
      </nav>
    </div>
  </div>`);
  const mn = document.getElementById('mn'), btn = document.getElementById('menuOpen');
  let last = null;
  const set = o => {
    mn.classList.toggle('open', o); mn.setAttribute('aria-hidden', !o);
    document.body.classList.toggle('mn-lock', o);
    if (o) { last = document.activeElement; setTimeout(() => document.getElementById('menuClose').focus(), 300); }
    else if (last) last.focus();
  };
  if (btn) btn.addEventListener('click', () => set(true));
  // lingua dal menu (stessa memoria di lang.js)
  mn.querySelectorAll('[data-l]').forEach(b => {
    const l = b.dataset.l, cur = EN ? 'en' : 'it';
    b.classList.toggle('on', l === cur);
    b.addEventListener('click', () => { if (l === cur) return; try { localStorage.setItem('surreo.lang', l); } catch (e) {}
      location.href = location.pathname + location.search.replace(/([?&])lang=(it|en)&?/, '$1').replace(/[?&]$/, '') + location.hash; });
  });
  document.getElementById('menuClose').addEventListener('click', () => set(false));
  mn.querySelectorAll('.mn__nav a, .mn__logo').forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && mn.classList.contains('open')) set(false); });
})();
