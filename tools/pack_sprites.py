"""Trim, key out opaque backgrounds, resize and pack art/*.png into build/sprites.js (WebP data URIs)."""
import base64, io, json, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ART, OUT = ROOT / "art", ROOT / "build"
SIZE = {"boss": 420, "ship": 256, "enemy": 150, "drone": 120, "item": 96, "pilot": 192, "crate": 200, "miniboss": 300}  # UI icons are vector (src/game.html VG), not sprites
UI_APPROVED = ["settings", "hangar", "home", "shop", "campaign", "rank", "daily", "quests", "spin", "offer", "mail", "shield", "bomb", "music", "sfx", "vibration", "graphics", "language", "armor", "coinboost", "magnet", "power", "sk_orbit", "sk_crit", "sk_damage", "sk_missile", "sk_multishot", "sk_pierce", "sk_rapid", "sk_magnet", "sk_lightning", "sk_wing", "sk_drone", "sk_nova", "sk_regen", "sk_maxhp", "coin", "gem", "energy", "heart", "set_sens", "set_lefty", "set_hint", "set_motion", "set_fps"]  # icons the user approved; add a name here once its art/v2/icon_<name>.png is signed off
UI_VARIANT = {**{n: "space" for n in UI_APPROVED}, **{n: "../v4" for n in ["offer", "mail", "settings", "spin", "quests", "daily"]}}  # v4 = classic shooter-game 3D icons (preview)
UI_SIZE = 144
BG_WIDTH = 640  # backgrounds: no trim, scale to this width, lossy WebP

def key_background(im):
    """If the corners are opaque, treat the corner colour as background and make it transparent."""
    px = im.load(); w, h = im.size
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    if min(c[3] for c in corners) < 250:
        return im, False
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    # flood fill from the edges so interior pixels of the same colour survive
    seen = bytearray(w * h); stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    tol = 38
    while stack:
        x, y = stack.pop()
        i = y * w + x
        if seen[i]: continue
        seen[i] = 1
        r, g, b, a = px[x, y]
        d = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
        if d > tol * 3: continue
        px[x, y] = (r, g, b, 0 if d < tol * 2 else int(255 * (d - tol * 2) / tol))
        if x > 0: stack.append((x - 1, y))
        if x < w - 1: stack.append((x + 1, y))
        if y > 0: stack.append((x, y - 1))
        if y < h - 1: stack.append((x, y + 1))
    return im, True

def keep_main_blobs(im, grid=256, min_share=0.12):
    """Erase detached fragments: keep alpha blobs at least min_share the size of the biggest one."""
    small = im.getchannel("A").resize((grid, grid), Image.NEAREST).point(lambda a: 1 if a > 0 else 0)
    px = small.load(); label = [[0] * grid for _ in range(grid)]; sizes = {}; n = 0
    for sy in range(grid):
        for sx in range(grid):
            if not px[sx, sy] or label[sy][sx]: continue
            n += 1; stack = [(sx, sy)]; label[sy][sx] = n; cnt = 0
            while stack:
                x, y = stack.pop(); cnt += 1
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < grid and 0 <= ny < grid and px[nx, ny] and not label[ny][nx]:
                        label[ny][nx] = n; stack.append((nx, ny))
            sizes[n] = cnt
    if len(sizes) < 2: return im
    # bounding box per blob; a small blob is junk only if it sits in the outer 20% band (stray slivers), so
    # intentional small parts near the centre (e.g. nanobots around a repair cross) survive
    box = {}
    for y in range(grid):
        for x in range(grid):
            k = label[y][x]
            if k:
                b = box.get(k)
                box[k] = (x, y, x, y) if not b else (min(b[0], x), min(b[1], y), max(b[2], x), max(b[3], y))
    lo, hi = grid * 0.2, grid * 0.8
    edge = lambda k: box[k][0] < lo or box[k][1] < lo or box[k][2] > hi or box[k][3] > hi
    thin = lambda k: min(box[k][2] - box[k][0], box[k][3] - box[k][1]) <= 3
    big = max(sizes.values()); keep = {k for k, v in sizes.items() if v >= big * min_share or (v >= 12 and not edge(k) and not thin(k))}
    mask = Image.new("L", (grid, grid)); mp = mask.load()
    for y in range(grid):
        for x in range(grid):
            if label[y][x] in keep: mp[x, y] = 255
    mask = mask.resize(im.size, Image.NEAREST)
    alpha = Image.composite(im.getchannel("A"), Image.new("L", im.size, 0), mask)
    im.putalpha(alpha); return im


