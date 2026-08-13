/* =========================================================================
   WORKSHOK — DATI EDIZIONE
   Aggiornare QUESTO file ogni anno. Le card dei corsi si rigenerano da qui.
   Struttura pensata anche per l'archivio (Fase 2): un record = un'edizione.
   ========================================================================= */

window.EDITION = {
  year: 2026,
  edition: "N.08",                      // SWW8 (dal poster ufficiale)
  title: "SAAD Workshop Week",
  city: "Ascoli Piceno",
  dates: "8–11 Sept",
  days: "4 giorni · 32 ore",
  tagline: "Due workshop. Una settimana. Rompi la griglia.",
};

/* Link Iscriviti — Google Form ufficiale (uguale per entrambi i corsi). */
window.ENROLL_URL = "https://forms.gle/rXmL8mes7hfhnATh8";

/* Elenco corsi dell'edizione corrente. */
window.COURSES = [
  {
    status: "open",
    number: "01",
    title: "AI, Fammi 'Sto Fatto",
    theme: "AI per web, app e visual interattivi",
    tutor: "Giovanni Abbatepaolo",
    tutorRole: "Progettista multidisciplinare, docente sviluppatore",
    tool: "Ollama",
    /* Palette presa dalla card IG (rosa + blu elettrico) */
    palette: { bg: "#F5B4D0", ink: "#2F2BEE", label: "AI · Ollama" },
    /* Loop video sulla card (autoplay muted) — sostituisce il crossfade di immagini */
    cardLoop: { src: "assets/corsi/abbatepaolo/loop.mp4", poster: "assets/corsi/abbatepaolo/loop-poster.jpg" },
    /* Media a scorrimento — video del corso Abbatepaolo (con poster JPG per fallback iniziale) */
    media: {
      kind: "video",
      items: [
        { src: "assets/corsi/abbatepaolo/video-06.mp4", poster: "assets/corsi/abbatepaolo/video-06.jpg" },
        { src: "assets/corsi/abbatepaolo/video-04.mp4", poster: "assets/corsi/abbatepaolo/video-04.jpg" },
        { src: "assets/corsi/abbatepaolo/video-01.mp4", poster: "assets/corsi/abbatepaolo/video-01.jpg" },
        { src: "assets/corsi/abbatepaolo/video-05.mp4", poster: "assets/corsi/abbatepaolo/video-05.jpg" },
        { src: "assets/corsi/abbatepaolo/video-03.mp4", poster: "assets/corsi/abbatepaolo/video-03.jpg" },
        { src: "assets/corsi/abbatepaolo/video-08.mp4", poster: "assets/corsi/abbatepaolo/video-08.jpg" },
        { src: "assets/corsi/abbatepaolo/video-02.mp4", poster: "assets/corsi/abbatepaolo/video-02.jpg" },
        { src: "assets/corsi/abbatepaolo/video-07.mp4", poster: "assets/corsi/abbatepaolo/video-07.jpg" },
      ],
    },
    dates: "8–11 Sept",
    hours: "32 ore",
    days: "4 giorni · 32 ore",
    seats: "25 utenti",
    location: "Ascoli Piceno · UNICAM SAAD",
    cfu: "2 CFU per studenti SAAD",
    audience: "Aperto a tutti — studenti (tutti gli atenei) & professionisti",
    recommended: "Studenti design, architettura, creativi",
    blurb:
      "Progettare siti, app e visual interattivi con l'AI, senza scrivere una riga di codice.",
    description: [
      "Un workshop **intensivo** dedicato all'uso dell'**intelligenza artificiale** per progettare **siti web, applicazioni e visual interattivi** — **senza programmazione**.",
      "Oggi l'AI permette a designer e creativi di realizzare in pochissimo tempo prototipi e progetti complessi che fino a poco tempo fa richiedevano **programmatori, budget e tempi** molto più grandi.",
      "Il workshop è **fortemente orientato alla pratica**: attraverso esercizi, sperimentazione e lavoro diretto sui progetti, imparerai a usare strumenti e metodologie **più adatte del semplice ChatGPT** per costruire prodotti digitali completi.",
      "L'obiettivo è acquisire una **vera autonomia progettuale**, superare i limiti tecnici e trasformare le proprie idee in progetti funzionanti. **Percorso seguito passo passo**, con supporto individuale e senza lasciare indietro nessuno.",
    ],
    tutorBio: [
      "Docente, sviluppatore e progettista multidisciplinare. Si laurea nel **2020 in Progettazione grafica e comunicazione visiva all'ISIA di Urbino**.",
      "**Dal 2018** tiene workshop di grafica, tipografia, programmazione e organizzazione dell'informazione in diverse accademie e università italiane. **Dal 2022** lavora come sviluppatore web per **Dyne.org** e **Forkbomb B.V.** e **dal 2024** insegna **Creative Coding all'Accademia di Belle Arti di Perugia**, con particolare attenzione all'uso consapevole di strumenti avanzati di intelligenza artificiale.",
    ],
    result:
      "Al termine del workshop avrai sviluppato un **progetto originale** basato sull'uso dell'AI, sperimentando la creazione di **app, tool digitali e sistemi di grafica generativa**. Un **output concreto e funzionante**, applicabile al tuo ambito creativo o professionale. I progetti finali saranno **raccolti, presentati e proiettati** al termine del workshop.",
    note: "**Se provieni da un altro ateneo, contatta la tua segreteria di riferimento per verificare l'eventuale riconoscimento di crediti formativi.",
  },
  {
    status: "open",
    number: "02",
    title: "AI & Creativity",
    theme: "AI come strumento creativo per branding e design",
    tutor: "Emanuele Morelli",
    tutorRole: "Creative Director, AI Media Designer e docente",
    tool: "FloraFauna AI",
    /* Palette presa dalla card IG (crema + rosa) */
    palette: { bg: "#EDE8CF", ink: "#14130A", accent: "#F5B4D0", label: "AI · FloraFauna" },
    /* Media a scorrimento — sample immagini dal corso Morelli */
    media: {
      kind: "image",
      items: [
        { src: "assets/corsi/morelli/A.webp", alt: "Workshop AI & Creativity — output visivo generato con FloraFauna AI (1)" },
        { src: "assets/corsi/morelli/B.webp", alt: "Workshop AI & Creativity — output visivo generato con FloraFauna AI (2)" },
        { src: "assets/corsi/morelli/C.webp", alt: "Workshop AI & Creativity — moka Hermès × Bialetti riformulata con AI" },
        { src: "assets/corsi/morelli/D.webp", alt: "Workshop AI & Creativity — concept di prodotto generato con AI" },
        { src: "assets/corsi/morelli/E.webp", alt: "Workshop AI & Creativity — direzione visiva editoriale generata con AI" },
        { src: "assets/corsi/morelli/F.webp", alt: "Workshop AI & Creativity — reinterpretazione branding con AI" },
      ],
    },
    dates: "8–11 Sept",
    hours: "32 ore",
    days: "4 giorni · 32 ore",
    seats: "25 utenti",
    location: "Ascoli Piceno · UNICAM SAAD",
    cfu: "2 CFU per studenti SAAD",
    audience: "Aperto a tutti — studenti (tutti gli atenei) & professionisti",
    recommended: "Studenti design, architettura, creativi",
    blurb:
      "L'AI come strumento creativo per branding, design e comunicazione. Dal brief al concept.",
    description: [
      "Un workshop **intensivo** dedicato all'**intelligenza artificiale come strumento creativo** per **branding, design e comunicazione**.",
      "Durante le quattro giornate acquisirai un **metodo pratico** per integrare l'AI nel processo creativo e sviluppare **concept, immagini e direzioni visive** a partire da brief e identità di brand.",
      "**Fortemente orientato alla pratica**: attraverso **casi studio, sperimentazione con FloraFauna AI, revisioni e mentoring**, lavorerai direttamente alla costruzione dei tuoi concept.",
      "L'obiettivo è esplorare come l'AI possa **ampliare le possibilità progettuali** e **supportare il pensiero creativo**.",
    ],
    tutorBio: [
      "Emanuele Morelli è **Creative Director, AI Media Designer e docente** specializzato nell'applicazione dell'intelligenza artificiale ai **processi creativi**.",
      "Collabora con aziende, istituzioni e scuole di design, tenendo **workshop e conferenze internazionali** dedicati all'integrazione dell'AI nel mondo del progetto. La sua ricerca si concentra sul **rapporto tra creatività umana, innovazione e tecnologie generative**, promuovendo un approccio **pratico e consapevole** all'uso dell'AI nel design.",
    ],
    result:
      "Al termine del workshop avrai sviluppato un **progetto originale** usando l'AI come supporto al processo creativo, con un **metodo di lavoro immediatamente applicabile** al tuo ambito professionale e maggiore consapevolezza delle potenzialità delle **tecnologie generative**. Il lavoro andrà **impaginato e presentato**.",
    note: "**Se provieni da un altro ateneo, contatta la tua segreteria di riferimento per verificare l'eventuale riconoscimento di crediti formativi.",
  },
];

/* Partner / collaborazioni — lista reale (scorrono nel marquee) */
window.PARTNERS = [
  "No-made boards", "Ocularlab",
  "Alessio Ballerini", "Caffè Design",
  "Martin Romeo", "Ultraviolet.to",
  "Studio Chromo", "FF3300",
  "E. Colantoni", "G. Abbatepaolo",
  "Francesco Pezzuoli", "Diorama Studio",
  "Homu Architects", "Zetafonts",
  "Atelier Crilo", "Detroit Studio",
  "Niccolò Miranda", "Centauroos",
  "Pio L. Cocco", "M. Marinangeli",
  "Typebreak",
];

/* Dati di sistema (UI stile utopia) — version, credit sito, coordinate */
window.SITE = {
  version: "v2.7",
  credit: "WORKSHOK",
  coords: "42.8536°N 13.5749°E",       // Ascoli Piceno
};

/* Credenziale/selezione da mettere in evidenza */
window.SELECTED = {
  label: "SELECTED",
  org: "AIAP × Triennale di Milano",
  title: "Mostra — Il mestiere di grafico, oggi",
  dates: "26 nov 2021 – 23 gen 2022",
};
