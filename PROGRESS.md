# Surreo — Creative Studio · Stato Progetto

**Ultimo aggiornamento**: 2026-07-29
**Branch**: main · **Live**: https://surreostudio.com (HTTPS attivo, HTTP → 301)
**Ultimo lavoro**: About redesign v2 (kinetic manifesto) + fix hero scroll + Collateral giustificato

---

## ▶ Come riprendere (avvio rapido)
```bash
cd /Users/riverside/Desktop/GITHUB/SURREO
python3 -m http.server 8888        # dev locale → http://localhost:8888
```
- Modifichi CSS/JS? **Incrementa il cache buster** in `index.html`:
  `styles.css?v=127` e `app.js?v=121` (bump ad ogni modifica).
- Pubblicare: `git add -A && git commit -m "..." && git push origin main`
  → GitHub Pages ricostruisce in ~1 min.

---

## ✅ Fatto (tutto LIVE)

### Hosting / SEO
- HTTPS risolto (certificato era bloccato lato GitHub → sbloccato con
  rimozione/ri-aggiunta CNAME + "Enforce HTTPS").
- SEO italiano completo: title **"Surreo — Creative Studio"**, description,
  Open Graph + Twitter, `og-image.jpg` (wordmark + logo SS), `favicon.svg`,
  `robots.txt`, `sitemap.xml`, JSON-LD ProfessionalService (geo Abruzzo/
  Marche/Teramo/Ascoli, Instagram `surreo_studio`, AI).

### Hero
- Titolo = SVG `svg/herotitolo.svg`; su mobile a tutta larghezza (calc vw).
- Logo SS a sx con anello tratteggiato in rotazione.
- Wrapper `.landing` (100dvh) → riga UNBASED/ITALY/SURREO sempre a fondo
  schermata; sezioni sotto la piega.
- Desktop: logo sx / nav dx. Mobile: **menu burger** a sx, brand a dx;
  overlay lo-fi (paper, box bordati, monospace, numerazione 01–04).

### Collateral & Projects
- Collateral: box a sinistra, vicini (gap ridotto, tag max-width 72px).
- Projects (home): niente rettangoli, **niente outline** miniature,
  allineate alla griglia; titolo "PROJECTS — SHOWCASE" centrato/allineato
  alle categorie anche su schermi larghi (fix `.sec-head`).
- **MIRRORX**: anteprima `assets/projects/mirrorx/B_MIRRORX_103.jpg`.
- **Videoclip & Motion + Website**: card e miniature **16:9** (no barre
  nere) via classe `.cat--wide` (dimensionate per altezza).
- Click miniatura → apre categoria e scorre al progetto (desktop + mobile).

### About (redesign v2 — kinetic manifesto, ultimo lavoro)
- **Topbar meta** monospace: `SURREO / ABOUT · ED. 2026 · LIVE · N.002/002`
  con pallino rosso stamp pulsante.
- **Hero cinetico**: parola `ABOUT` gigante (Space Grotesk 700,
  clamp 88→220px) con ogni lettera in wobble ±1.2° infinito + cursor
  parallax leggero (JS inline).
- **SS anchor mark** a destra della stessa dimensione visiva di ABOUT
  (usa il logo del sito, aspect 1/1, `justify-self:end`): due ring
  tratteggiati concentrici rotanti (`ring` 12s, `ring2` 20s reverse).
- **Thesis marquee** enorme (Space Grotesk 700 fino a 72px): ripete
  `Non partiamo da una disciplina / Partiamo da un'idea` con
  `un'idea` in rosso stamp.
- **Manifest grid** 01/02/03/04 (CHI · COME · CON COSA · DOVE) con
  quadrato ink come bullet e scroll-reveal (IntersectionObserver).
  Row 02 è la chiave, con `.hl` in evidenza.
- **Stats row** 4 celle: UNBASED (Studio) · XXX (Progetti) · 2019
  (Fondato) · IT/DE (Basi). Hover invert ink/paper.
- **CTA** CHIAMA/MAIL ME con box-shadow `6px 6px 0 ink` su hover.
- Footer sito invariato (chiusura in `.contact__foot`).
- **Fix collaterali stesso commit**: hero SVG title con
  `pointer-events:none`+`draggable=false` (scroll bloccato sopra il
  titolo su desktop); Collateral 3 box `justify-content:flex-end`
  con gap ridotto (~4.5px).

---

## ⏳ Da fare (backlog)
- [ ] **Descrizioni progetti**: ancora "Descrizione in arrivo" per tutti
      → è il vero salto SEO/contenuto.
- [ ] **Link reali Collateral**: SAAD, Workshok, Suburbiæ (ora `href="#"`).
- [ ] Eventuale coerenza copy hero ("Multidisciplinary Design Studio") vs
      brand nuovo ("Creative Studio").

---

## 🔧 File principali
```
index.html      pagina + <head> SEO + font (Bagel, Space Grotesk 300;700)
                (script inline: burger + About cursor-parallax + scroll-reveal)
styles.css      ?v=129   (lo-fi: paper/ink; sezione About redesign v2 in fondo)
app.js          ?v=121   (categorie/carosello, .cat--wide; menu burger inline in index.html)
projects.json · videos.json
og-image.jpg · favicon.svg · robots.txt · sitemap.xml · CNAME
svg/herotitolo.svg · svg/logo a.svg · svg/logo b.svg
ORNAMENTI/SVG/SMYLE.svg   (smiley About; inline in index.html, cartella NON tracciata da git)
assets/projects/...       (miniature)   PROJECTS/ (sorgenti B_MIRRORX)
```

## 📝 Note tecniche
- Palette: `--paper:#eceae1 --ink:#16140f --line:#c9c4b6 --muted:#8a8578`.
- Categorie 16:9 = match su nome ("videoclip"/"website") in `renderCategory` (app.js).
- Rigenerare og-image: `scratchpad/og-image.html` + Chrome headless
  `--screenshot` → PIL jpg (usa herotitolo.svg + logo b).
- Font incorporati nell'artifact di concept via `text=` subset + base64
  (per il SITO invece si caricano da Google Fonts nel <head>).
- Anteprime social in cache su WhatsApp/FB/LinkedIn → forzare con
  FB Sharing Debugger / LinkedIn Post Inspector.

## Contatti / dati
- Email: surreocreative@gmail.com · WhatsApp/Tel: +39 331 351 0091
- Instagram: https://www.instagram.com/surreo_studio/
- Zona: Teramo, Ascoli Piceno — Abruzzo, Marche e tutta Italia
