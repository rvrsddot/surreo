/* SURREO B/N — menu "Indice": costruisce il pannello e lo collega al pulsante #menuOpen */
(() => {
  const page = document.body.dataset.page || '';
  const onHome = page === 'home';
  const H = '/';
  const ITEMS = [
    ['progetti', 'Projects', 'Showcase · Video · Motion · Website', '/progetti.html'],
    ['fotovideo', 'Photo & Film', 'Photography · Moving image', '/fotovideo.html'],
    ['lapidary', 'Lapidary', 'Scrittura · Font trovati per strada', '/lapidary.html', 1],
    ['about', 'About', 'Studio · Manifesto · Come lavoriamo', onHome ? '#about' : H + '#about'],
    ['workshok', 'Workshok', 'Design · Architettura · Since 2018', '/workshok/', 1],
  ];
  const esc = s => s.replace(/&/g, '&amp;');
  document.body.insertAdjacentHTML('beforeend', `
  <div class="mn" id="mn" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">
    <div class="mn__top">
      <a class="mn__logo" href="${H}">SURREO</a>
      <span class="mn__cnt mono">Menu · 05 sezioni</span>
      <div class="mn__r"><button class="mn__x" id="menuClose"><i></i>Chiudi</button></div>
    </div>
    <div class="mn__g">
      <aside class="mn__aside mono">
        <dl>
          <div><dt>Studio</dt><dd>Surreo — Unbased #Design Studio<br>Italia · Germania</dd></div>
          <div><dt>Scrivici</dt><dd><a href="mailto:surreocreative@gmail.com">surreocreative@gmail.com</a><br><a href="https://wa.me/393313510091">WhatsApp +39 331 3510091</a></dd></div>
          <div><dt>Segui</dt><dd><a href="https://www.instagram.com/surreo_studio/" target="_blank" rel="noopener">Instagram @surreo_studio</a></dd></div>
        </dl>
        <div>
          <div class="mn__leg"><a href="/cv.html">CV</a><a href="/privacy.html">Privacy</a><span>© 2026</span></div></div>
      </aside>
      <nav class="mn__nav" aria-label="Sezioni">${ITEMS.map((x, i) => `
        <a href="${x[3]}"${x[4] ? ' class="ext"' : ''} style="--i:${i}"${x[0] === page ? ' aria-current="page"' : ''}>
          <span class="mn__n mono">0${i + 1}</span>
          <span class="mn__nm"><b>${esc(x[1])}</b>${x[0] === page ? '<span class="mn__here">Sei qui</span>' : ''}</span>
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
  document.getElementById('menuClose').addEventListener('click', () => set(false));
  mn.querySelectorAll('.mn__nav a, .mn__logo').forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && mn.classList.contains('open')) set(false); });
})();
