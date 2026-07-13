#!/usr/bin/env python3
"""Raggruppa i frame, li ottimizza (JPEG 1000px via sips) e genera projects.json
diviso in SEZIONI nell'ordine deciso."""
import os, re, json, subprocess, unicodedata, shutil, sys

ROOT = os.path.dirname(__file__)
SRC = os.path.join(ROOT, "PROJECTS")
OUT_IMG = os.path.join(ROOT, "assets", "projects")
OUT_JSON = os.path.join(ROOT, "projects.json")

MIN_FRAMES = 4
MAX_SIZE = 1000
JPEG_QUALITY = 80
BLANK_BYTES = 25000   # JPEG piu' leggero di così = frame quasi-vuoto -> scartato

# ---- SEZIONI: (id, titolo, [token che identificano ogni progetto, in ordine]) ----
# token = pezzo di nome (match case-insensitive) univoco per il progetto.
# Se serve, override nome visualizzato via DISPLAY_OVERRIDE.
SECTIONS = [
    ("graphic", "Graphic, Branding & Social", [
        "MYBESTLAZIO", "CAFFÉ MELETTI", "CASTELMANIA", "PERSUASIO", "MERLETTO DI OFFIDA",
        "SUBURBIÆ", "SHINE SOAP", "B-HANDMADE", "GIZZI FISIOTERAPISTA", "GIZZI ILLUSTRATION",
        "PALANDRANI TECHNICAL", "SPD ING", "PANETTA BAKERY", "JAY27 ASD", "ZIOMÁ FRITTI",
        "DIEMME CAFFÉ - CONCORSO", "VILLA EBE", "ESCAPED", "DONNA MAYLA", "SAMISDAT",
        "L.PERELLI", "IMURI BAND", "CAFFE DESIGN", "APPICCIAFUOCO", "GIAN E GLI SPIRITI 2",
        "SWW SINCE 2018", "WORKSHOK",
    ]),
    ("industrial", "Industrial Design", [
        "SAPONI DI UN TEMPO", "PANCHINA XXX", "INTIME", "MIRRORX", "DUM MD DRONE",
        "ORIKATA", "CONCEPT INDUSTRIAL DESIGN", "ETNIÆ & PSICHEDELICÆ",
    ]),
    ("exhibit", "Exhibit & Mapping", [
        "ABOUT ROCK EXHIBIT", "A PERSPECTIVE", "UNNECESSARY EXHIBIT", "BUTTERFLY EFFECT EXHIBIT",
    ]),
    ("virtual", "Virtual & VR Experience", [
        "VR-MELIÉS", "PARALLELS ARCHIVES",
    ]),
]

DISPLAY_OVERRIDE = {
    "GIAN E GLI SPIRITI 2": "GIAN E GLI SPIRITI",
    "L.PERELLI": "LUCREZIA PERELLI",
}

def slugify(name):
    n = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    n = re.sub(r"[^a-z0-9]+", "-", n).strip("-")
    return n or "project"

def display_name(raw):
    n = re.sub(r"^1a progetti[_\- ]*", "", raw, flags=re.I)
    n = re.sub(r"^3a[_\- ]*", "", n, flags=re.I)
    n = re.sub(r"^b[_\- ]+", "", n, flags=re.I)
    n = n.strip()
    return DISPLAY_OVERRIDE.get(n.upper(), n).upper()

# 1. raggruppa
pat = re.compile(r"^(.*?)[ _-]*(\d+)\.png$", re.I)
groups = {}
for f in os.listdir(SRC):
    if not f.lower().endswith(".png"):
        continue
    m = pat.match(f)
    if not m:
        continue
    groups.setdefault(m.group(1).strip(), []).append((int(m.group(2)), f))

usable = {k: sorted(v) for k, v in groups.items() if len(v) >= MIN_FRAMES}

def fold(s):
    # rimuove accenti e uniforma, per un match robusto
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().upper()

def find_base(token):
    t = fold(token)
    hits = [k for k in usable if t in fold(k)]
    if len(hits) == 1:
        return hits[0]
    if len(hits) > 1:  # preferisci match esatto sul suffisso
        exact = [k for k in hits if fold(k).endswith(t)]
        if len(exact) == 1:
            return exact[0]
    return None

# 2. wipe + rigenera
if os.path.isdir(OUT_IMG):
    shutil.rmtree(OUT_IMG)
os.makedirs(OUT_IMG, exist_ok=True)

out_sections = []
used = set()
blanks = []
for sid, title, tokens in SECTIONS:
    projects = []
    for tok in tokens:
        base = find_base(tok)
        if not base:
            print(f"  !! NON TROVATO: '{tok}'"); continue
        used.add(base)
        frames = usable[base]
        disp = display_name(base)
        slug = slugify(disp)
        dest = os.path.join(OUT_IMG, slug)
        os.makedirs(dest, exist_ok=True)
        out_frames = []
        kept = 0
        for (num, fname) in frames:
            tmp = os.path.join(dest, "_tmp.jpg")
            subprocess.run([
                "sips", "-s", "format", "jpeg", "-s", "formatOptions", str(JPEG_QUALITY),
                "-Z", str(MAX_SIZE), os.path.join(SRC, fname), "--out", tmp
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            # frame quasi-vuoto (bianco/nero/uniforme) -> JPEG minuscolo: scarta
            if os.path.getsize(tmp) < BLANK_BYTES:
                os.remove(tmp); blanks.append(f"{slug}/{fname}"); continue
            kept += 1
            outname = f"{kept:02d}.jpg"
            os.rename(tmp, os.path.join(dest, outname))
            out_frames.append(f"assets/projects/{slug}/{outname}")
        projects.append({"id": slug, "name": disp, "frames": out_frames})
        print(f"  [{sid:10s}] {disp:26s} {len(out_frames)} frame")
    out_sections.append({"id": sid, "title": title, "projects": projects})

# progetti utilizzabili non assegnati a nessuna sezione
orphan = [k for k in usable if k not in used]
if orphan:
    print("\n  ATTENZIONE, progetti non assegnati a nessuna sezione:")
    for k in sorted(orphan):
        print("   -", k)

with open(OUT_JSON, "w") as fh:
    json.dump({"sections": out_sections}, fh, ensure_ascii=False, indent=2)

if blanks:
    print(f"\n  Frame vuoti scartati ({len(blanks)}):")
    for b in blanks:
        print("   -", b)

tot = sum(len(s["projects"]) for s in out_sections)
print(f"\nFatto: {tot} progetti in {len(out_sections)} sezioni -> {OUT_JSON}")
