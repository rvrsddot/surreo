#!/usr/bin/env python3
"""Genera le versioni ridotte dei frame dei progetti.

assets/projects/<id>/NN.jpg  ->  assets/projects/<id>/t/NN.jpg   lato corto 256px (miniature)
                             ->  assets/projects/<id>/m/NN.jpg   lato corto 560px (mobile: copertine e feed)
JPEG q76.
Idempotente: rigenera solo se il frame sorgente è più recente della miniatura.
Viene lanciato anche in coda a build_assets.py."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(ROOT, "assets", "projects")
SIZES = {"t": 256, "m": 560}
QUALITY = 76


def make_thumbs():
    made = skipped = 0
    before = after = 0
    for pid in sorted(os.listdir(IMG_DIR)):
        pdir = os.path.join(IMG_DIR, pid)
        if not os.path.isdir(pdir):
            continue
        for sub, side in SIZES.items():
            tdir = os.path.join(pdir, sub)
            os.makedirs(tdir, exist_ok=True)
            for f in sorted(os.listdir(pdir)):
                if not f.lower().endswith(".jpg"):
                    continue
                src, dst = os.path.join(pdir, f), os.path.join(tdir, f)
                if sub == "t":
                    before += os.path.getsize(src)
                if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                    skipped += 1
                    after += os.path.getsize(dst)
                    continue
                with Image.open(src) as im:
                    im = im.convert("RGB")
                    w, h = im.size
                    k = side / min(w, h)
                    if k < 1:
                        im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
                    im.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
                made += 1
                after += os.path.getsize(dst)
    mb = lambda b: f"{b / 1048576:.1f} MB"
    print(f"Versioni ridotte: {made} create, {skipped} già aggiornate "
          f"({mb(before)} originali -> {mb(after)} tra t/ e m/)")


if __name__ == "__main__":
    make_thumbs()