def main():
    OUT.mkdir(exist_ok=True)
    out, report = {}, []
    for f in sorted(ART.glob("*.png")):
        kind = f.stem.split("_")[0].rstrip("0123456789")
        if kind not in SIZE: continue
        im = Image.open(f).convert("RGBA")
        im, keyed = key_background(im)
        bbox = im.getchannel("A").point(lambda a: 255 if a > 12 else 0).getbbox()
        if bbox: im = im.crop(bbox)
        s = SIZE[kind]; im.thumbnail((s, s), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=88, method=6)
        out[f.stem] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
        im.save(OUT / f"{f.stem}.png")
        report.append(f"{f.stem}: {im.size[0]}x{im.size[1]} {len(buf.getvalue())//1024}KB{' (bg keyed)' if keyed else ''}")
    # approved hand-reviewed UI icons (art/v2) replace the vector icon of the same name in-game
    for name in UI_APPROVED:
        f = (ART / "v2" / UI_VARIANT.get(name, "") / f"icon_{name}.png").resolve()
        if not f.exists(): continue
        im = Image.open(f).convert("RGBA")
        # drop faint glow spray / speckles outside the badge, then crop to the solid badge
        im.putalpha(im.getchannel("A").point(lambda a: 0 if a < 48 else a))
        im = keep_main_blobs(im)
        # crop to the main object: ignore thin stray slivers (rows/columns with only a few solid pixels)
        solid = im.getchannel("A").point(lambda a: 255 if a > 160 else 0)
        w, h = solid.size; px = solid.load()
        cols = [x for x in range(w) if sum(1 for y in range(0, h, 4) if px[x, y]) > 6]
        rows = [y for y in range(h) if sum(1 for x in range(0, w, 4) if px[x, y]) > 6]
        bbox = (cols[0], rows[0], cols[-1] + 1, rows[-1] + 1) if cols and rows else None
        if bbox: im = im.crop(bbox)
        im.thumbnail((UI_SIZE, UI_SIZE), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=90, method=6)
        out["ui_" + name] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
        report.append(f"ui_{name}: {im.size[0]}x{im.size[1]} {len(buf.getvalue())//1024}KB (approved icon)")
    # equipment + material art (art/v2/space/gear_*.png, mat_*.png): drop stray fragments, crop, resize
    for f in sorted((ART / "v2" / "space").glob("gear_*.png")) + sorted((ART / "v2" / "space").glob("mat_*.png")):
        im = Image.open(f).convert("RGBA")
        im.putalpha(im.getchannel("A").point(lambda a: 0 if a < 48 else a))
        im = keep_main_blobs(im)
        bbox = im.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
        if bbox: im = im.crop(bbox)
        im.thumbnail((160, 160), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=88, method=6)
        out[f.stem] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
        report.append(f"{f.stem}: {im.size[0]}x{im.size[1]} {len(buf.getvalue())//1024}KB (gear)")
    # Home v5 (approved mockup): side/nav icons -> ui5_<name>, mode-card art -> card_<name>
    for f in sorted((ART / "v5").glob("icon_*.png")):
        im = Image.open(f).convert("RGBA")
        im.putalpha(im.getchannel("A").point(lambda a: 0 if a < 48 else a))
        im = keep_main_blobs(im)
        bbox = im.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
        if bbox: im = im.crop(bbox)
        im.thumbnail((144, 144), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=90, method=6)
        out["ui5_" + f.stem[5:]] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    # monochrome white glyph set (approved 28/10): replaces the matching ui5_<name>
    for f in sorted((ART / "mono").glob("w_*.png")):
        im = Image.open(f).convert("RGBA")
        im.thumbnail((144, 144), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=90, method=6)
        out["ui5_" + f.stem[2:]] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    # animated Sortie button (user-supplied animated WebP, inlined as-is so the frames survive)
    vortex = ART / "fx" / "sortie_vortex_168.webp"
    if vortex.exists():
        out["ui5_battle"] = "data:image/webp;base64," + base64.b64encode(vortex.read_bytes()).decode()
    for f in sorted((ART / "v5").glob("card_*.png")):
        im = Image.open(f).convert("RGB")
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=80, method=6)
        out[f.stem] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    for f in sorted(ART.glob("logo_*.jpg")):  # splash logo, kept at full size
        buf = io.BytesIO(); Image.open(f).convert("RGB").save(buf, "WEBP", quality=82, method=6)
        out[f.stem] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    for f in sorted(ART.glob("bg_*.jpg")) + sorted(ART.glob("bg_*.png")):
        im = Image.open(f).convert("RGB")
        im = im.resize((BG_WIDTH, round(im.height * BG_WIDTH / im.width)), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "WEBP", quality=72, method=6)
        out[f.stem] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
        report.append(f"{f.stem}: {im.size[0]}x{im.size[1]} {len(buf.getvalue())//1024}KB (bg)")
    (OUT / "sprites.js").write_text("const SPR_SRC=" + json.dumps(out) + ";\n", encoding="utf-8")
    print("\n".join(report)); print("total", sum(len(v) for v in out.values()) // 1024, "KB")

if __name__ == "__main__":
    main()
