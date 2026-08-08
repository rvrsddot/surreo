# WORKSHOK — HANDOFF (stato progetto)

> Per riprendere in una chat nuova: *"Progetto WORKSHOK in `GITHUB/WORKSHOK/`. Leggi `HANDOFF.md` e continua."*

## Cos'è
Landing page statica per **Workshok** — hub che dal 2018 organizza la **SAAD Workshop Week** ad Ascoli Piceno (workshop di **design e architettura**, 3 corsi per edizione). Obiettivo: vendere i workshop. Fase 1 = landing singola. Fase 2 (dopo) = archivio edizioni.

## Stack / come far girare
- **HTML/CSS/JS vanilla**, zero build, deploy previsto su **GitHub Pages**.
- Preview locale: `python3 -m http.server 4173 --directory .` → `http://127.0.0.1:4173/`
- ⚠️ **Cache-bust**: css/js in `index.html` hanno `?v=N`. **Bumpare N a ogni modifica** di css/js, altrimenti il browser serve la versione vecchia (già capitato: schermate rotte/nere).

## Direzione visiva DEFINITIVA — brand SWW8 (chiaro monocromo)
Fonte di verità = poster ufficiale 2026 in `1x/SWW8 (trascinato).pdf`.
- **Palette**: dominante **menta pallido `#f1f5e0`** (campionato al pixel dal poster) + **nero `#14130a`**. **Monocromo**, niente accenti.
- **Font**: `Space Grotesk` (testi + titoli, titoli **monocolore nero pieno**) · `Space Mono` (solo readout di sistema).
- **Wordmark**: lettering **half-fill** (metà contorno sopra / metà nero sotto) estratto dal PDF → `assets/workshok-wordmark.png`. Nell'hero grande (si fonde sul menta), nel footer piccolo e centrato. Topbar usa `assets/workshok-logo.png` con `filter:brightness(0)`.
- **Mood**: skate-editoriale. Etichette da poster: `SINCE 2018` · `2026` · `UNCONVENTIONAL HUB` · `X UNICAM SAAD`.
- Componenti: sezioni come **finestre/folder** (barra `📁 NN NOME.EXE [READY]` + pallini), **card corsi flip 3D** (Iscriviti anche sul fronte, preseleziona il corso nel form), **dial circolare rotante** (↓ → scrolla ai corsi), **marquee** partner, **status bar** con coordinate mouse live + coordinate Ascoli + orologio + typewriter, cursore mix-blend.

## File chiave
- `data/courses.js` — **UNICO file dei contenuti** (edita qui): `EDITION`, `COURSES` (3 slot, vuoto = `status:"coming-soon"`), `PARTNERS`, `SELECTED`, `SITE` (version/credit/coords).
- `index.html` — struttura + testi About + microcopy.
- `css/style.css` — tema (variabili in `:root`).
- `js/main.js` — render card/partner, flip, scramble, orologio, coordinate, marquee.
- `assets/` — `workshok-wordmark.png` (hero/footer), `workshok-logo.png` (topbar), `sww8-poster.png` (poster intero).

## FATTO
Layout completo e funzionante: hero poster + wordmark, 4 finestre (Corsi · About · Collab · Iscrizioni), card flip, marquee coi partner reali + credenziale SELECTED (AIAP × Triennale), form, footer, status bar. Palette brand applicata. Verificato in preview, zero errori console.

