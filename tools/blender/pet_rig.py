# Builds a rig description for a layered cut-out pet (all parts on the same canvas, same scale) and runs Blender on it.
#   py tools/blender/pet_rig.py <pet> [frames]
# Parts in art/anime/pet/parts/<pet>_<part>.png: body, blink, and moving parts named wingL/wingR, armL/armR, finL/finR,
# earL/earR, tail, mane. The pivot of each moving part is derived from its alpha mask:
#   wing/arm/fin L|R -> inner edge (side facing the body centre), at the part's vertical middle-top
#   ear              -> bottom middle (where it joins the head)
#   tail             -> the part point closest to the body centre
#   mane             -> its own centre (it pulses instead of rotating)
import json, os, subprocess, sys
from PIL import Image
pet = sys.argv[1]; N = int(sys.argv[2]) if len(sys.argv) > 2 else 16
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
P = os.path.join(root, "build", "parts_aligned"); OUT = os.path.join(root, "art", "anime", "pet", "puppet")
BLENDER = r"D:\Programs\Blender\Blender Foundation\Blender 5.2\blender.exe"

def mask(p):
    im = Image.open(p).convert("RGBA"); a = im.getchannel("A").point(lambda v: 255 if v > 40 else 0); return im.size, a, a.getbbox()

(W, H), _, bb = mask(os.path.join(P, f"{pet}_body.png"))
cx, cy = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
rig = {"size": [W, H], "body_bbox": bb, "parts": []}
for fn in sorted(os.listdir(P)):
    if not fn.startswith(pet + "_") or not fn.endswith(".png"): continue
    part = fn[len(pet) + 1:-4]
    if part in ("body", "blink"): continue
    _, a, b = mask(os.path.join(P, fn))
    if not b: continue
    kind = part.rstrip("LR"); side = part[-1] if part[-1] in "LR" else ""
    if kind in ("wing", "arm", "fin"):
        x = b[2] if side == "L" else b[0]; y = b[1] + (b[3] - b[1]) * 0.35
        if kind == "fin": y = b[1] + (b[3] - b[1]) * 0.25
    elif kind == "ear":
        x = (b[0] + b[2]) / 2; y = b[3]
    elif kind == "tail":
        px = a.load(); best = None
        for yy in range(b[1], b[3], 4):
            for xx in range(b[0], b[2], 4):
                if px[xx, yy]:
                    d = (xx - cx) ** 2 + (yy - cy) ** 2
                    if best is None or d < best[0]: best = (d, xx, yy)
        x, y = best[1], best[2]
    else:
        x, y = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
    rig["parts"].append({"name": part, "kind": kind, "side": side, "pivot": [x / W, y / H], "behind": kind in ("wing", "tail", "mane", "fin")})
os.makedirs(OUT, exist_ok=True)
rp = os.path.join(root, "build", f"rig_{pet}.json"); os.makedirs(os.path.dirname(rp), exist_ok=True)
json.dump(rig, open(rp, "w"), indent=1)
print(json.dumps(rig["parts"]))
r = subprocess.run([BLENDER, "-b", "-P", os.path.join(root, "tools", "blender", "pet_rig_blender.py"), "--", P, pet, OUT, str(N), rp], capture_output=True, text=True)
print([l for l in r.stdout.splitlines() if "RENDERED" in l or "Error" in l][-3:] or r.stdout[-800:])
