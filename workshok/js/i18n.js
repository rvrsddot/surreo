/* =========================================================================
   WORKSHOK — lingue IT / EN / NL (fiammingo)
   - lingua da ?lang=xx, poi da localStorage, default IT
   - traduce: testi dell'HTML (nodi di testo + placeholder/aria-label/alt),
     i dati di data/courses.js e data/gallery.js, le stringhe dei JS via T()
   - va caricato DOPO i file data/ e PRIMA di main.js / archive.js / gallery.js
   - dizionario: [italiano, inglese, fiammingo]. La chiave è il testo italiano
     così com'è nell'HTML/dati (spazi e a-capo non contano).
   ========================================================================= */
(function () {
  "use strict";
  var LANGS = ["it", "en", "nl"];
  var q = null, saved = null;
  try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  try { saved = localStorage.getItem("wsk-lang"); } catch (e) {}
  var L = LANGS.indexOf(q) > -1 ? q : (LANGS.indexOf(saved) > -1 ? saved : "it");
  window.LANG = L;

  var D = [
    /* ---- pagina / topbar ---- */
    ["Workshok #26 · Workshop AI, Design, Grafica e Architettura · Ascoli Piceno · SAAD Workshop Week 2026",
     "Workshok #26 · AI, Design, Graphic Design and Architecture Workshops · Ascoli Piceno · SAAD Workshop Week 2026",
     "Workshok #26 · Workshops AI, design, grafisch ontwerp en architectuur · Ascoli Piceno · SAAD Workshop Week 2026"],
    ["Salta ai corsi", "Skip to courses", "Ga naar de cursussen"],
    ["Sezioni", "Sections", "Secties"],
    ["Lingua", "Language", "Taal"],
    ["CORSI", "COURSES", "CURSUSSEN"],
    ["METODO", "METHOD", "METHODE"],

    /* ---- hero ---- */
    ["Workshok — Workshop AI, Design, Grafica e Architettura ad Ascoli Piceno · SAAD Workshop Week 2026",
     "Workshok — AI, Design, Graphic Design and Architecture Workshops in Ascoli Piceno · SAAD Workshop Week 2026",
     "Workshok — Workshops AI, design, grafisch ontwerp en architectuur in Ascoli Piceno · SAAD Workshop Week 2026"],
    ["// EDIZIONE", "// EDITION", "// EDITIE"],
    ["// QUANDO", "// WHEN", "// WANNEER"],
    ["// DOVE", "// WHERE", "// WAAR"],
    ["// FORMATO", "// FORMAT", "// FORMAAT"],
    ["Scorri ai corsi", "Scroll to the courses", "Scroll naar de cursussen"],
    ["GUARDA I CORSI · GUARDA I CORSI ·", "SEE THE COURSES · SEE THE COURSES ·", "BEKIJK CURSUSSEN · BEKIJK CURSUSSEN ·"],

    /* ---- 01 corsi ---- */
    ["CORSI.EXE", "COURSES.EXE", "CURSUSSEN.EXE"],
    ["I Corsi", "The Courses", "De Cursussen"],
    ["// 2 workshop · clicca la card per aprirla", "// 2 workshops · click a card to open it", "// 2 workshops · klik op een kaart om ze te openen"],
    ["// STATUS · 0 CORSI ATTIVI", "// STATUS · 0 ACTIVE COURSES", "// STATUS · 0 ACTIEVE CURSUSSEN"],
    ["Nessun corso attivo", "No active courses", "Geen actieve cursussen"],
    ["prossima edizione in arrivo · guarda il workshops archive ↓", "next edition coming soon · check out the workshops archive ↓", "volgende editie komt eraan · bekijk het workshops archive ↓"],
    ["// nessuna edizione aperta · archivio qui sotto", "// no edition open · archive below", "// geen editie open · archief hieronder"],

    /* ---- 02 archivio ---- */
    ["// 2018 → oggi · scorri → per scendere negli anni · clicca un corso per aprirlo",
     "// 2018 → today · scroll → to go back through the years · click a course to open it",
     "// 2018 → vandaag · scroll → om terug te gaan in de tijd · klik op een cursus om die te openen"],
    ["Timeline dei corsi realizzati", "Timeline of past courses", "Tijdlijn van de gegeven cursussen"],
    ["Più recenti", "More recent", "Recenter"],
    ["Più vecchi", "Older", "Ouder"],
    ["CORSI", "COURSES", "CURSUSSEN"],
    ["EDIZIONI", "EDITIONS", "EDITIES"],
    ["ANNI", "YEARS", "JAAR"],
    ["SEZ.", "SECT.", "DOORSN."],
    ["profondità", "depth", "diepte"],
    ["anno", "year", "jaar"],
    ["anni", "years", "jaar"],
    ["Apri", "Open", "Open"],
    ["Tema", "Theme", "Thema"],
    ["Docente", "Teacher", "Docent"],
    ["Strumento", "Tool", "Tool"],
    ["Date", "Dates", "Data"],
    ["Durata", "Duration", "Duur"],
    ["Posti", "Seats", "Plaatsen"],
    ["Luogo", "Place", "Plaats"],
    ["Dove", "Where", "Waar"],
    ["Aperto a", "Open to", "Open voor"],
    ["Workshop online", "Online workshops", "Online workshops"],

    /* ---- 03 gallery ---- */
    ["// rullino · dal vivo dai workshop", "// film roll · live from the workshops", "// filmrol · live vanop de workshops"],
    ["Anteprima foto dai workshop", "Photo preview from the workshops", "Fotovoorbeeld van de workshops"],
    ["Clicca un fotogramma per aprirlo", "Click a frame to open it", "Klik op een beeld om het te openen"],
    ["Apri la gallery →", "Open the gallery →", "Open de galerij →"],
    ["foto", "photo", "foto"],
    ["Tutte", "All", "Alle"],
    ["Workshok — SAAD Workshop Week, workshop di design e architettura ad Ascoli Piceno",
     "Workshok — SAAD Workshop Week, design and architecture workshops in Ascoli Piceno",
     "Workshok — SAAD Workshop Week, workshops design en architectuur in Ascoli Piceno"],
    ["SWW × Centauroos — workshop Concrete Moves, design con stampa 3D robotica, SAAD Workshop Week Ascoli Piceno",
     "SWW × Centauroos — Concrete Moves workshop, design with robotic 3D printing, SAAD Workshop Week Ascoli Piceno",
     "SWW × Centauroos — workshop Concrete Moves, ontwerpen met robotisch 3D-printen, SAAD Workshop Week Ascoli Piceno"],

    /* ---- 04 metodo ---- */
    ["METODO.SYS", "METHOD.SYS", "METHODE.SYS"],
    ["Il Metodo", "The Method", "De Methode"],
    ["// 2018 → 2026 · 8 anni di test sul campo", "// 2018 → 2026 · 8 years of field testing", "// 2018 → 2026 · 8 jaar testen in de praktijk"],
    ["Dal 2018 organizziamo workshop intensivi per designer, architetti e creativi. Durano pochi giorni e si lavora su un progetto vero, dall'inizio alla fine.",
     "Since 2018 we have been running intensive workshops for designers, architects and creatives. They last a few days and you work on a real project, from start to finish.",
     "Sinds 2018 organiseren we intensieve workshops voor ontwerpers, architecten en creatievelingen. Ze duren een paar dagen en je werkt aan een echt project, van begin tot einde."],
    ["Ogni corso è guidato da uno studio o da un professionista che quel lavoro lo fa tutti i giorni. I posti sono al massimo 25, così chi guida il corso segue ognuno da vicino, dal tema alla consegna. Dopo ogni edizione cambiamo qualcosa: il formato di oggi è il risultato di otto anni di prove.",
     "Each course is led by a studio or a professional who does that work every day. There are 25 places at most, so whoever leads the course can follow everyone closely, from the brief to the delivery. After every edition we change something: today's format is the result of eight years of trial and error.",
     "Elke cursus wordt begeleid door een studio of een professional die dat werk elke dag doet. Er zijn maximaal 25 plaatsen, zodat wie de cursus leidt iedereen van dichtbij kan volgen, van het thema tot de oplevering. Na elke editie veranderen we iets: het formaat van vandaag is het resultaat van acht jaar uitproberen."],
    ["FIG. M-01 · griglia di progetto", "FIG. M-01 · design grid", "FIG. M-01 · ontwerpraster"],
    ["8 anni · 2018 → 2026", "8 years · 2018 → 2026", "8 jaar · 2018 → 2026"],
    ["Revisioni", "Reviews", "Feedback"],
    ["Consegna", "Delivery", "Oplevering"],
    ["Il tema lo porta chi guida il corso, con i limiti di un lavoro vero. Si parte il primo giorno.",
     "The brief comes from whoever leads the course, with the constraints of a real job. Work starts on day one.",
     "Het thema komt van wie de cursus leidt, met de beperkingen van een echte opdracht. We starten op de eerste dag."],
    ["Si lavora tutto il giorno, per più giorni di fila. Massimo 25 persone, seguite una per una.",
     "You work all day, several days in a row. 25 people at most, each followed one by one.",
     "Je werkt de hele dag, meerdere dagen na elkaar. Maximaal 25 mensen, elk persoonlijk begeleid."],
    ["Ogni giorno si rivede il lavoro con chi guida il corso. Le idee che non reggono si scartano presto.",
     "Every day the work is reviewed with whoever leads the course. Ideas that don't hold up are dropped early.",
     "Elke dag wordt het werk besproken met wie de cursus leidt. Ideeën die niet werken, vallen snel af."],
    ["Alla fine il progetto viene presentato e discusso. È un lavoro che si può mettere in portfolio.",
     "At the end the project is presented and discussed. It's work you can put in your portfolio.",
     "Op het einde wordt het project voorgesteld en besproken. Het is werk dat je in je portfolio kan steken."],

    /* ---- 05 about ---- */
    ["Nei nostri workshop la teoria è poca e serve solo a partire. Il resto del tempo si progetta.",
     "In our workshops there's little theory, just enough to get started. The rest of the time is spent designing.",
     "In onze workshops is er weinig theorie, net genoeg om te starten. De rest van de tijd wordt er ontworpen."],
    ["Workshok! è nato nel 2018 come un esperimento: corsi brevi, pochi partecipanti, docenti che lavorano nel settore. Alcuni li facciamo online, altri dal vivo.",
     "Workshok! started in 2018 as an experiment: short courses, few participants, teachers who work in the field. Some we run online, others in person.",
     "Workshok! begon in 2018 als een experiment: korte cursussen, weinig deelnemers, docenten die in het vak werken. Sommige doen we online, andere live."],
    ["Lavoriamo con studenti, professionisti e realtà del territorio. Il formato dal vivo più conosciuto è la SAAD Workshop Week, alla SAAD di Ascoli Piceno.",
     "We work with students, professionals and local organisations. Our best-known in-person format is the SAAD Workshop Week, at SAAD in Ascoli Piceno.",
     "We werken met studenten, professionals en lokale organisaties. Ons bekendste live-formaat is de SAAD Workshop Week, aan de SAAD in Ascoli Piceno."],

    /* ---- 06 collab ---- */
    ["Abbiamo collaborato con", "We've worked with", "We werkten samen met"],
    ["// partner & sponsor", "// partners & sponsors", "// partners & sponsors"],
    ["[ vedi tutti → ]", "[ see all → ]", "[ bekijk alles → ]"],
    ["Apri lista completa partner", "Open the full partner list", "Open de volledige partnerlijst"],
    ["Riconoscimenti", "Recognition", "Erkenning"],
    ["Partner & Collaborazioni", "Partners & Collaborations", "Partners & Samenwerkingen"],
    ["nomi · dal 2018", "names · since 2018", "namen · sinds 2018"],
    ["Lista partner", "Partner list", "Partnerlijst"],
    ["Mostra — Il mestiere di grafico, oggi", "Exhibition — Il mestiere di grafico, oggi", "Tentoonstelling — Il mestiere di grafico, oggi"],

    /* ---- 07 contatti ---- */
    ["CONTATTI.FORM", "CONTACT.FORM", "CONTACT.FORM"],
    ["Info & Contatti", "Info & Contact", "Info & Contact"],
    ["// per iscriverti usa il Google Form nel popup corso", "// to sign up, use the Google Form in the course popup", "// om je in te schrijven gebruik je het Google Form in de cursuspop-up"],
    ["01 / NOME", "01 / NAME", "01 / NAAM"],
    ["chi sei", "who you are", "wie je bent"],
    ["tu@mail.it", "you@mail.com", "jij@mail.be"],
    ["03 / MESSAGGIO", "03 / MESSAGE", "03 / BERICHT"],
    ["scrivici la tua richiesta", "write us your request", "schrijf ons je vraag"],
    ["[ MANDA LA RICHIESTA → ]", "[ SEND REQUEST → ]", "[ VERSTUUR JE VRAAG → ]"],
    ["Il messaggio arriva direttamente a noi. Scrivici per sapere quando apre la prossima edizione.",
     "Your message comes straight to us. Write to us to find out when the next edition opens.",
     "Je bericht komt rechtstreeks bij ons terecht. Schrijf ons om te weten wanneer de volgende editie opent."],

    /* ---- popup corso / card (usati quando ci sono corsi attivi) ---- */
    ["CORSO.DETAIL", "COURSE.DETAIL", "CURSUS.DETAIL"],
    ["[ ISCRIVITI QUI → ]", "[ SIGN UP HERE → ]", "[ SCHRIJF JE HIER IN → ]"],
    ["Chiudi", "Close", "Sluiten"],
    ["Slot in arrivo", "Slot coming soon", "Plaats komt eraan"],
    ["Corso", "Course", "Cursus"],
    ["apri i dettagli", "open details", "open details"],
    ["apri scheda", "open sheet", "open fiche"],
    ["Dettagli →", "Details →", "Details →"],
    ["// Video del corso", "// Course videos", "// Video's van de cursus"],
    ["// Immagini del corso", "// Course images", "// Beelden van de cursus"],
    ["Anteprima video del workshop", "Workshop video preview", "Videovoorbeeld van de workshop"],
    ["// Info workshop", "// Workshop info", "// Info workshop"],
    ["Consigliato a:", "Recommended for:", "Aanbevolen voor:"],
    ["// Obiettivo workshop", "// Workshop goal", "// Doel van de workshop"],
    ["// Il docente", "// The teacher", "// De docent"],
    ["con", "with", "met"],
    ["Chiudi / apri la sezione", "Close / open the section", "Sluit / open de sectie"],

    /* ---- status bar ---- */
    ["NESSUN CORSO ATTIVO · ARCHIVIO APERTO", "NO ACTIVE COURSES · ARCHIVE OPEN", "GEEN ACTIEVE CURSUSSEN · ARCHIEF OPEN"],
    ["DESIGN + ARCHITETTURA @ VELOCITÀ DEL LAMPO", "DESIGN + ARCHITECTURE @ LIGHTNING SPEED", "DESIGN + ARCHITECTUUR @ BLIKSEMSNELHEID"],
    ["ISCRIZIONI APERTE — POSTI LIMITATI", "SIGN-UPS OPEN — LIMITED SEATS", "INSCHRIJVINGEN OPEN — BEPERKTE PLAATSEN"],
    ["PROSSIMA EDIZIONE IN ARRIVO", "NEXT EDITION COMING SOON", "VOLGENDE EDITIE KOMT ERAAN"],
    ["3–5 giorni", "3–5 days", "3–5 dagen"],
    ["3–5 GG", "3–5 DAYS", "3–5 DAGEN"],

    /* ---- dati corsi: temi ---- */
    ["Fare siti web e applicazioni con l'intelligenza artificiale (in modo avanzato ma che in realtà è semplicissimo)",
     "Making websites and apps with artificial intelligence (in an advanced way that's actually super simple)",
     "Websites en apps maken met artificiële intelligentie (op een geavanceerde manier die eigenlijk supereenvoudig is)"],
    ["Esplorare nuovi processi creativi attraverso l'Intelligenza Artificiale",
     "Exploring new creative processes through Artificial Intelligence",
     "Nieuwe creatieve processen verkennen met artificiële intelligentie"],
    ["Website no-code con Figma", "No-code websites with Figma", "No-code websites met Figma"],
    ["Motion design con After Effects", "Motion design with After Effects", "Motion design met After Effects"],
    ["Progetta metaversi con Unreal Engine", "Design metaverses with Unreal Engine", "Ontwerp metaversums met Unreal Engine"],
    ["Grafica generativa per principianti", "Generative graphics for beginners", "Generatieve grafiek voor beginners"],
    ["Progetta interfacce grafiche con Figma", "Design user interfaces with Figma", "Ontwerp grafische interfaces met Figma"],
    ["Alla scoperta del type design", "Discovering type design", "Op ontdekking in type design"],
    ["Creare con il 3D motion", "Creating with 3D motion", "Creëren met 3D motion"],
    ["Modellazione 3D per il fashion design", "3D modelling for fashion design", "3D-modellering voor modeontwerp"],
    ["Mapping interattivo con TouchDesigner", "Interactive mapping with TouchDesigner", "Interactieve mapping met TouchDesigner"],
    ["Videomapping con TouchDesigner", "Video mapping with TouchDesigner", "Videomapping met TouchDesigner"],
    ["Costruzione del senso attraverso la rappresentazione", "Building meaning through representation", "Betekenis opbouwen via representatie"],
    ["Storie illustrate", "Illustrated stories", "Geïllustreerde verhalen"],
    ["Modellazione e rendering con Cinema 4D", "Modelling and rendering with Cinema 4D", "Modelleren en renderen met Cinema 4D"],
    ["Analisi urbana con Grasshopper · contest", "Urban analysis with Grasshopper · contest", "Stedelijke analyse met Grasshopper · wedstrijd"],
    ["2 CFU per studenti SAAD", "2 ECTS credits for SAAD students", "2 studiepunten (ECTS) voor SAAD-studenten"],

    /* ---- dati corsi: descrizioni archivio ---- */
    ["Quattro giorni per costruire siti web e app con l'intelligenza artificiale, anche senza saper programmare. Si parte da un prototipo fatto in pochi minuti e si arriva a un progetto completo, con strumenti come Ollama. Il docente segue ogni partecipante da vicino.",
     "Four days to build websites and apps with artificial intelligence, even without knowing how to code. You start from a prototype made in a few minutes and end up with a complete project, using tools like Ollama. The teacher follows each participant closely.",
     "Vier dagen om websites en apps te bouwen met artificiële intelligentie, ook zonder te kunnen programmeren. Je start met een prototype dat in een paar minuten klaar is en komt uit bij een volledig project, met tools zoals Ollama. De docent volgt elke deelnemer van dichtbij."],
    ["L'intelligenza artificiale usata dentro il lavoro di branding. Dopo alcuni casi studio, ognuno ha sviluppato un progetto con FloraFauna AI (immagini, concept, direzione visiva), rivedendolo ogni giorno con la docente. Alla fine i progetti sono stati impaginati e presentati.",
     "Artificial intelligence used inside branding work. After a few case studies, everyone developed a project with FloraFauna AI (images, concepts, visual direction), reviewing it every day with the teacher. At the end the projects were laid out and presented.",
     "Artificiële intelligentie ingezet binnen brandingwerk. Na enkele casestudy's ontwikkelde iedereen een project met FloraFauna AI (beelden, concepten, visuele richting), dat elke dag met de docent werd besproken. Op het einde werden de projecten opgemaakt en voorgesteld."],
    ["Tre giorni per esplorare la fabbricazione digitale applicata al design urbano, con un focus sulla stampa 3D robotica di materiali fluido-densi.",
     "Three days exploring digital fabrication applied to urban design, with a focus on robotic 3D printing of dense fluid materials.",
     "Drie dagen om digitale fabricatie toegepast op stedelijk ontwerp te verkennen, met de focus op robotisch 3D-printen van dikvloeibare materialen."],
    ["Un'introduzione al design interattivo: si progetta in Figma e si costruisce un sito con Framer, senza scrivere codice.",
     "An introduction to interactive design: you design in Figma and build a website with Framer, without writing code.",
     "Een introductie tot interactief ontwerp: je ontwerpt in Figma en bouwt een website met Framer, zonder code te schrijven."],
    ["Le basi del motion design con After Effects: le prime competenze sul software per iniziare ad animare i propri progetti.",
     "The basics of motion design with After Effects: the first skills in the software to start animating your own projects.",
     "De basis van motion design met After Effects: de eerste vaardigheden in de software om je eigen projecten te beginnen animeren."],
    ["Creare un semplice spazio virtuale, immersivo e interattivo, con le funzionalità di Unreal Engine.",
     "Creating a simple virtual space, immersive and interactive, with the features of Unreal Engine.",
     "Een eenvoudige virtuele ruimte maken, immersief en interactief, met de functies van Unreal Engine."],
    ["Un primo passo nella programmazione applicata alla grafica: introduzione al creative coding e alla grafica generativa, anche partendo da zero.",
     "A first step into programming applied to graphic design: an introduction to creative coding and generative graphics, even starting from scratch.",
     "Een eerste stap in programmeren toegepast op grafisch ontwerp: een introductie tot creative coding en generatieve grafiek, ook als je van nul begint."],
    ["Progettare interfacce grafiche con Figma, dagli strumenti di base al flusso di lavoro.",
     "Designing user interfaces with Figma, from the basic tools to the workflow.",
     "Grafische interfaces ontwerpen met Figma, van de basistools tot de workflow."],
    ["La progettazione dei caratteri tipografici, dalla ricerca alla creazione di font unici: una visione d'insieme sul type design.",
     "Designing typefaces, from research to creating unique fonts: an overview of type design.",
     "Het ontwerpen van lettertypes, van onderzoek tot het maken van unieke fonts: een overzicht van type design."],
    ["Tecniche di animazione per rendere i progetti grafici strumenti di comunicazione ancora più efficaci per i brand.",
     "Animation techniques to turn graphic projects into even more effective communication tools for brands.",
     "Animatietechnieken om grafische projecten tot nog krachtigere communicatiemiddelen voor merken te maken."],
    ["Le potenzialità dell'illustrazione come strumento di visual identity per i brand.",
     "The potential of illustration as a visual identity tool for brands.",
     "De mogelijkheden van illustratie als instrument voor de visuele identiteit van merken."],
    ["Come si realizza una scena in CGI, dalla modellazione all'animazione di elementi, luci e materiali.",
     "How a CGI scene is made, from modelling to animating objects, lights and materials.",
     "Hoe je een CGI-scène maakt, van modelleren tot het animeren van objecten, licht en materialen."],
    ["Una nuova sessione del workshop sui caratteri variabili con Mario De Libero di Zetafonts.",
     "A new session of the variable fonts workshop with Mario De Libero of Zetafonts.",
     "Een nieuwe sessie van de workshop over variabele fonts met Mario De Libero van Zetafonts."],
    ["Gli strumenti fondamentali di Marvelous Designer, il software di modellazione 3D per la moda. In collaborazione con Mode ON.",
     "The essential tools of Marvelous Designer, the 3D modelling software for fashion. In collaboration with Mode ON.",
     "De basistools van Marvelous Designer, de 3D-modelleersoftware voor mode. In samenwerking met Mode ON."],
    ["Mapping interattivo con TouchDesigner insieme allo studio Ultravioletto. In collaborazione con Mode ON.",
     "Interactive mapping with TouchDesigner together with the Ultravioletto studio. In collaboration with Mode ON.",
     "Interactieve mapping met TouchDesigner samen met studio Ultravioletto. In samenwerking met Mode ON."],
    ["Videomapping su superfici tridimensionali con TouchDesigner.",
     "Video mapping on three-dimensional surfaces with TouchDesigner.",
     "Videomapping op driedimensionale oppervlakken met TouchDesigner."],
    ["Un workshop di interior design sulle variazioni dello spazio interno.",
     "An interior design workshop on variations of interior space.",
     "Een workshop interieurontwerp over variaties van de binnenruimte."],
    ["Generare un'identità visiva costruendo il senso attraverso la rappresentazione.",
     "Generating a visual identity by building meaning through representation.",
     "Een visuele identiteit genereren door betekenis op te bouwen via representatie."],
    ["Il disegno di un carattere tipografico e tutto ciò che serve per iniziare ad avvicinarsi al mondo del type design.",
     "Drawing a typeface, and everything you need to start getting into the world of type design.",
     "Het tekenen van een lettertype en alles wat je nodig hebt om de wereld van type design te leren kennen."],
    ["Un'introduzione teorica ai caratteri variabili e alle loro applicazioni, poi subito al font editor per disegnare il proprio primo variable font.",
     "A theoretical introduction to variable fonts and their applications, then straight to the font editor to draw your first variable font.",
     "Een theoretische introductie tot variabele fonts en hun toepassingen, daarna meteen naar de font-editor om je eerste variable font te tekenen."],
    ["La replica del workshop sul disegno di un carattere tipografico, per avvicinarsi al type design.",
     "A repeat of the workshop on drawing a typeface, to get into type design.",
     "Een herhaling van de workshop over het tekenen van een lettertype, om kennis te maken met type design."],
    ["Analizzare le frequenze di una traccia audio e trasformarle in contenuti visivi che reagiscono al suono in tempo reale, con TouchDesigner.",
     "Analysing the frequencies of an audio track and turning them into visuals that react to sound in real time, with TouchDesigner.",
     "De frequenties van een audiotrack analyseren en omzetten in beelden die in realtime op geluid reageren, met TouchDesigner."],
    ["La versione in inglese: si parte da immagini di riferimento e, dopo una fase teorica e di analisi, si disegna il proprio set di lettere con i font editor.",
     "The English version: you start from reference images and, after a theory and analysis phase, draw your own set of letters with font editors.",
     "De Engelstalige versie: je vertrekt van referentiebeelden en tekent, na een fase van theorie en analyse, je eigen letterset met font-editors."],
    ["Su un macro-tema, tre illustrazioni con tre vincoli diversi: una di formato, una di colore e una di tempo.",
     "On one broad theme, three illustrations with three different constraints: one of format, one of colour and one of time.",
     "Rond één groot thema, drie illustraties met drie verschillende beperkingen: een van formaat, een van kleur en een van tijd."],
    ["Le basi per sviluppare un visual music video con After Effects.",
     "The basics for developing a visual music video with After Effects.",
     "De basis om een visuele videoclip te maken met After Effects."],
    ["Dallo sketch alla moodboard fino all'artwork: le basi di Cinema 4D per chiudere il corso con un artwork a testa.",
     "From sketch to moodboard to artwork: the basics of Cinema 4D, ending the course with one artwork each.",
     "Van schets over moodboard tot artwork: de basis van Cinema 4D, met op het einde één artwork per persoon."],
    ["Costruire il proprio carattere variabile: un workshop di type design con Typebreak.",
     "Building your own variable font: a type design workshop with Typebreak.",
     "Je eigen variabele font bouwen: een workshop type design met Typebreak."],
    ["La seconda sessione del workshop per costruire il proprio variable font.",
     "The second session of the workshop for building your own variable font.",
     "De tweede sessie van de workshop om je eigen variable font te bouwen."],
    ["I fondamenti di Grasshopper per il design parametrico applicato all'architettura.",
     "The fundamentals of Grasshopper for parametric design applied to architecture.",
     "De basis van Grasshopper voor parametrisch ontwerp toegepast op architectuur."],
    ["Il livello avanzato di Grasshopper, dopo i fondamentali.",
     "The advanced level of Grasshopper, after the fundamentals.",
     "Het gevorderde niveau van Grasshopper, na de basis."],
    ["Le basi del motion design con After Effects e un concept per la realizzazione di un opener.",
     "The basics of motion design with After Effects and a concept for making an opener.",
     "De basis van motion design met After Effects en een concept voor het maken van een opener."],
    ["Due giornate prima nei panni del cliente, per scrivere il brief, e poi del progettista, per sviluppare la proposta di progetto.",
     "Two days: first in the client's shoes, to write the brief, then in the designer's, to develop the project proposal.",
     "Twee dagen: eerst in de schoenen van de klant, om de briefing te schrijven, daarna in die van de ontwerper, om het projectvoorstel uit te werken."],
    ["Ogni gruppo analizza un quartiere italiano di edilizia economica e popolare e propone strategie per mitigarne le criticità ambientali.",
     "Each group analyses an Italian social housing neighbourhood and proposes strategies to mitigate its environmental issues.",
     "Elke groep analyseert een Italiaanse sociale woonwijk en stelt strategieën voor om de milieuproblemen ervan te verzachten."],
    ["Le competenze di base per realizzare un sito web con gli strumenti dell'interaction design.",
     "The basic skills for making a website with the tools of interaction design.",
     "De basisvaardigheden om een website te maken met de tools van interaction design."],
    ["Le basi del rendering e dell'illuminazione in ambiente 3D, con le tecniche usate sul set fotografico.",
     "The basics of rendering and lighting in 3D, using the techniques of a photo set.",
     "De basis van renderen en belichten in 3D, met de technieken van een fotoset."],
    ["Progettare un'identità visiva plurima, dinamica e generativa.",
     "Designing a multiple, dynamic and generative visual identity.",
     "Een meervoudige, dynamische en generatieve visuele identiteit ontwerpen."],
    ["I concetti fondamentali per la preview digitale di un prodotto, con un focus su animazione e rendering in tempo reale in Blender.",
     "The key concepts for the digital preview of a product, with a focus on animation and real-time rendering in Blender.",
     "De basisconcepten voor de digitale preview van een product, met de focus op animatie en realtime rendering in Blender."],
    ["Reinterpretare un'opera alla luce di una nuova situazione culturale e di aspettative cambiate.",
     "Reinterpreting a work in light of a new cultural situation and changed expectations.",
     "Een werk herinterpreteren in het licht van een nieuwe culturele situatie en veranderde verwachtingen."],
    ["Ascoltare i luoghi attraverso i suoni della natura e farne composizioni musicali che raccontano nuove percezioni dello spazio.",
     "Listening to places through the sounds of nature and turning them into musical compositions that tell new perceptions of space.",
     "Plekken beluisteren via de geluiden van de natuur en er muziekcomposities van maken die nieuwe ruimtebelevingen vertellen."],
    ["Storie e racconti che prendono vita in realtà aumentata, per guardare oltre la scrittura e leggere nuovi percorsi espressivi multimediali.",
     "Stories and tales that come to life in augmented reality, to look beyond writing and read new multimedia ways of expression.",
     "Verhalen die tot leven komen in augmented reality, om verder te kijken dan het geschreven woord en nieuwe multimediale vormen van expressie te lezen."],
    ["La tavola da surf come progetto di fabbricazione, insieme a NoMade Boards.",
     "The surfboard as a fabrication project, together with NoMade Boards.",
     "De surfplank als fabricageproject, samen met NoMade Boards."],

    /* ---- SEO (meta) ---- */
    ["META_DESC",
     "Workshok — SAAD Workshop Week (Ascoli Piceno · UNICAM SAAD). Intensive design, graphic design and architecture workshops since 2018: short courses, max 25 participants, led by studios and professionals. Open to students and professionals.",
     "Workshok — SAAD Workshop Week (Ascoli Piceno · UNICAM SAAD). Intensieve workshops design, grafisch ontwerp en architectuur sinds 2018: korte cursussen, max. 25 deelnemers, begeleid door studio's en professionals. Open voor studenten en professionals."],
  ];

  var col = L === "en" ? 1 : 2, map = {};
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  if (L !== "it") D.forEach(function (r) { map[norm(r[0])] = r[col]; });
  function has(k) { return Object.prototype.hasOwnProperty.call(map, k); }
  function T(s) {
    if (L === "it" || s == null) return s;
    var k = norm(s);
    return has(k) ? map[k] : s;
  }
  window.T = T;

  /* ---- date / ore / posti (regole, non dizionario) ---- */
  var MON = {
    gennaio: ["January", "januari"], febbraio: ["February", "februari"], marzo: ["March", "maart"],
    aprile: ["April", "april"], maggio: ["May", "mei"], giugno: ["June", "juni"], luglio: ["July", "juli"],
    agosto: ["August", "augustus"], settembre: ["September", "september"], ottobre: ["October", "oktober"],
    novembre: ["November", "november"], dicembre: ["December", "december"],
    gen: ["Jan", "jan"], feb: ["Feb", "feb"], mar: ["Mar", "mrt"], apr: ["Apr", "apr"], mag: ["May", "mei"],
    giu: ["Jun", "jun"], lug: ["Jul", "jul"], ago: ["Aug", "aug"], set: ["Sep", "sep"], ott: ["Oct", "okt"],
    nov: ["Nov", "nov"], dic: ["Dec", "dec"],
  };
  var MON_RE = new RegExp("\\b(" + Object.keys(MON).sort(function (a, b) { return b.length - a.length; }).join("|") + ")\\b", "g");
  var UNITS = [[/(\d+) ore\b/g, "$1 hours", "$1 uur"], [/(\d+) giorni\b/g, "$1 days", "$1 dagen"],
               [/(\d+) posti\b/g, "$1 seats", "$1 plaatsen"], [/(\d+) utenti\b/g, "$1 participants", "$1 deelnemers"]];
  function rules(s, key) {
    if (key === "dates") s = s.replace(MON_RE, function (m) { return MON[m][col - 1]; }).replace(/ e /g, " & ");
    if (key === "tutor") s = s.replace(/ e /g, " & ");
    UNITS.forEach(function (u) { s = s.replace(u[0], u[col]); });
    return s;
  }

  /* ---- dati (courses.js, gallery.js) ---- */
  var SKIP = { src: 1, poster: 1, thumb: 1, number: 1, palette: 1, cardLoop: 1, folder: 1, prefix: 1, id: 1, kind: 1, status: 1 };
  function walk(o, key) {
    if (typeof o === "string") { var t = T(o); return t !== o ? t : rules(o, key); }
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) o[i] = walk(o[i], key); return o; }
    if (o && typeof o === "object") { for (var k in o) if (!SKIP[k]) o[k] = walk(o[k], k); }
    return o;
  }

  /* ---- HTML statico ---- */
  function dom(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || p.nodeName === "SCRIPT" || p.nodeName === "STYLE") continue;
      var v = n.nodeValue, k = norm(v);
      if (!k || !has(k)) continue;
      n.nodeValue = v.match(/^\s*/)[0] + map[k] + v.match(/\s*$/)[0];
    }
    ["placeholder", "aria-label", "alt", "title"].forEach(function (a) {
      root.querySelectorAll("[" + a + "]").forEach(function (el) {
        var k = norm(el.getAttribute(a)); if (has(k)) el.setAttribute(a, map[k]);
      });
    });
  }

  /* ---- SEO: lingua, titolo, meta ---- */
  function meta() {
    document.documentElement.lang = L === "nl" ? "nl-BE" : L;
    document.title = T(document.title);
    var d = map.META_DESC;
    ["meta[name=description]", "meta[property='og:description']", "meta[name='twitter:description']"].forEach(function (s) {
      var m = document.querySelector(s); if (m) m.setAttribute("content", d);
    });
    var loc = document.querySelector("meta[property='og:locale']");
    if (loc) loc.setAttribute("content", L === "nl" ? "nl_BE" : "en_GB");
    var can = document.querySelector("link[rel=canonical]");
    if (can) can.setAttribute("href", can.getAttribute("href").split("?")[0] + "?lang=" + L);
  }

  /* ---- interruttore IT · EN · NL ---- */
  function switcher() {
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === L;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-current", on ? "true" : "false");
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var to = b.getAttribute("data-lang");
        try { localStorage.setItem("wsk-lang", to); } catch (err) {}
        var u = new URL(location.href);
        if (to === "it") u.searchParams.delete("lang"); else u.searchParams.set("lang", to);
        location.href = u.toString();
      });
    });
  }

  if (L !== "it") {
    ["COURSES", "ARCHIVE", "EDITION", "SELECTED", "GALLERY"].forEach(function (g) { if (window[g]) walk(window[g]); });
    dom(document.body);
    meta();
  }
  switcher();
})();