## DA FARE (prossimi passi)
1. **Contenuti reali 3 corsi** in `data/courses.js` (titoli, temi, tutor, date, descrizioni). Ora sono placeholder ("Metodi Sporchi", "Cemento Vivo") e **coperti da overlay "COMING SOON"** (blur) perché non ancora pubblici. Flag `LOCK_ALL` in `js/main.js`: **quando escono i corsi veri, metterlo a `false`** → le card tornano cliccabili/flip e il form ripopola le opzioni corso.
2. ~~**Meta hero**~~ ✅ FATTO: data-driven da `EDITION` in `data/courses.js` + sottotitolo **"Architecture & Design Hub"** sotto il wordmark (`.hero__sub`). ⚠️ verificare che `dates` e `edition: "N.08"` siano i valori veri.
3. **Credit sito**: `SITE.credit` (metti il nome giusto). = riga "SITE — …" nel footer (chi firma il sito).
4. **Formspree**: sostituire `FORM_ID` in `index.html` con l'endpoint vero. Nota: con `LOCK_ALL=true` il form ha una sola voce "Lista d'attesa".
5. (Opz.) **Wordmark come SVG/PNG trasparente** al posto del crop dal PDF (il crop taglia di pochissimo la punta bassa di un paio di aste). Vettoriale = più nitido.
6. ~~Deploy GitHub Pages~~ ✅ **FATTO (anteprima)**: repo `github.com/rvrsddot/workshok` (branch `main`, root), Pages attivo → **https://rvrsddot.github.io/workshok/**. Account gh: **rvrsddot**. `gh` CLI installato via brew. `FOTO/` e `1x/` esclusi via `.gitignore`. Per aggiornare il sito: modifica qui → `git add -A && git commit && git push` → Pages ri-builda da solo. ⚠️ È online con contenuti placeholder (corsi COMING SOON, date XXX, form senza FORM_ID).
7. **Anteprima social** (`og:image`/Twitter card) mancante — riusare `assets/sww8-poster.png` (ora asset orfano). Rimandato.

### BLOCCO A — brief 2ª sessione (FATTO, cache v=9)
- A1 Cursore → **freccia nera** (clip-path + `mix-blend-mode:difference`, tip a 0,0).
- A2 Header hero → label destra ora **"XXX 2026"** (placeholder data; era "X UNICAM SAAD").
- A3 Cella **FORMATO** giustificata a destra (`.cell:last-child`), allineata al margine dx.
- A4 **QUANDO** → `EDITION.dates` = "XXX — stiamo arrivando :)" (placeholder).
- A5 **About** testo definitivo (nuovo lede + 2 colonne) + layout editoriale (linea di riferimento sopra le colonne).
- A6 **Iscriviti** centrato (`#iscrizioni` head + form `margin-inline:auto`).
- A7 **Card** responsive: `.cards` max-width 1120px + `margin-inline:auto`, `.card` max-height 480px → non si deformano su schermi larghi.
- A8 Verificato desktop + mobile (375px): 1 colonna, no scroll-x.

### SESSIONE 4 — SEO
- `<head>` ottimizzato: title/description keyword-rich (design, grafica, architettura, workshop, studenti, professionisti, Ascoli Piceno…), `meta keywords`, `robots index,follow`, `canonical`, **Open Graph + Twitter card** (og:image = `sww8-poster.png`).
- **JSON-LD schema.org** `EducationalOrganization` + `EducationEvent`: knowsAbout (11 campi), audience (studenti/professionisti), location Ascoli Piceno/Marche, `sponsor` con i collaboratori (Caffè Design, Zetafonts, FF3300, Detroit Studio, Ocularlab, …).
- Aggiunti **`robots.txt`** + **`sitemap.xml`** (root). L'utente vuole essere trovato → **niente noindex** (deciso di NON nasconderlo).
- ⚠️ SEO tecnica fatta, ma il ranking reale richiede: contenuti veri dei corsi + submit su **Google Search Console** + tempo/backlink. Da fare quando i contenuti sono definitivi.

