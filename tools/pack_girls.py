# Pack anime standing art (art/anime/stand_<id>.png) into build/anime_girls.js as WebP data URIs.
# usage: py tools/pack_girls.py [id=path ...]   (explicit pairs override the stand_<id>.png lookup)
import base64, io, sys, glob, os
from PIL import Image, ImageFilter

root = os.path.join(os.path.dirname(__file__), "..")
src = {os.path.basename(p)[6:-4]: p for p in glob.glob(os.path.join(root, "art/anime/stand_*.png")) if "_blink" not in p}
face, bust = {}, {}
for a in sys.argv[1:]:
    k, p = a.split("=", 1)
    if "#" in p: p, bb_ = p.split("#"); bust[k] = tuple(map(int, bb_.split(",")))
    if "@" in p: p, box = p.split("@"); face[k] = tuple(map(int, box.split(",")))
    src[k] = p
out, faces, busts = {}, {}, {}
for k, p in src.items():
    im = Image.open(p).convert("RGBA")
    if k in face:
        x, y, n = face[k]; f = im.crop((x, y, x + n, y + n)).resize((160, 160), Image.LANCZOS)
        bb = io.BytesIO(); f.save(bb, "WEBP", quality=88); faces[k] = "data:image/webp;base64," + base64.b64encode(bb.getvalue()).decode()
    if k not in bust:
        # no box given: take the head band (top 230px of the figure) and centre a 440x370 bust on it
        a = im.getchannel("A").point(lambda v: 255 if v > 60 else 0); top = a.getbbox()[1]
        hb = a.crop((0, top, im.width, top + 230)).getbbox()
        cx = (hb[0] + hb[2]) // 2 if hb else im.width // 2
        bust[k] = (max(0, min(im.width - 440, cx - 220)), max(0, top - 12), 440, 370)
    if k in bust:
        x, y, w, h = bust[k]; bb2 = io.BytesIO(); im.crop((x, y, x + w, y + h)).resize((w * 360 // h, 360), Image.LANCZOS).save(bb2, "WEBP", quality=88)
        busts[k] = "data:image/webp;base64," + base64.b64encode(bb2.getvalue()).decode()
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    if im.height > 1100: im = im.resize((round(im.width * 1100 / im.height), 1100), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "WEBP", quality=86, method=6)
    out[k] = "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()
    print(k, im.size, len(b.getvalue()) // 1024, "KB")
with open(os.path.join(root, "build/anime_girls.js"), "w") as f:
    f.write("const GIRL_SRC=" + "{" + ",".join(f'{k}:"{v}"' for k, v in out.items()) + "};\n")
    f.write("const GIRL_BUST=" + "{" + ",".join(f'{k}:"{v}"' for k, v in busts.items()) + "};\n")
    f.write("const GIRL_FACE=" + "{" + ",".join(f'{k}:"{v}"' for k, v in faces.items()) + "};\n")
    bg = os.path.join(root, "art/anime/bg_hangar.jpg")
    if os.path.exists(bg):
        bb = io.BytesIO(); Image.open(bg).convert("RGB").save(bb, "WEBP", quality=80)
        f.write('SPR_SRC.bg_home="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    for p in sorted(glob.glob(os.path.join(root, "art/anime/card_*.jpg"))):
        k = os.path.basename(p)[:-4]; im = Image.open(p).convert("RGB"); im.thumbnail((640, 640))
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=80)
        f.write(f'SPR_SRC.{k}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    # modular ship: hulls (1024 grid -> 512 px) as mod_hull_<ship>, mount-centred parts (256 -> 128 px) as mp_<part>,
    # and the per-hull mount points as SHIP_MOUNTS (1024 coords + wingScale)
    for p in sorted(glob.glob(os.path.join(root, "art/anime/ships/mod/hull_*.png"))):
        k = os.path.basename(p)[:-4]
        im = Image.open(p).convert("RGBA").resize((1024, 1024), Image.LANCZOS)
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=90)
        f.write(f'SPR_SRC.mod_{k}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    for p in sorted(glob.glob(os.path.join(root, "art/anime/ships/parts/*.png"))):
        k = os.path.basename(p)[:-4]
        if k.endswith("_check") or k.endswith("_sheet"): continue
        im = Image.open(p).convert("RGBA").resize((256, 256), Image.LANCZOS)
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=90)
        f.write(f'SPR_SRC.mp_{k}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    mp = os.path.join(root, "art/anime/ships/mounts.json")
    if os.path.exists(mp):
        import json
        f.write("const SHIP_MOUNTS=" + json.dumps(json.load(open(mp)), separators=(",", ":")) + ";\n")
    else:
        f.write("const SHIP_MOUNTS={};\n")
    for k in ["shop", "hangar", "battle", "questnav", "gear"]:
        p = os.path.join(root, f"art/anime/nav_{k}.png")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").getbbox()); im.thumbnail((160, 160), Image.LANCZOS)
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=88)
        f.write(f'SPR_SRC.ui5_{k}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    for k in ["daily", "quests", "spin", "rank", "offer", "onlinegift", "event", "settings", "notice", "mail"]:
        p = os.path.join(root, f"art/anime/feat_{k}.png")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGBA"); im.thumbnail((128, 128), Image.LANCZOS)
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=88)
        f.write(f'SPR_SRC.ui5_{k}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    cur = {"coin": "ic-coin", "gem": "ic-gem", "energy": "ic-nrg"}; css = ""
    for k, cls in cur.items():
        p = os.path.join(root, f"art/anime/mono/cur_{k}.png")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").getbbox()); im.thumbnail((96, 96), Image.LANCZOS)
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=90)
        css += f'html body .{cls}{{background:url(data:image/webp;base64,{base64.b64encode(bb.getvalue()).decode()}) center/contain no-repeat!important;transform:none!important;border-radius:0!important}}'
    if css:
        f.write("{const st=document.createElement('style');st.textContent=" + repr(css) + ";document.head.appendChild(st);}\n")
    for k in ["silver", "epic", "legend"]:
        p = os.path.join(root, f"art/anime/crate_{k}.png")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGBA"); im.thumbnail((240, 240), Image.LANCZOS)
        bb = io.BytesIO(); im.save(bb, "WEBP", quality=88)
        f.write(f'SPR_SRC.crate_{k}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    def enc(im, size, q=88):
        im = im.copy(); im.thumbnail((size, size), Image.LANCZOS); bb = io.BytesIO(); im.save(bb, "WEBP", quality=q)
        return "data:image/webp;base64," + base64.b64encode(bb.getvalue()).decode()
    # gear + materials, drones, support officers -> override the game's sprite keys
    for p in sorted(glob.glob(os.path.join(root, "art/anime/gear/*.png"))):
        n = os.path.basename(p)[:-4]; key = n if n.startswith("mat_") else "gear_" + n
        f.write(f'SPR_SRC.{key}="{enc(Image.open(p).convert("RGBA"), 160)}";\n')
    for p in sorted(glob.glob(os.path.join(root, "art/anime/drone/*.png"))):
        f.write(f'SPR_SRC.drone_{os.path.basename(p)[:-4]}="{enc(Image.open(p).convert("RGBA"), 192)}";\n')
    for p in sorted(glob.glob(os.path.join(root, "art/anime/pilot/*.png"))):
        im = Image.open(p).convert("RGBA"); im = im.crop((0, 0, im.width, im.width))  # square head-and-shoulders
        f.write(f'SPR_SRC.pilot_{os.path.basename(p)[:-4]}="{enc(im, 256)}";\n')
    # skill icons: used by skIc() through SK_ART
    sk = {os.path.basename(p)[:-4]: enc(Image.open(p).convert("RGBA"), 128) for p in sorted(glob.glob(os.path.join(root, "art/anime/skill/*.png")))}
    def mono(p):  # white glyph on black -> alpha
        im = Image.open(p).convert("RGBA")
        if im.getchannel("A").getextrema()[0] == 255:
            L_ = im.convert("L"); im = Image.new("RGBA", im.size, (255, 255, 255, 0)); im.putalpha(L_)
        return im.crop(im.getchannel("A").point(lambda v: 255 if v > 30 else 0).getbbox())
    for p in sorted(glob.glob(os.path.join(root, "art/anime/mono/mono_sk_*.png"))):  # mono skill icons win over porcelain
        sk[os.path.basename(p)[8:-4]] = enc(mono(p), 128)
    f.write("const SK_ART={" + ",".join(f'{k}:"{v}"' for k, v in sk.items()) + "};\n")
    # settings icons (white mono glyphs on black, see ICON_MONO_FORM.md): black -> transparent
    st = {}
    for k in ["music", "sfx", "vib", "sens", "lefty", "hint", "gfx", "motion", "fps", "lang"]:
        p = os.path.join(root, f"art/anime/mono/mono_set_{k}.png")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGBA")
        if im.getchannel("A").getextrema()[0] == 255:  # opaque black background: luminance becomes alpha
            L_ = im.convert("L"); im = Image.new("RGBA", im.size, (255, 255, 255, 0)); im.putalpha(L_)
        im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 30 else 0).getbbox())
        st[k] = enc(im, 96)
    f.write("const SET_ART={" + ",".join(f'{k}:"{v}"' for k, v in st.items()) + "};\n")
    p = os.path.join(root, "art/anime/nav_settings.png")  # monochrome nav set
    if not os.path.exists(p): p = os.path.join(root, "art/anime/rejected/feat_settings.png")
    if os.path.exists(p):
        im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").getbbox())
        f.write(f'SPR_SRC.ui5_navset="{enc(im, 160)}";\n')

    # battle icons (mono) -> ui_<name> so vIcon() picks them up everywhere
    ui = {}
    for p in sorted(glob.glob(os.path.join(root, "art/anime/mono/rs_*.png"))):
        ui["sk_" + os.path.basename(p)[3:-4]] = p
    for k, n in [("st_score", "st_score"), ("st_kills", "st_kills"), ("rank", "st_rank"), ("bst_skills", "bst_skills"), ("heart", "bst_hp")]:
        ui[k] = os.path.join(root, f"art/anime/mono/{n}.png")
    for k, n in [("music", "music"), ("sfx", "sfx"), ("vibration", "vib"), ("set_lefty", "lefty")]:
        ui[k] = os.path.join(root, f"art/anime/mono/mono_set_{n}.png")
    # until Codex draws the battle set, reuse mono icons that mean the same thing
    fb = {"sk_crit": "mono_sk_critmx", "sk_damage": "mono_sk_firepower", "sk_rapid": "mono_sk_overclock", "sk_drone": "mono_sk_dronelink",
          "sk_regen": "mono_sk_nanoplate", "sk_maxhp": "mono_sk_armor", "sk_magnet": "mono_sk_magnet", "heart": "mono_sk_phoenix",
          "bst_skills": "mono_sk_power", "st_kills": "mono_sk_bosshunt"}
    for k, n in fb.items():
        if not os.path.exists(ui.get(k, "")): ui[k] = os.path.join(root, f"art/anime/mono/{n}.png")
    for k in ("rank", "st_score"):
        if not os.path.exists(ui.get(k, "")): ui[k] = os.path.join(root, "art/mono/w_rank.png")
    # battle buttons: shield / bomb, and the two ULTs that have no matching icon yet (GPT redraw pending)
    ui["shield"] = os.path.join(root, "art/anime/mono/mono_sk_shield.png"); ui["bomb"] = os.path.join(root, "art/anime/mono/mono_sk_bomb.png")
    for k, fbk in [("ult_overdrive", "rs_rapid"), ("ult_laser", "rs_pierce"), ("ult_swarm", "rs_missile"), ("ult_orbit", "rs_orbit"), ("ult_storm", "rs_lightning"),
                   ("ult_flare", "rs_nova"), ("ult_blackhole", "rs_magnet"), ("ult_freeze", "mono_set_fps")]:
        p_ = os.path.join(root, f"art/anime/mono/{k}.png"); ui[k] = p_ if os.path.exists(p_) else os.path.join(root, f"art/anime/mono/{fbk}.png")
    for k, p in ui.items():
        if os.path.exists(p): f.write(f'SPR_SRC.ui_{k}="{enc(mono(p), 112)}";\n')

    # splash: key art + logo
    p = os.path.join(root, "art/anime/splash_keyart.jpg")
    if os.path.exists(p):
        im = Image.open(p).convert("RGB"); im.thumbnail((900, 1350)); bb = io.BytesIO(); im.save(bb, "WEBP", quality=80)
        f.write('SPR_SRC.splash_keyart="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    p = os.path.join(root, "art/anime/logo_valkyrie.png")
    if os.path.exists(p):
        im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
        f.write(f'SPR_SRC.logo_main="{enc(im, 900)}";\n')
    for n in range(1, 5):  # campaign chapter key art
        p = os.path.join(root, f"art/anime/chapter_{n}.jpg")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGB"); im.thumbnail((900, 600)); bb = io.BytesIO(); im.save(bb, "WEBP", quality=82)
        f.write(f'SPR_SRC.chapter_{n}="data:image/webp;base64,' + base64.b64encode(bb.getvalue()).decode() + '";\n')
    for k in ["coin", "gem", "energy", "bomb"]:  # flat currency icons for the lucky wheel
        p = os.path.join(root, f"art/anime/mono/cur_{k}.png")
        if os.path.exists(p):
            im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").getbbox())
            f.write(f'SPR_SRC.ui_cur_{k}="{enc(im, 160)}";\n')
    for p in sorted(glob.glob(os.path.join(root, "art/anime/pet/*.png"))):  # anime chibi pets replace the drone sprites
        if p.endswith("_sheet.png"): continue
        im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
        f.write(f'SPR_SRC.drone_{os.path.basename(p)[:-4]}="{enc(im, 200)}";\n')
    def biggest_blob(fr):  # drop stray pieces of the neighbouring frame: keep the region connected to the largest blob
        a = fr.getchannel("A").point(lambda v: 255 if v > 30 else 0).filter(ImageFilter.MaxFilter(9))
        w, h = a.size; seen = bytearray(w * h); best = None; pa = a.load()
        for sy in range(0, h, 6):
            for sx in range(0, w, 6):
                if pa[sx, sy] and not seen[sy * w + sx]:
                    st = [(sx, sy)]; seen[sy * w + sx] = 1; pts = []
                    while st:
                        x, y = st.pop(); pts.append((x, y))
                        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                            if 0 <= nx < w and 0 <= ny < h and pa[nx, ny] and not seen[ny * w + nx]:
                                seen[ny * w + nx] = 1; st.append((nx, ny))
                    if best is None or len(pts) > len(best): best = pts
        if not best: return fr
        m = Image.new("L", (w, h), 0); pm = m.load()
        for x, y in best: pm[x, y] = 255
        out = Image.new("RGBA", (w, h)); out.paste(fr, (0, 0), m); return out
    def strip_frames(sh):  # old 1536x384 strips: cut at the emptiest column near each 256 px line
        n = sh.width // 256; A = sh.getchannel("A").point(lambda v: 255 if v > 30 else 0); px = A.load()
        col = [sum(1 for y in range(0, sh.height, 2) if px[x, y]) for x in range(sh.width)]
        cuts = [0] + [min(range(max(1, b - 70), min(sh.width - 1, b + 70)), key=lambda x: (col[x], abs(x - b))) for b in range(256, sh.width, 256)][:n - 1] + [sh.width]
        return [biggest_blob(sh.crop((cuts[i], 0, cuts[i + 1], sh.height))) for i in range(n)]
    # Blender puppet loops (tools/blender/pet_puppet.py) override the Codex frames: pet_<id>_<n> + frame count PET_N
    puppets = {}
    for p in sorted(glob.glob(os.path.join(root, "art/anime/pet/puppet/*_[0-9][0-9].png"))):
        k, n = os.path.basename(p)[:-4].rsplit("_", 1); puppets.setdefault(k, []).append(p)
    for k, ps in puppets.items():
        for i, p in enumerate(ps):
            im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").getbbox())
            f.write(f'SPR_SRC.pet_{k}_{i}="{enc(im, 160)}";\n')
    f.write("const PET_N={" + ",".join(f'{k}:{len(v)}' for k, v in puppets.items()) + "};\n")
    # pet idle animations: 6-frame strips (art/anime/pet/anim/<id>_idle.png, 256x384 slots) -> pet_<id>_<n>;
    # every frame is re-centred on its bounding box and scaled to the strip's median height so the loop does not wobble
    for p in sorted(glob.glob(os.path.join(root, "art/anime/pet/anim/*_idle.png"))):
        k = os.path.basename(p)[:-9]; g = p.replace("_idle.png", "_grid.png")
        if k in puppets: continue
        if os.path.exists(g):  # preferred: 3x2 grid of 512 px cells with clear gaps (no touching frames)
            gs = Image.open(g).convert("RGBA"); frames = [biggest_blob(gs.crop(((i % 3) * 512, (i // 3) * 512, (i % 3 + 1) * 512, (i // 3 + 1) * 512))) for i in range(6)]
        else:
            frames = strip_frames(Image.open(p).convert("RGBA"))
        frames = [fr.crop(fr.getchannel("A").point(lambda v: 255 if v > 30 else 0).getbbox()) for fr in frames]
        hs = sorted(fr.height for fr in frames); H = hs[len(hs) // 2]; S = int(H * 1.15)
        for i, fr in enumerate(frames):
            fr = fr.resize((max(1, round(fr.width * H / fr.height)), H), Image.LANCZOS)
            o = Image.new("RGBA", (S, S)); o.paste(fr, ((S - fr.width) // 2, (S - H) // 2), fr)
            f.write(f'SPR_SRC.pet_{k}_{i}="{enc(o, 200)}";\n')
    # full-set magic circle: Blender frames (tools/blender/magic_circle.py) with a soft glow baked in -> magic_<set>_<n>
    for p in sorted(glob.glob(os.path.join(root, "art/anime/fx/magic/magic_*_*.png"))):
        k = os.path.basename(p)[:-4]
        if int(k.rsplit("_", 1)[1]) % 2: continue   # 12 of the 24 frames is smooth enough at game size and halves the size
        im = Image.open(p).convert("RGBA")
        g = im.filter(ImageFilter.GaussianBlur(6)); out = Image.new("RGBA", im.size); out.alpha_composite(g); out.alpha_composite(g); out.alpha_composite(im)
        f.write(f'SPR_SRC.{k}="{enc(out, 192)}";\n')
    p = os.path.join(root, "art/anime/escort.png")  # small mechanical drone for the "Escort Drones" run skill (not a pet)
    if os.path.exists(p):
        im = Image.open(p).convert("RGBA"); im = im.crop(im.getchannel("A").getbbox())
        f.write(f'SPR_SRC.drone_escort="{enc(im, 96)}";\n')
