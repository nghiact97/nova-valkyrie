# Cut a Codex icon sheet into single icons: keep only the blob connected to each cell centre.
# usage: py tools/cut_sheet.py <sheet.png> <cols> <rows> <prefix> name1 name2 ...
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

sheet, cols, rows, prefix, names = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], sys.argv[5:]
im = Image.open(sheet).convert("RGBA")
cw, ch = im.width / cols, im.height / rows
for i, name in enumerate(names):
    x0, y0 = int(i % cols * cw), int(i // cols * ch)
    c = im.crop((x0, y0, int(x0 + cw), int(y0 + ch))); a = c.getchannel("A").point(lambda v: v if v > 40 else 0)
    m = a.point(lambda v: 255 if v else 0).filter(ImageFilter.MaxFilter(9))
    # seed: the opaque pixel nearest the cell centre
    cx, cy = c.width // 2, c.height // 2
    seed = min(((x, y) for y in range(0, c.height, 4) for x in range(0, c.width, 4) if m.getpixel((x, y))),
               key=lambda p: (p[0] - cx) ** 2 + (p[1] - cy) ** 2)
    ImageDraw.floodfill(m, seed, 128)
    a2 = ImageChops.multiply(a, m.point(lambda v: 255 if v == 128 else 0)); c.putalpha(a2)
    c = c.crop(a2.getbbox()); c.save(f"{prefix}{name}.png"); print(name, c.size)