### SESSIONE 3 (cache v=20)
- **Foto RIMOSSE** (l'utente ha cambiato idea): tolto `.photofan`/`about-wrap`, blocco JS "PHOTO BURST", cartella `assets/photos/`. About tornata a piena larghezza (lede + 2 colonne, con `text-wrap: balance/pretty`).
- **Finestre collassabili**: click (o Enter/Space) sulla `.win__bar` → `.win.is-collapsed` → il `.win__body` si **ritira su** (max-height→0) lasciando solo la barra; lo status diventa **`[ + OPEN ]`** (torna all'originale riaprendo). Logica in `js/main.js` blocco "Finestre collassabili"; CSS su `.win__bar`/`.win.is-collapsed`. Barra aggiunta agli elementi "hot" del cursore.
- **Wordmark hero → SVG + tilt 3D leggero** (v=25, LIVE): da PNG a **`assets/workshok-wordmark.svg`** (vettoriale half-fill). ⚠️ L'effetto liquido (feTurbulence+feDisplacementMap) è stato provato ma **pesava troppo (GPU)** → RIMOSSO del tutto (filtro/CSS/JS). Ora sul `.hero__wordmark` c'è un **tilt 3D** che segue il mouse: `perspective(900px) rotateX/rotateY` (max 9°), solo `transform` (compositor, leggero), lerp rAF. Off su touch/reduced-motion → **mobile: scritta base ferma**. Blocco JS "tilt 3D" in main.js. Footer usa lo stesso SVG statico.
- **Favicon → SVG nuovo** dell'utente (`assets/favicon.svg`: cerchio menta + monogramma W), sostituisce il pallino a 2 cerchi. Sorgenti in `SVG/` (`logo workshok.svg`, `favicon.svg`). PNG wordmark non più referenziato (rimuovibile).

### BLOCCO B — (foto RIMOSSE in sessione 3, vedi sopra)  ~~ventaglio affianco ad About~~
- 6 foto bass-res scelte (le JPG UUID) → **ottimizzate** con `sips -Z 1000 -s formatOptions 60` in `assets/photos/ph-1..6.jpg` (**676 KB totali**, da centinaia di MB).
- About ora è `.about-wrap` (2 col, `align-items:stretch`, `overflow-x:clip`): testo a sx (1fr), `.photofan` a dx (1.4fr). Le 6 `<img>` (grayscale/BNW, bordo ink, ombra) sono **grandi** — quadrate `max-width/max-height:100%` → il quadrato più grande che entra nella colonna, riempie ~88–92% dell'altezza del testo (dal margine sopra a quello sotto), senza sforare né dare scroll-x.
- Animazione: partono nascoste; **quando la zona entra in viewport** (IntersectionObserver .4) **escono a raffica da destra** (stagger 95ms) e si **impilano sullo STESSO asse** (micro-jitter `JX/JY`, rotazioni leggere `ROT`); poi **in LOOP** (entra → pausa `HOLD` 1200ms → esce → ripete) finché è in vista. Blocco "PHOTO BURST" in `js/main.js` (funzioni `cycle/start/stop`). Foto `loading="lazy"`.
- Testo About: `text-wrap: balance` sul lede, `text-wrap: pretty` sulle colonne (a capo puliti).
- Iterazioni bocciate: ventaglio ad arco; pila 45° con parallasse mouse; burst one-shot (voluto in loop).
- ⚠️ Foto rese **B/N (grayscale)** per rispettare il monocromo brand — **da confermare** se le vuole a colori.

### BLOCCO C — FATTO (SELECTED scalato)
- `.selected` ora `justify-content: space-between` + font `clamp(13px,1.5vw,20px)` → il blocco (SELECTED · AIAP × Triennale · mostra · date) **riempie/giustifica tutta la riga**. Nessun logo (l'utente ha chiarito: solo scalare il testo esistente).

### ⚠️ Nota screenshot preview
Il tool `preview_screenshot` restituisce schermate **menta vuote** quando la sezione About è nel viewport (fasce di scroll profonde, prob. per overlay fixed con mix-blend/backdrop-filter). Non è un bug del sito: DOM verificato ok. Hero e Corsi si catturano bene.

### FATTO in sessioni precedenti
- Favicon `assets/favicon.svg` (pallino menta + pallino nero all'80%), linkata in `<head>`.
- Overlay "COMING SOON" sfocato su tutte le card (`.card__lock`, flag `LOCK_ALL`).
- Sottotitolo hero "Architecture & Design Hub".
- Dial "GUARDA I CORSI" rialzato (non si sovrappone più alla griglia meta).
- Cache-bust a `?v=8`.

## ⚠️ DIREZIONI GIÀ BOCCIATE (non riproporre)
- Skate-zine con sticker/tape/xerox → "banale".
- Rosa Sottsass/Memphis + effetto goo/blob col mouse → "orribile".
- **Font/scritte in OUTLINE** (`-webkit-text-stroke`) → "linee sovrapposte, vengono male", **odiati**. Solo **fill pieno**.
- Font **Pirata One** (blackletter) → "fa schifo". **Anton** → "banale".
- Versione **dark utopia** con accento **acido/neon verde** → superata dal brand chiaro.
- **Il logo NON va sostituito con un font**: usare sempre il lettering vero.

## Note tecniche
- Il PDF brand era su volume esterno `/Volumes/SurreoStudio` **bloccato da macOS (TCC)**; copiato in `WORKSHOK/1x/`.
- Preview panel: se "non si vede nulla", il pannello punta al server sbagliato (Vite di un altro progetto su :5173) o a css/js cachati → usare il server statico su **:4173** e hard-reload.
