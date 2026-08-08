# WORKSHOK — SAAD Workshop Week

Landing page statica per Workshok, l'hub che dal 2018 organizza la SAAD Workshop
Week ad Ascoli Piceno — workshop intensivi di **design e architettura**.

Stack: **HTML / CSS / JS vanilla**, zero build, deploy su **GitHub Pages**.

## Direzione

Estetica **terminal / OS-brutalista**, monocromo (nero + crema del logo) con un
solo accento **rosso** usato con parsimonia. Tema **velocità / lampo / griglia**.
Riferimento di struttura: siti da creative-developer tipo `vshslv.com`
(chrome da sistema, readout live, scramble, tanto spazio nero) — street, non pacchiano.

Elementi chiave:
- top bar a tab + status bar con **coordinate mouse live, orologio, typewriter**
- cursore custom `mix-blend` che inverte lo sfondo
- testo con **scramble** on scroll/hover
- griglia tecnica di sfondo, grana leggera
- **card corsi che si girano come una carta** (flip 3D) mostrando info + iscrizione

## Struttura

```
WORKSHOK/
├─ index.html          # pagina unica: Hero · Corsi · About · Collab · Iscrizioni
├─ css/style.css       # tema terminal-brutalist (variabili in :root)
├─ js/main.js          # scramble, readout live, flip card, marquee, cursore
├─ data/courses.js     # ⭐ DATI EDIZIONE — l'unico file da toccare ogni anno
└─ assets/
   └─ workshok-logo.png  # wordmark (sorgente in /1x)
```

## Aggiornare un'edizione

Tutto in [`data/courses.js`](data/courses.js):

- `EDITION` → anno, date, città, tagline
- `COURSES` → **sempre 3 slot**. Corso non definito → `status: "coming-soon"`.
  Campi usati dal fronte/retro card: `number, title, theme, tutor, days, blurb`
- `PARTNERS` → scorrono nel marquee "Abbiamo collaborato con"

Card, opzioni del form e marquee si rigenerano da soli. Nessun HTML da riscrivere.

## Form iscrizioni (Formspree)

In [`index.html`](index.html) sostituire `FORM_ID` nell'`action` del form con
l'endpoint reale creato su [formspree.io](https://formspree.io) (nessun backend).
Le CTA "Iscriviti" sul retro delle card preselezionano il corso nel form.

## Personalizzazione stile

Variabili CSS in `:root` ([`css/style.css`](css/style.css)):

- `--accent` → l'unico colore accento (rosso `#ff3b1f`)
- `--bg` / `--fg` / `--dim` / `--line` → base monocroma
- `--mono` (Space Mono) · `--display` (Anton) · `--grotesk` (Archivo)

Font attuali via Google Fonts: per i font veri, metterli in `assets/fonts/`,
dichiararli con `@font-face` e cambiare le variabili.

## Preview locale

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## Deploy GitHub Pages

Push su `main` → Settings → Pages → Deploy from branch `main` / root.
`.nojekyll` evita che Pages ignori cartelle/file.

## Prossimi step (non ora)

Archivio edizioni (`/archivio`, `/archivio/[anno]`): la struttura dati per-edizione
in `data/` è già pensata perché aggiungere un anno = aggiungere un record.
