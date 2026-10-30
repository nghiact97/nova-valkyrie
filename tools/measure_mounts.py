"""Measure gear mount points on the anime hull sprites.

Usage: py tools/measure_mounts.py
Writes art/anime/ships/mounts.json and art/anime/ships/mod/mounts_check.png.
Coordinates are in the 1024x1024 hull image space (nose up).
Hand corrections live in OVERRIDES and are applied after measurement.
"""
import json
import os

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOD = os.path.join(ROOT, "art", "anime", "ships", "mod")
OUT_JSON = os.path.join(ROOT, "art", "anime", "ships", "mounts.json")
OUT_PNG = os.path.join(MOD, "mounts_check.png")
HULLS = ["kestrel", "viper", "halo", "seraph", "raptor", "tempest", "nebula", "oblivion"]
ALPHA = 40
OVERRIDES = {  # hull -> {mount: [x, y]}  (manual fixes after visual check)
    # nebula: rear is three thin prongs; auto tail points collapse onto the centre spike
    "nebula": {"tailL": [452, 820], "tailR": [572, 820]},
}
COLORS = {"nose": (255, 60, 60), "wingL": (60, 200, 255), "wingR": (60, 120, 255),
          "spine": (255, 230, 40), "tailL": (80, 255, 120), "tailR": (20, 170, 60)}


def measure(path):
    a = np.array(Image.open(path).convert("RGBA"))[:, :, 3] > ALPHA
    ys, xs = np.nonzero(a)
    top, bot = ys.min(), ys.max()
    L = bot - top
    cx = (xs.min() + xs.max()) / 2.0

    def row_at(frac):
        return int(round(top + frac * L))

    def span(y0, y1):
        sub = a[y0:y1 + 1]
        yy, xx = np.nonzero(sub)
        return xx.min(), xx.max(), yy[xx.argmin()] + y0, yy[xx.argmax()] + y0

    lo, hi, ly, ry = span(row_at(0.35), row_at(0.75))
    inset = 0.05 * (hi - lo)
    rlo, rhi, _, _ = span(row_at(0.85), row_at(0.95))
    rw = rhi - rlo
    m = {
        "nose": [cx, row_at(0.08)],
        "wingL": [lo + inset, ly],
        "wingR": [hi - inset, ry],
        "spine": [cx, row_at(0.52)],
        "tailL": [cx - rw / 4, row_at(0.90)],
        "tailR": [cx + rw / 4, row_at(0.90)],
    }
    m = {k: [int(round(v[0])), int(round(v[1]))] for k, v in m.items()}
    # Snap any point that landed in a gap (between fins/prongs) toward the centreline
    # until it sits on solid hull, so gear never floats in empty space.
    for k, (x, y) in m.items():
        step = 1 if x < cx else -1
        while not a[y, x] and abs(x - cx) > 1:
            x += step
        m[k] = [int(x + step * 6) if abs(x - cx) > 8 else int(x), y]
    return m, int(hi - lo)


def main():
    res, spans = {}, {}
    for h in HULLS:
        res[h], spans[h] = measure(os.path.join(MOD, f"hull_{h}.png"))
        res[h].update(OVERRIDES.get(h, {}))
    for h in HULLS:
        res[h]["wingScale"] = round(min(1.0, max(0.6, spans[h] / spans["kestrel"])), 3)
    with open(OUT_JSON, "w") as f:
        json.dump(res, f, indent=1)

    cell = 384
    sheet = Image.new("RGBA", (cell * 4, cell * 2), (40, 40, 52, 255))
    d = ImageDraw.Draw(sheet)
    s = cell / 1024
    for i, h in enumerate(HULLS):
        ox, oy = (i % 4) * cell, (i // 4) * cell
        im = Image.open(os.path.join(MOD, f"hull_{h}.png")).convert("RGBA").resize((cell, cell))
        sheet.alpha_composite(im, (ox, oy))
        for k, c in COLORS.items():
            x, y = ox + res[h][k][0] * s, oy + res[h][k][1] * s
            d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=c, outline=(0, 0, 0))
        d.text((ox + 6, oy + 6), f"{h} ws={res[h]['wingScale']}", fill=(255, 255, 255))
    sheet.convert("RGB").save(OUT_PNG)
    print(json.dumps(res))


if __name__ == "__main__":
    main()
