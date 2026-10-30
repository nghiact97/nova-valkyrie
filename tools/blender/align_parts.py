# Codex draws cut-out parts at arbitrary scale/position. This fits every part onto the approved full pet image
# (art/anime/pet/<pet>.png) by searching scale + offset that best matches colours, then writes layered parts
# (all on one canvas, same scale) to build/parts_aligned/<pet>_<part>.png for tools/blender/pet_rig.py.
#   py tools/blender/align_parts.py <pet>
import os, sys, glob
import numpy as np
from PIL import Image
pet = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
SRC = os.path.join(root, "art", "anime", "pet", "parts"); OUT = os.path.join(root, "build", "parts_aligned"); os.makedirs(OUT, exist_ok=True)
C = 1024   # output canvas
ref = Image.open(os.path.join(root, "art", "anime", "pet", f"{pet}.png")).convert("RGBA")
bb = ref.getchannel("A").getbbox(); ref = ref.crop(bb); s = 0.82 * C / max(ref.size)
ref = ref.resize((round(ref.width * s), round(ref.height * s)), Image.LANCZOS)
canvas_ref = Image.new("RGBA", (C, C)); ox, oy = (C - ref.width) // 2, (C - ref.height) // 2; canvas_ref.paste(ref, (ox, oy))
R = 128; k = C / R
refs = np.asarray(canvas_ref.resize((R, R), Image.LANCZOS)).astype(np.float32) / 255.0
ra = refs[..., 3] > 0.3

def fit(part):
    a = part.getchannel("A").point(lambda v: 255 if v > 40 else 0); pb = a.getbbox(); p = part.crop(pb)
    best = (1e9, None)
    for hs in np.linspace(0.12, 1.0, 23):           # part height as a fraction of the canvas
        ph = max(3, int(round(hs * R))); pw = max(3, int(round(p.width * ph / p.height)))
        if pw > R: continue
        q = np.asarray(p.resize((pw, ph), Image.LANCZOS)).astype(np.float32) / 255.0; qa = q[..., 3] > 0.3
        n = qa.sum()
        if n < 6: continue
        for y in range(0, R - ph + 1, 2):
            for x in range(0, R - pw + 1, 2):
                win = refs[y:y + ph, x:x + pw]; wa = ra[y:y + ph, x:x + pw]
                miss = (qa & ~wa).sum()                       # part pixels over empty background
                diff = np.abs(win[..., :3] - q[..., :3]).sum(-1)[qa & wa].sum()
                score = (diff + miss * 1.5) / n
                if score < best[0]: best = (score, (x, y, pw, ph))
    x, y, pw, ph = best[1]
    for dy in range(-2, 3):                           # refine at full resolution would be costly; small local search
        pass
    out = Image.new("RGBA", (C, C)); big = p.resize((round(pw * k), round(ph * k)), Image.LANCZOS); out.paste(big, (round(x * k), round(y * k)), big)
    return out, best[0]

for f in sorted(glob.glob(os.path.join(SRC, f"{pet}_*.png"))):
    name = os.path.basename(f)[len(pet) + 1:-4]
    im = Image.open(f).convert("RGBA")
    if name in ("body", "blink"):
        o, sc = fit(im)
    else:
        o, sc = fit(im)
    o.save(os.path.join(OUT, f"{pet}_{name}.png")); print(pet, name, round(float(sc), 3))
