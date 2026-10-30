# Thanh điều hướng: lệnh vẽ 5 mẫu icon đơn sắc cho GPT-6

Vẽ lại 5 icon của thanh điều hướng dưới: **Cửa hàng · Xưởng · Xuất kích · Nhiệm vụ · Cài đặt**. Phong cách đơn sắc bạc/trắng như ảnh tham khảo anh gửi (huy hiệu dập nổi, có hoặc không có tấm kim cương phía sau).

GPT vẽ **5 mẫu phong cách (A–E)**. Mỗi mẫu là **một tấm gồm đủ 5 icon**, để anh so sánh cả bộ đứng cạnh nhau, không phải từng icon lẻ.

## 1. Cách làm

1. Mở GPT-6 (chế độ vẽ ảnh), **đính kèm 3 ảnh**:
   - 2 ảnh tham khảo anh gửi (thanh icon bạc có tấm kim cương, và thanh icon bạc không khung);
   - `art/anime/nav_battle.png`: icon Xuất kích cánh + kiếm vừa chọn, để giữ ý tưởng cho nút giữa.
2. Dán **lệnh chung** (mục 2), ngay sau đó dán **một** mẫu ở mục 3. Mỗi lần ra 1 tấm.
3. Lưu ảnh vào `art/anime/navmono/` với tên `nav_A.png` … `nav_E.png`.
4. Báo Claude. Claude sẽ:
   - cắt từng icon và tách nền;
   - ghép mỗi mẫu vào thanh điều hướng thật trong game;
   - gửi ảnh so sánh để anh chọn.

**Nếu GPT vẽ lệch:**
- Có màu: nhắc *"Monochrome silver and white only, no colour at all"*.
- Có chữ: nhắc *"Remove all text and labels"*.
- Thiếu hoặc thừa icon: nhắc *"Exactly 5 icons in one row, in this order"*.

## 2. Lệnh chung (dán nguyên văn)

```text
Design the 5 bottom-navigation icons of an anime mecha-girl space shooter mobile game, in the MONOCHROME SILVER EMBLEM style of the two attached navigation-bar references (match their look and finish, not their subjects; original designs, do not copy them).

Style rules for every icon:
- monochrome only: white, silver and cool greys; absolutely no colour, no gold, no cyan, no pink
- each icon is a bold solid emblem with a soft embossed metal finish: brighter white on top-left, slightly darker silver-grey toward the bottom-right, crisp dark charcoal outline, small cut-out details as negative space
- simple, strong silhouette that reads clearly at 48 px; no tiny details, no thin hairlines inside the emblem
- all 5 icons share the same visual weight, line thickness, lighting and size, so they look like one designed set
- the middle icon (SORTIE) is about 15% larger than the others
- no text, no letters, no numbers, no notification dots

Subjects, left to right:
1. SHOP: a boutique shopping bag with a small four-point star charm hanging from the handle
2. HANGAR (the pilots / characters screen): a side-profile bust of an anime girl with short hair and a small winged headset
3. SORTIE (main launch button): an upward-pointing energy sword with a pair of swept mecha wings around the hilt (keep the idea of the attached sortie icon, redrawn in this monochrome style)
4. QUESTS: a slim tablet or notebook with a large check mark and a short bookmark ribbon
5. SETTINGS: a gear wheel with a small diamond-shaped core in the centre

Layout: one image 1536 x 1024, the 5 icons in ONE horizontal row, evenly spaced, centred vertically, each icon about 230 x 230 px, at least 50 px of empty space between neighbours. Background: fully transparent; if transparency is not possible, a flat pure magenta (#FF00FF) background with nothing else on it.
```

## 3. Năm mẫu phong cách (chọn 1 cho mỗi lần vẽ)

### Mẫu A: `nav_A.png`. Huy hiệu bạc trên tấm kim cương tối (giống ảnh tham khảo có khung)

```text
Variant A: each emblem sits on its own dark slate-grey diamond plate (a square rotated 45 degrees) with a thin double silver border and a faint inner bevel; the silver emblem is slightly larger than the plate so its tips break out of the frame. All 5 plates are identical in size; the SORTIE plate is 15% larger.
```

### Mẫu B: `nav_B.png`. Huy hiệu bạc không khung (giống ảnh tham khảo không khung)

```text
Variant B: no plate and no frame at all; each emblem stands alone, silver-white with a soft vertical gradient (bright white top, light grey bottom), a crisp charcoal outline and a very soft dark drop shadow underneath.
```

### Mẫu C: `nav_C.png`. Huy hiệu trên khiên lục giác

```text
Variant C: each emblem sits inside a thin silver hexagon shield outline (pointy top and bottom) with a subtle dark fill; the SORTIE emblem instead sits in front of a larger hexagon with two small wing tips flaring out of its sides.
```

### Mẫu D: `nav_D.png`. Trắng phẳng, viền kim cương kép (gần bộ icon trắng đã duyệt trong game)

```text
Variant D: flatter look: pure white emblems with only a light grey shade on one side (two tones, no gradient), framed by a thin double-line white diamond outline (no fill), plus one tiny four-point star spark near the top-right of each frame.
```

### Mẫu E: `nav_E.png`. Bạc đánh bóng, dạng huy chương

```text
Variant E: polished chrome-silver medal style: each emblem sits on a round silver medallion with a narrow raised rim and short laurel-like mecha wing tips at the lower sides; strong specular highlight on the top-left of the rim; emblem in brighter white than the medallion.
```

## 4. Khi gắn vào game (Claude làm)

- **Tab đang chọn và không chọn:** chỉ cần một bản vẽ.
  - Tab đang chọn: sáng trắng, có quầng sáng nhẹ.
  - Tab không chọn: giảm sáng khoảng 35%, chữ xám.
  - Cả hai làm bằng CSS, không cần vẽ thêm.
- **Nút Xuất kích:** giữ hiệu ứng nhấp nhô. Đổi quầng sáng xanh sang quầng trắng nếu anh muốn đúng tinh thần đơn sắc.
- **Lưu file:** mỗi icon cắt ra 384×384 PNG trong `art/anime/navmono/`. Bộ đang dùng (sứ trắng + kiếm cánh) giữ nguyên để quay lại được.
