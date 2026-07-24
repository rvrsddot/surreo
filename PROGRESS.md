# Surreo Studio — Stato Progetto

**Data**: 2026-07-24  
**Branch**: main  
**Live**: https://surreostudio.com (HTTP) | https://surreostudio.com (HTTPS in emissione)

## ✅ Completato

### Architettura
- [x] **Pagina unica** (da GitHub Pages, non Readymag)
- [x] **Dominio custom** `surreostudio.com` → punta a GitHub Pages
- [x] **DNS configurato** (4 record A + www CNAME)
- [x] **HTTPS in emissione** (Let's Encrypt, pronto tra poche ore)

### Layout & Design
- [x] **Marquee** servizi scorrevole
- [x] **Header** (◆ SURREO STUDIO + nav: Projects / About / Mail me! / WhatsApp)
- [x] **Hero** "MULTIDISCIPLINARY / DESIGN STUDIO" (Bagel Fat One)
- [x] **Collateral Projects** layout finale:
  - Titolo a sx allineato col top dei box
  - 3 box piccolissimi a destra
  - Etichette (CO-FOUNDER, CREATIVE DIRECTION) a sx di ogni box, molto vicine
  - Linea orizzontale sopra/sotto
- [x] **Projects — Showcase** (categorie/carosello):
  - 6 categorie: Graphic (27), Industrial (8), Exhibit (7+3 video), Virtual (2), Videoclip & Motion (10), Website (6)
  - Click miniatura → espansione categoria + slide al progetto
  - Carosello orizzontale 1:1 piatto (no 3D, solo opacity 0.48 → 1.0)
  - Foto in autoplay (gif, 200ms/frame) / video YouTube (autoplay muto)
  - Click card → flip 3D rotateY 180° → lato info (titolo, categoria, "Descrizione in arrivo", contatti)
  - Close con ×, Esc, backdrop click
  - Contatore "01 / 27" in basso
- [x] **About** sezione con testo reale
- [x] **Contact us!** (email + WhatsApp)
- [x] **Palette lo-fi** uniforme:
  - `--paper:#eceae1` (beige)
  - `--ink:#16140f` (nero)
  - `--line:#c9c4b6` (grigio)
  - `--muted:#8a8578` (grigio opaco)

### Asset & Contenuti
- [x] **Font**: Bagel Fat One (Google Fonts) + Helvetica/Arial per corpo
- [x] **Dati progettati**: projects.json (6 sezioni, ~60 progetti) + videos.json (categorie video)
- [x] **Miniature**: asset/projects/{nome}/01.jpg
- [x] **Video**: YouTube embed (autoplay=1&mute=1)

## ⏳ In Sospeso (Backlog)

### Dati Mancanti
- [ ] **Link reali Collateral**: SAAD Workshop Week, Workshok, Suburbiæ Music Fest (ora href="#")
- [ ] **Descrizioni progetti**: ora "Descrizione in arrivo" per tutti
- [ ] **Logo reale**: ora "◆ SURREO STUDIO" testuale
- [ ] **Font hero esatto**: Bagel Fat One è simile, ma se ne hai uno specifico, sostituisco

### Certificato HTTPS
- [ ] **Attendere emissione** (GitHub Pages, ~2-24h da quando DNS è stato puntato)
- [ ] Una volta pronto: spuntare "Enforce HTTPS" in GitHub → Settings → Pages
- [ ] Poi `https://surreostudio.com` funzionerà senza avvisi

### Ottimizzazioni Future
- [ ] Dark mode (layout è già theme-aware)
- [ ] Scroll spy nav (highlight sezione corrente)
- [ ] PostMessage iframe height tracking (già in app.js per Readymag, non più rilevante)

## 🔧 File Principali

```
/Users/riverside/Desktop/GITHUB/SURREO/
├── index.html           (pagina unica, structure)
├── styles.css          (lo-fi design, responsive)
├── app.js              (logica categorie/carosello)
├── projects.json       (dati progetti 6 categorie)
├── videos.json         (dati video, YouTube IDs)
├── CNAME               (surreostudio.com)
├── .claude/launch.json (server Python 5178)
└── assets/projects/    (foto miniature 1:1)
```

## 📝 Note Tecniche

- **Cache buster**: styles.css?v=105, app.js?v=105 (incrementare se cambi CSS/JS)
- **Branch safe**: tag `design-v1-pulito` al commit c9da13d (backup design precedente)
- **Rollback veloce**: `git reset --hard design-v1-pulito && git push --force origin main`
- **Local dev**: `python3 -m http.server 5178` da /SURREO
- **Dati caricano via fetch** (cache: "no-store") → projects.json / videos.json

## 🎯 Prossimi Step (Sessione Successiva)

1. **Verifica HTTPS** → controllare se certificato è pronto
2. **Aggiungi link Collateral** → modificare href="#" con URL veri
3. **Aggiungi descrizioni progetti** → sostituire "Descrizione in arrivo"
4. **Test finale** → desktop + mobile, tutti i flow
5. **Deploy finale** → confermare tutto è live su surreostudio.com

---

**Git Log Recap:**
```
0425f68 - Collateral: layout orizzontale - titolo sx, box dx con tag sx
92883fc - Collateral: frecce a destra, titolo a sinistra, layout identico a Readymag
0f7dfe6 - Collateral Projects: ridimensionati a mini (identici a Readymag) + frecce
f80f645 - Pagina unica: marquee/header/hero/collateral/about/contatti + sezione progetti integrata (lo-fi)
c09fd9c - Rework: modello categorie/carosello (miniature→espansione→slide→gif/video→flip info)
```

**Contatti:**
- Email: surreocreative@gmail.com
- WhatsApp: +39 331 351 0091
- Dominio: surreostudio.com (attivo, DNS OK, HTTPS in via di emissione)
