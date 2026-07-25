# Surreo — Creative Studio — Stato Progetto

**Data**: 2026-07-25
**Branch**: main
**Live**: https://surreostudio.com — **HTTPS attivo** (Enforce HTTPS ON, HTTP → 301 su HTTPS)

## ✅ Completato

### Hosting & dominio
- [x] Pagina unica su GitHub Pages, dominio custom `surreostudio.com`
- [x] DNS ok (4 record A GitHub + www CNAME), nessun CAA bloccante
- [x] **HTTPS risolto**: il certificato era bloccato lato GitHub anche dopo 24h →
  sbloccato rimuovendo e ri-aggiungendo il CNAME (commit temporanei), poi
  "Enforce HTTPS" attivato via API

### SEO (italiano) — LIVE
- [x] `<title>` **Surreo — Creative Studio**, description accattivante
  (design a 360°, forte su branding e creatività, componente AI progettuale)
- [x] Open Graph + Twitter card
- [x] **og-image.jpg** 1200×630 (wordmark "Design Studio" su beige + logo SS in basso)
  — generata da asset esistenti via Chrome headless, non un disegno nuovo
- [x] **favicon.svg** (logo SS)
- [x] **robots.txt** + **sitemap.xml**
- [x] JSON-LD `ProfessionalService`: geo Abruzzo/Marche/Teramo/Ascoli Piceno,
  Instagram (`surreo_studio`), knowsAbout con AI/Branding/Creatività
- Nota: le anteprime social vecchie restano in cache su WhatsApp/FB/LinkedIn →
  forzare con FB Sharing Debugger / LinkedIn Post Inspector

### Hero & layout
- [x] Titolo hero = SVG `svg/herotitolo.svg` (MULTIDISCIPLINARY + Design Studio),
  su mobile a tutta larghezza come la linea (scala calcolata per i margini SVG)
- [x] Logo SS a sx con anello tratteggiato in rotazione continua
- [x] Wrapper `.landing` (100dvh flex) → riga UNBASED/ITALY/SURREO sempre a fondo
  schermata; Collateral/Projects/About sotto la piega
- [x] Desktop: logo sx / nav dx. Mobile: burger a sx, brand a dx
- [x] **Menu mobile**: overlay estetica lo-fi (fondo paper, box bordati ink,
  monospace, numerazione 01–04), burger→X

### Collateral & Projects
- [x] Collateral: 3 box compatti a destra, responsive (colonna→riga mobile)
- [x] Projects (home): niente rettangoli, miniature allineate alla griglia,
  titoli vicini alla linea, categorie compatte
- [x] Click miniatura → apre categoria e scorre al progetto (desktop + mobile)
- [x] **MIRRORX**: anteprima `assets/projects/mirrorx/B_MIRRORX_103.jpg` (ottim. 1400px/226K)
- [x] **Videoclip & Motion + Website**: card e miniature **16:9** (no barre nere)
  via classe `.cat--wide` (dimensionamento per altezza: il `padding:50%` del
  carosello azzera le larghezze in %)

## ⏳ In Sospeso
- [ ] **Descrizioni progetti**: ora "Descrizione in arrivo" per tutti
- [ ] **Link reali Collateral**: SAAD, Workshok, Suburbiæ (ora `href="#"`)
- [ ] (opzionale) descrizioni = vero salto SEO

## 🔧 File principali
```
index.html      (pagina + <head> SEO)
styles.css      (?v=122)
app.js          (?v=121 — categorie/carosello, .cat--wide, menu handled inline in index.html)
projects.json   (dati progetti)   videos.json (video/website)
og-image.jpg · favicon.svg · robots.txt · sitemap.xml · CNAME
svg/herotitolo.svg · svg/logo a.svg · svg/logo b.svg
assets/projects/... (miniature)   PROJECTS/ (sorgenti B_MIRRORX ecc.)
```

## 📝 Note tecniche
- Cache buster: incrementare `styles.css?v=` e `app.js?v=` a ogni modifica CSS/JS
- Dev locale: `python3 -m http.server 8888` da /SURREO
- Rigenerare og-image: `scratchpad/og-image.html` + Chrome headless --screenshot → PIL jpg
- Categorie 16:9 = key su nome ("videoclip"/"website") in `renderCategory`

## Contatti
- Email: surreocreative@gmail.com · WhatsApp: +39 331 351 0091
- Instagram: https://www.instagram.com/surreo_studio/
- Zona: Teramo, Ascoli Piceno — Abruzzo, Marche e tutta Italia
