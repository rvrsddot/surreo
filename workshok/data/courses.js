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
    theme: "Fare siti web e applicazioni con l'intelligenza artificiale (in modo avanzato ma che in realtà è semplicissimo)",
    tutor: "Giovanni Abbatepaolo",
    tutorRole: "Docente, sviluppatore, architetto dell'informazione, progettista poliedrico",
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
      "Fare siti web e applicazioni con l'intelligenza artificiale — in modo avanzato ma semplicissimo.",
    description: [
      "Nell'ultimo anno, l'IA è diventata precisissima nel realizzare siti web e applicazioni: oggi un designer può realizzare da solo progetti complessi che in passato richiedevano un programmatore esperto, tantissimo tempo e soldi. **In cinque minuti fai un prototipo; in mezz'ora fai un progetto completo.**",
      "Guardate questo sito web: https://bbtgnn.github.io/warmup-workshop-results/. All'interno ci sono decine di applicazioni e visual interattivi che sono state realizzate da studenti in mezza giornata. E nessuno di questi aveva conoscenze pregresse di programmazione.",
      "Tutti conosciamo ChatGPT, ma non è la cosa più adatta per realizzare queste cose. L'obiettivo del corso sarà insegnare le tecnologie e le metodologie necessarie per avere una padronanza del settore e sostanzialmente poter fare il cazzo che si vuole (ovvero realizzare progetti senza limiti tecnici).",
      "La mia metodologia di insegnamento: **tanta pratica, poca teoria** (che distribuisco mentre facciamo gli esercizi, così non resta in astratto). E poi seguo le persone 1 a 1, senza lasciare nessuno indietro: proseguo nella spiegazione solo quando tutte e tutti hanno capito.",
    ],
    tutorBio: [
      "Docente, sviluppatore, architetto dell'informazione, progettista poliedrico, ma soprattutto: una persona molto alta (non spaventatevi quando lo vedrete).",
      "Si laurea nel **2020 in Progettazione Grafica e Comunicazione Visiva presso l'ISIA di Urbino** con una tesi dal titolo \"Il filo del discorso\", in cui discute la progettazione di un'applicazione (attualmente in sviluppo) in grado di assistere studenti e docenti nel visualizzare la struttura del ragionamento di un qualsiasi testo argomentativo.",
      "**Dal 2018** si occupa di didattica: ha tenuto workshop di progettazione grafica, tipografia, programmazione e organizzazione delle informazioni presso diverse istituzioni, tra cui: **Accademie di Belle Arti di Roma, Frosinone e Macerata, UNIRSM San Marino, UNICAM Ascoli, ABADIR Catania.**",
      "Ricopre il ruolo di **sviluppatore web presso Dyne.org e Forkbomb B.V. dal 2022**.",
      "**Dal 2024** è **professore di Creative Coding presso l'Accademia di Belle Arti di Perugia**, dove insegna come utilizzare strumenti avanzati di intelligenza artificiale (in modo consapevole).",
    ],
    note: "Attestato di partecipazione valido per la convalida di CFU. È consigliato informarsi presso la propria segreteria studenti per verificare l'accettazione.",
  },
  {
    status: "open",
    number: "02",
    title: "AI & Creativity",
    theme: "Esplorare nuovi processi creativi attraverso l'Intelligenza Artificiale",
    tutor: "Emanuele Jane Morelli",
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
      "Esplorare nuovi processi creativi attraverso l'Intelligenza Artificiale.",
    description: [
      "Un workshop intensivo dedicato **all'esplorazione dell'Intelligenza Artificiale come strumento creativo per il design, la comunicazione e l'innovazione.**",
      "Durante quattro giornate di lavoro, i partecipanti acquisiranno un metodo pratico per integrare l'AI nel proprio processo creativo, imparando a sviluppare idee, immagini e concept attraverso un approccio sperimentale e progettuale.",
      "Il workshop sarà fortemente orientato alla pratica: dopo una breve introduzione teorica e la presentazione di casi studio, i partecipanti lavoreranno direttamente ai propri progetti utilizzando principalmente **FloraFauna AI**, affiancati da momenti di confronto, revisione e mentoring.",
      "L'obiettivo è comprendere come l'AI possa diventare un alleato della creatività, ampliando le possibilità progettuali senza sostituire il pensiero del designer.",
    ],
    tutorBio: [
      "**Emanuele Morelli** è Creative Director, AI Media Designer e docente specializzato nell'applicazione dell'Intelligenza Artificiale ai processi creativi. Collabora con aziende, istituzioni e scuole di design, tenendo workshop e conferenze internazionali dedicati all'integrazione dell'AI nel mondo del progetto. La sua ricerca si concentra sul rapporto tra creatività umana, innovazione e tecnologie generative, promuovendo un approccio pratico e consapevole all'uso dell'AI nel design.",
    ],
    result:
      "Al termine del workshop ogni partecipante avrà sviluppato un progetto originale utilizzando l'Intelligenza Artificiale come supporto al processo creativo, acquisendo un metodo di lavoro immediatamente applicabile al proprio ambito professionale e una maggiore consapevolezza delle potenzialità offerte dalle nuove tecnologie generative. **Il lavoro in questione andrà impaginato e presentato.**",
    note: "Attestato di partecipazione valido per la convalida di CFU. È consigliato informarsi presso la propria segreteria studenti per verificare l'accettazione.",
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
