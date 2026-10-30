# 2D cut-out puppet loop for a chibi pet, composed with Pillow (Blender's EEVEE mis-sorted the stacked alpha planes).
#   py tools/blender/pet_puppet2d.py <pet> [frames]
# Input: build/parts_aligned/<pet>_<part>.png (layered, same canvas; from align_parts.py) + build/rig_<pet>.json (pivots,
# from pet_rig.py). Output: art/anime/pet/puppet/<pet>_NN.png (384 px). Same motion as pet_rig_blender.py.
import json, math, os, sys
from PIL import Image
pet = sys.argv[1]; N = int(sys.argv[2]) if len(sys.argv) > 2 else 16
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
P = os.path.join(root, "build", "parts_aligned"); OUT = os.path.join(root, "art", "anime", "pet", "puppet"); os.makedirs(OUT, exist_ok=True)
rig = json.load(open(os.path.join(root, "build", f"rig_{pet}.json"))); W, H = rig["size"]
img = {p["name"]: Image.open(os.path.join(P, f"{pet}_{p['name']}.png")).convert("RGBA") for p in rig["parts"]}
body = Image.open(os.path.join(P, f"{pet}_body.png")).convert("RGBA"); blink = Image.open(os.path.join(P, f"{pet}_blink.png")).convert("RGBA")
AMP = {"wing": 26, "arm": 18, "fin": 20, "ear": 12, "tail": 14}
bb = rig["body_bbox"]; bcx, bcy = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
for f in range(N):
    t = f / N; ph = 2 * math.pi * t; beat = math.sin(ph * 2)
    bob = int(round(0.022 * H * math.sin(ph * 2 + 0.9))); sq = 1 + 0.03 * math.sin(ph * 2 + 0.9)
    back, front = Image.new("RGBA", (W, H)), Image.new("RGBA", (W, H))
    for p in rig["parts"]:
        im, k, sd = img[p["name"]], p["kind"], p["side"]; px, py = p["pivot"][0] * W, p["pivot"][1] * H
        if k == "mane":
            s = 1 + 0.05 * math.sin(ph * 2); w2, h2 = round(W * s), round(H * s)
            r = im.resize((w2, h2), Image.BICUBIC).rotate(4 * math.sin(ph), resample=Image.BICUBIC, center=(px * s, py * s))
            layer = Image.new("RGBA", (W, H)); layer.alpha_composite(r, (round(px - px * s), round(py - py * s))) if s <= 1 else layer.paste(r.crop((round(px * s - px), round(py * s - py), round(px * s - px) + W, round(py * s - py) + H)), (0, 0))
        else:
            if k == "tail": a = AMP[k] * math.sin(ph)
            elif k == "ear": a = AMP[k] * math.sin(ph * 2 + (0.6 if sd == "R" else 0)) * (-1 if sd == "L" else 1)
            else: a = AMP.get(k, 18) * beat * (-1 if sd == "L" else 1)
            layer = im.rotate(a, resample=Image.BICUBIC, center=(px, py))   # PIL: positive = counter-clockwise
        (back if p["behind"] else front).alpha_composite(layer)
    b = blink if 0.62 < t < 0.70 else body
    bw, bh = round(W / sq), round(H * sq); bs = b.resize((bw, bh), Image.BICUBIC)
    bl = Image.new("RGBA", (W, H)); bl.alpha_composite(bs, (round(bcx - bcx * bw / W), round(bcy - bcy * bh / H)) if bh <= H else (0, 0))
    frame = Image.new("RGBA", (W, H)); frame.alpha_composite(back); frame.alpha_composite(bl); frame.alpha_composite(front)
    out = Image.new("RGBA", (W, H + abs(bob) * 2)); out.alpha_composite(frame, (0, abs(bob) - bob))
    out.resize((384, round(384 * out.height / W)), Image.LANCZOS).save(os.path.join(OUT, f"{pet}_{f:02d}.png"))
print("RENDERED", N, "frames", pet)
