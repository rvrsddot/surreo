# Surreo Studio — Gallery progetti

Gallery statica (HTML/CSS/JS puro, nessuna dipendenza) delle slide di progetto.
Fronte card = slideshow che va **in loop su desktop** e **scorre col dito/scroll su mobile**.
Pulsante **↻** = flip 3D che mostra le info sul retro.

## Struttura
```
index.html          pagina
styles.css          stile
app.js              logica (loop / scrub / flip)
projects.json       elenco progetti + frame (generato)
assets/projects/…   immagini ottimizzate (JPEG 1000px)
build_assets.py     rigenera assets/ + projects.json dai PNG in PROJECTS/
PROJECTS/           sorgenti originali (NON versionati, vedi .gitignore)
```

## Rigenerare gli asset
Metti i PNG originali in `PROJECTS/` (nome tipo `NOME PROGETTO 01.png`) e lancia:
```
python3 build_assets.py
```
Raggruppa per nome, ordina i frame, li ottimizza in JPEG 1000px e riscrive `projects.json`.

## Pubblicare su GitHub Pages
1. Crea un repo e carica questi file (senza la cartella `PROJECTS/`).
2. Su GitHub: **Settings → Pages → Source: branch `main` / root**.
3. Il sito sarà online su `https://<utente>.github.io/<repo>/`.

## Da fare
- Testi descrizione retro (ora placeholder "Descrizione in arrivo").
- Eventuali metadati per card: cliente, anno, categoria.
