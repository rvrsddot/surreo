/* =========================================================================
   WORKSHOK — DATI EDIZIONE
   Aggiornare QUESTO file ogni anno. Le card dei 3 corsi si rigenerano da qui.
   Sempre 3 slot: se un corso non c'è ancora, usare status "coming-soon".
   Struttura pensata anche per l'archivio (Fase 2): un record = un'edizione.
   ========================================================================= */

window.EDITION = {
  year: 2026,
  edition: "N.08",                      // SWW8 (dal poster ufficiale)
  title: "SAAD Workshop Week",
  city: "Ascoli Piceno",
  dates: "XXX — stiamo arrivando :)",   // placeholder: mettere la data vera
  days: "3–6 giorni",
  tagline: "Tre workshop. Una settimana. Rompi la griglia.",
};

/* Sempre 3 elementi. Uno slot vuoto = { status: "coming-soon" }. */
window.COURSES = [
  {
    status: "open",
    number: "01",
    title: "Metodi Sporchi",
    theme: "Grafica editoriale + risografia",
    tutor: "TBA",
    days: "3 giorni · 12–14 Mag",
    blurb:
      "Dallo scarabocchio alla stampa: layout brutalisti, mezzetinte e inchiostri che sbavano.",
  },
  {
    status: "open",
    number: "02",
    title: "Cemento Vivo",
    theme: "Architettura + fabbricazione digitale",
    tutor: "TBA",
    days: "5 giorni · 12–16 Mag",
    blurb:
      "Modellazione, prototipi 1:1 e materia grezza. Progettare come si costruisce uno skatepark.",
  },
  {
    status: "coming-soon",
    number: "03",
    title: "Coming Soon",
    theme: "Il terzo corso si sblocca a breve",
    tutor: "",
    days: "",
    blurb: "Lo slot resta. Il contenuto arriva. Torna presto o iscriviti alla lista.",
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
  version: "v2.6",
  credit: "WORKSHOK",                  // <-- credit sito (metti il nome vero)
  coords: "42.8536°N 13.5749°E",       // Ascoli Piceno
};

/* Credenziale/selezione da mettere in evidenza */
window.SELECTED = {
  label: "SELECTED",
  org: "AIAP × Triennale di Milano",
  title: "Mostra — Il mestiere di grafico, oggi",
  dates: "26 nov 2021 – 23 gen 2022",
};
