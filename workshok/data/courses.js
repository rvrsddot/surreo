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

/* Corsi SWW8 (2026): conclusi, ora in ARCHIVIO (in fondo al file). */
var SWW8_COURSES = [
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
    palette: { bg: "#EDE8CF", ink: "#0c00ff", accent: "#F5B4D0", label: "AI · FloraFauna" },
    /* Blur temporaneo sulle immagini della card — corso non ancora annunciato */
    cardBlur: false,
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

/* =========================================================================
   CORSI ATTIVI — le card della sezione 01 si generano da qui.
   Vuoto = la sezione mostra "Nessun corso attivo" con la griglia animata.
   Per la prossima edizione: rimettere qui i corsi (stessa struttura di SWW8_COURSES).
   ========================================================================= */
window.COURSES = [];

/* =========================================================================
   ARCHIVIO — timeline orizzontale (sezione 02). Un record = un anno/edizione,
   dal più recente al più vecchio. Per aggiungere corsi passati basta un nuovo
   record (o un corso in "courses"): timeline e strati si rigenerano.
   Campi usati: title, tutor, tutorRole, tool, dates, hours, location,
   summary (descrizione breve), thumb (foto miniatura), media (foto/video).
   ========================================================================= */
/* corso dell'archivio storico: foto principale = <codice>.jpg, "more" = foto in più (anche il manifesto dell'edizione) */
function past(code, title, tutor, o) {
  var dir = "assets/corsi/storico/", id = code.toLowerCase();
  var c = { number: code, title: title, tutor: tutor, thumb: o.thumb === null ? "" : dir + id + ".jpg" };
  for (var k in o) if (k !== "more" && k !== "thumb") c[k] = o[k];
  var imgs = (o.thumb === null ? [] : [id]).concat(o.more || []);
  if (imgs.length > 1) c.media = { kind: "image", items: imgs.map(function (n) { return { src: dir + n + ".jpg" }; }) };
  return c;
}

window.ARCHIVE = [
  {
    year: 2026,
    edition: "SWW8",
    title: "SAAD Workshop Week",
    place: "Ascoli Piceno · UNICAM SAAD",
    dates: "8–11 settembre 2026",
    courses: SWW8_COURSES.map(function (c) {
      var extra = {
        "01": {
          number: "12A",
          thumb: "assets/corsi/storico/12a.jpg",
          summary: "Quattro giorni per imparare a costruire siti web e applicazioni con l'intelligenza artificiale, anche partendo da zero con la programmazione. Tanta pratica e poca teoria: dal prototipo in cinque minuti al progetto completo, con strumenti come Ollama e un metodo per lavorare senza limiti tecnici. Ogni partecipante seguito uno a uno.",
        },
        "02": {
          number: "12B",
          thumb: "assets/corsi/storico/12b.jpg",
          summary: "Un workshop intensivo sull'intelligenza artificiale come alleata del processo creativo. Dopo casi studio e una breve introduzione, ogni partecipante ha lavorato a un progetto originale con FloraFauna AI (immagini, concept, direzione visiva) tra revisioni e mentoring, fino a impaginarlo e presentarlo.",
        },
      }[c.number] || {};
      var o = {}; for (var k in c) o[k] = c[k];
      for (var j in extra) o[j] = extra[j];
      return o;
    }),
  },
  /* ---- edizioni passate (fonte: CORSI/Storico_INFO.docx). Le "presenza" sono le SAAD Workshop Week (SWW1–7),
     le altre i cicli online. past() costruisce il corso: foto in assets/corsi/storico/<codice>.jpg ---- */
  {
    year: 2025, edition: "SWW7", title: "SAAD Workshop Week", place: "Ascoli Piceno · UNICAM SAAD", dates: "10–12 settembre 2025",
    courses: [
      past("11A", "Concrete Moves", "Centauroos", { theme: "Designing with robotic 3D printing", dates: "10–12 set 2025", hours: "24 ore", seats: "30 posti",
        summary: "Tre giorni per esplorare la fabbricazione digitale applicata al design urbano, con un focus sulla stampa 3D robotica di materiali fluido-densi." }),
    ],
  },
  {
    year: 2024, edition: "SWW6", title: "SAAD Workshop Week", place: "Ascoli Piceno · UNICAM SAAD", dates: "10–13 settembre 2024",
    courses: [
      past("10A", "Website Superfast!", "Mattia Marinangeli", { theme: "Website no-code con Figma", tool: "Figma · Framer", dates: "10–13 set 2024", seats: "20 posti",
        summary: "Un'introduzione al design interattivo: si progetta in Figma e si costruisce un sito con Framer, senza scrivere codice." }),
      past("10B", "Motion Starz 2k24", "Ocular Lab", { theme: "Motion design con After Effects", tool: "After Effects", dates: "10–13 set 2024", seats: "20 posti",
        summary: "Le basi del motion design con After Effects: le prime competenze sul software per iniziare ad animare i propri progetti." }),
    ],
  },
  {
    year: 2023, edition: "SWW5", title: "SAAD Workshop Week", place: "Ascoli Piceno · UNICAM SAAD", dates: "6–8 settembre 2023",
    courses: [
      past("9A", "Metaverse Realities", "Diorama Studio", { theme: "Progetta metaversi con Unreal Engine", tool: "Unreal Engine", dates: "6–8 set 2023", seats: "20 posti",
        summary: "Creare un semplice spazio virtuale, immersivo e interattivo, con le funzionalità di Unreal Engine." }),
      past("9B", "Fritto Misto Generativo", "Giovanni Abbatepaolo e Alessandro Caccuri", { theme: "Grafica generativa per principianti", dates: "6–8 set 2023", seats: "20 posti",
        summary: "Un primo passo nella programmazione applicata alla grafica: introduzione al creative coding e alla grafica generativa, anche partendo da zero." }),
      past("9C", "Figma Power", "Mattia Marinangeli", { theme: "Progetta interfacce grafiche con Figma", tool: "Figma", dates: "6–8 set 2023", seats: "20 posti",
        summary: "Progettare interfacce grafiche con Figma, dagli strumenti di base al flusso di lavoro." }),
    ],
  },
  {
    year: 2023, edition: "ONLINE 8", title: "Workshop online", place: "Online", dates: "marzo–maggio 2023",
    courses: [
      past("8B", "Variable Fonts", "Mario De Libero (Zetafonts)", { theme: "Alla scoperta del type design", dates: "9–10 mar 2023", hours: "8 ore", seats: "20 posti",
        summary: "La progettazione dei caratteri tipografici, dalla ricerca alla creazione di font unici: una visione d'insieme sul type design." }),
      past("8C", "Motion Design", "Ocular Lab", { theme: "2D motion design", dates: "12–14 apr 2023", hours: "12 ore", seats: "20 posti", more: ["8c-2"],
        summary: "Tecniche di animazione per rendere i progetti grafici strumenti di comunicazione ancora più efficaci per i brand." }),
      past("8D", "Illustration System", "Giulia Zoavo", { dates: "26–28 apr 2023", hours: "11 ore", seats: "20 posti",
        summary: "Le potenzialità dell'illustrazione come strumento di visual identity per i brand." }),
      past("8A", "3D Motion con Ditroit", "Marco Sarracca e Alessandro Nobile (Ditroit Studio)", { theme: "Creare con il 3D motion", dates: "13, 15, 17 mag 2023", hours: "12 ore", seats: "20 posti",
        summary: "Come si realizza una scena in CGI, dalla modellazione all'animazione di elementi, luci e materiali." }),
      past("8E", "Variable Fonts", "Mario De Libero (Zetafonts)", { theme: "Type design", dates: "20–21 mag 2023", hours: "8 ore", seats: "20 posti",
        summary: "Una nuova sessione del workshop sui caratteri variabili con Mario De Libero di Zetafonts." }),
    ],
  },
  {
    year: 2023, edition: "SWW4", title: "SAAD Workshop Week", place: "Politeama di Tolentino (MC)", dates: "11–13 maggio 2023",
    courses: [
      past("7A", "Digital Fashion 3D", "TheBlackLabStudio (Amin Farah)", { theme: "Modellazione 3D per il fashion design", tool: "Marvelous Designer", dates: "11–13 mag 2023", seats: "20 posti",
        summary: "Gli strumenti fondamentali di Marvelous Designer, il software di modellazione 3D per la moda. In collaborazione con Mode ON." }),
      past("7B", "Interactive Mapping", "Ultravioletto", { theme: "Mapping interattivo con TouchDesigner", tool: "TouchDesigner", dates: "11–13 mag 2023", seats: "20 posti",
        summary: "Mapping interattivo con TouchDesigner insieme allo studio Ultravioletto. In collaborazione con Mode ON." }),
    ],
  },
  {
    year: 2022, edition: "SWW3", title: "SAAD Workshop Week", place: "Ascoli Piceno · UNICAM SAAD", dates: "7–9 settembre 2022",
    courses: [
      past("6A", "Mapping Projection", "Studio Ultravioletto (Massimo Zomparelli e Laura Arcangeli)", { theme: "Videomapping con TouchDesigner", tool: "TouchDesigner", dates: "7–9 set 2022", seats: "20 posti",
        summary: "Videomapping su superfici tridimensionali con TouchDesigner." }),
      past("6B", "Spacescape", "Homu Architects (Lucia Zamponi e Filippo Nanni)", { theme: "Interior variations", dates: "7–9 set 2022", seats: "20 posti",
        summary: "Un workshop di interior design sulle variazioni dello spazio interno." }),
      past("6C", "It Make Sense", "Carlotta Latessa e Alessandro Tartaglia (FF3300)", { theme: "Costruzione del senso attraverso la rappresentazione", dates: "7–9 set 2022", seats: "20 posti",
        summary: "Generare un'identità visiva costruendo il senso attraverso la rappresentazione." }),
    ],
  },
  {
    year: 2022, edition: "ONLINE 5", title: "Workshop online", place: "Online", dates: "marzo–giugno 2022",
    courses: [
      past("5A", "Type Design", "Typebreak (Alberto Guerra e Giulia Zafferani)", { theme: "From image to shape to glyphs to word to text", dates: "5–6 mar 2022", hours: "14 ore", seats: "20 posti",
        summary: "Il disegno di un carattere tipografico e tutto ciò che serve per iniziare ad avvicinarsi al mondo del type design." }),
      past("5B", "Variable Font", "Typebreak (Alberto Guerra e Giulia Zafferani)", { theme: "Your first variable font", dates: "12 mar 2022", hours: "7 ore", seats: "20 posti",
        summary: "Un'introduzione teorica ai caratteri variabili e alle loro applicazioni, poi subito al font editor per disegnare il proprio primo variable font." }),
      past("5D", "Type Design, bis", "Typebreak (Alberto Guerra e Giulia Zafferani)", { theme: "From image to shape to glyphs to word to text", dates: "19–20 mar 2022", hours: "14 ore", seats: "20 posti",
        summary: "La replica del workshop sul disegno di un carattere tipografico, per avvicinarsi al type design." }),
      past("5F", "Responsive Design con TouchDesigner", "Ultravioletto", { theme: "Audiovisual system", tool: "TouchDesigner", dates: "22–24 apr 2022", hours: "12 ore", seats: "20 posti",
        summary: "Analizzare le frequenze di una traccia audio e trasformarle in contenuti visivi che reagiscono al suono in tempo reale, con TouchDesigner." }),
      past("5E", "Type Design Basics", "Typebreak (Alberto Guerra e Giulia Zafferani)", { theme: "English version", dates: "30 apr 2022", hours: "8 ore", seats: "20 posti",
        summary: "La versione in inglese: si parte da immagini di riferimento e, dopo una fase teorica e di analisi, si disegna il proprio set di lettere con i font editor." }),
      past("5C", "Illustrazione Editoriale", "Alice Piaggio", { theme: "Storie illustrate", dates: "7–8 mag 2022", hours: "12 ore", seats: "20 posti",
        summary: "Su un macro-tema, tre illustrazioni con tre vincoli diversi: una di formato, una di colore e una di tempo." }),
      past("5G", "Motion Soundz", "Ocular Lab", { theme: "After Effects · entry level", tool: "After Effects", dates: "9–13 mag 2022", hours: "20 ore", seats: "20 posti",
        summary: "Le basi per sviluppare un visual music video con After Effects." }),
      past("5H", "Artwork 3D", "Raffaele Micillo", { theme: "Modellazione e rendering con Cinema 4D", tool: "Cinema 4D", dates: "4–5 giu 2022", hours: "14 ore", seats: "15 posti",
        summary: "Dallo sketch alla moodboard fino all'artwork: le basi di Cinema 4D per chiudere il corso con un artwork a testa." }),
    ],
  },
  {
    year: 2021, edition: "ONLINE 4", title: "Workshop online", place: "Online", dates: "marzo–dicembre 2021",
    courses: [
      past("4A", "Type Design", "Typebreak (Alberto Guerra e Giulia Zafferani)", { theme: "Build your own variable font", dates: "19–21 mar 2021", hours: "16 ore", seats: "20 posti",
        summary: "Costruire il proprio carattere variabile: un workshop di type design con Typebreak." }),
      past("4B", "Type Design #2", "Typebreak (Alberto Guerra e Giulia Zafferani)", { theme: "Build your own variable font", dates: "26–28 mar 2021", hours: "16 ore", seats: "20 posti",
        summary: "La seconda sessione del workshop per costruire il proprio variable font." }),
      past("4C", "Parametric Design & Architecture", "Pio Lorenzo Cocco", { theme: "Grasshopper Fundamentals", tool: "Grasshopper", dates: "14–18 apr 2021", hours: "30 ore",
        summary: "I fondamenti di Grasshopper per il design parametrico applicato all'architettura." }),
      past("4D", "Parametric Design & Architecture", "Pio Lorenzo Cocco", { theme: "Grasshopper Advanced", tool: "Grasshopper", dates: "5–9 mag 2021", hours: "30 ore",
        summary: "Il livello avanzato di Grasshopper, dopo i fondamentali." }),
      past("4E", "Animation 2D", "Ocular Lab", { theme: "Motion Starz", tool: "After Effects", dates: "31 mag – 3 giu 2021", hours: "18 ore",
        summary: "Le basi del motion design con After Effects e un concept per la realizzazione di un opener." }),
      past("4F", "Tutta Colpa del Cliente", "Caffè Design", { theme: "Minimum Viable Product", dates: "12 e 19 giu 2021", hours: "16 ore",
        summary: "Due giornate prima nei panni del cliente, per scrivere il brief, e poi del progettista, per sviluppare la proposta di progetto." }),
      past("4G", "City Data", "Pio Lorenzo Cocco", { theme: "Analisi urbana con Grasshopper · contest", tool: "Grasshopper", dates: "16 e 19 dic 2021", thumb: null,
        summary: "Ogni gruppo analizza un quartiere italiano di edilizia economica e popolare e propone strategie per mitigarne le criticità ambientali." }),
    ],
  },
  {
    year: 2020, edition: "ONLINE 3", title: "Workshop online", place: "Online", dates: "14–17 dicembre 2020",
    courses: [
      past("3A", "Web Design", "Nicolò Miranda", { dates: "14–17 dic 2020", hours: "8 ore",
        summary: "Le competenze di base per realizzare un sito web con gli strumenti dell'interaction design." }),
      past("3B", "Visual x Architecture", "Atelier Crilo (Lorena Greco e Cristian Farinella)", { dates: "16–17 dic 2020", hours: "16 ore",
        summary: "Le basi del rendering e dell'illuminazione in ambiente 3D, con le tecniche usate sul set fotografico." }),
    ],
  },
  {
    year: 2019, edition: "SWW2", title: "SAAD Workshop Week", place: "Ascoli Piceno · UNICAM SAAD", dates: "23–27 settembre 2019",
    courses: [
      past("2A", "Grafica Generativa", "CH RO MO studio (Chris Rocchegiani, Roberto Montani) e Francesco Pezzuoli", { theme: "Then what?", dates: "23–27 set 2019", seats: "20 posti", more: ["ed02"],
        summary: "Progettare un'identità visiva plurima, dinamica e generativa." }),
      past("2B", "Animazione 3D", "Emiliano Colantoni", { tool: "Blender", dates: "23–27 set 2019", seats: "20 posti", more: ["ed02"],
        summary: "I concetti fondamentali per la preview digitale di un prodotto, con un focus su animazione e rendering in tempo reale in Blender." }),
      past("2C", "Architettura", "Homu Architects (Lucia Zamponi e Filippo Nanni)", { theme: "Revisióne s.f. [revisio -onis, rivedere]", dates: "23–27 set 2019", seats: "20 posti", more: ["ed02"],
        summary: "Reinterpretare un'opera alla luce di una nuova situazione culturale e di aspettative cambiate." }),
    ],
  },
  {
    year: 2018, edition: "SWW1", title: "SAAD Workshop Week", place: "Ascoli Piceno · UNICAM SAAD", dates: "2018",
    courses: [
      past("1A", "Soundscape Design", "Alessio Ballerini", { more: ["ed01"],
        summary: "Ascoltare i luoghi attraverso i suoni della natura e farne composizioni musicali che raccontano nuove percezioni dello spazio." }),
      past("1B", "Hi-book AR Editing", "Martin Romeo", { more: ["ed01"],
        summary: "Storie e racconti che prendono vita in realtà aumentata, per guardare oltre la scrittura e leggere nuovi percorsi espressivi multimediali." }),
      past("1C", "Surfboard Fabbing", "NoMade Boards", { more: ["ed01"],
        summary: "La tavola da surf come progetto di fabbricazione, insieme a NoMade Boards." }),
    ],
  },
];
