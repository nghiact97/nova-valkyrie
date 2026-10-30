# Bộ icon trong trận: lệnh vẽ cho GPT

19 icon trắng đơn sắc dùng trong trận: thẻ lên cấp, thanh kỹ năng, Tạm dừng, Chiến thắng, màn chuẩn bị. Kiểu vẽ giống hệt bộ icon trắng đã duyệt (xem `art/anime/ICON_MONO_FORM.md`).

## Cách làm

1. Mở GPT (model vẽ ảnh), **đính kèm 3 ảnh mẫu**:
   - `art/anime/mono/mono_sk_armor.png`
   - `art/anime/mono/mono_set_music.png`
   - `art/mono/w_rank.png`
2. Dán **lệnh chung** ở mục 2, ngay sau đó dán **một** trong 3 lô ở mục 3. Mỗi lô ra 1 ảnh tấm (6–7 icon).
3. Lưu ảnh nhận được vào `art/anime/mono/` với tên `battle_sheet_1.png`, `battle_sheet_2.png`, `battle_sheet_3.png`.
4. Báo Claude. Claude sẽ cắt tấm thành từng icon, tách nền đen, gắn vào game và chụp màn hình kiểm tra.

Nếu GPT vẽ lệch kiểu (có màu, có bóng, nét dày mỏng khác nhau), bảo nó: *"Make it pure white on pure black, flat, same thin diamond frame as the attached references"* rồi vẽ lại.

## 2. Lệnh chung (dán nguyên văn)

```text
Draw a sheet of game UI icons that match the 3 attached reference icons EXACTLY (our approved set):
- one colour only: pure white (#FFFFFF) shapes on a pure black (#000000) flat background; no grey, no gradient, no shading, no glow, no 3D, no outline colour
- each icon sits inside the same thin white diamond frame (a square rotated 45°) as the references, same frame size and same line weight for every icon
- inside the frame: ONE bold, solid, filled object; details are clean cut-out gaps (negative space); crisp sharp edges; must read clearly at 36 px
- 1-3 small accents only, from this set: four-point star sparks, small wings, a halo arc, a short ribbon; no ornamental swirls
- no text, no letters, no numbers anywhere
- layout: a grid with the number of columns and rows given below, every icon centred in its own equal cell, at least 60 px of pure black space between neighbouring frames, all frames the same size
- original designs, do not copy any existing game's icons
```

## 3. Ba lô icon

### Lô 1: `battle_sheet_1.png` (lưới 3 cột × 2 hàng, ảnh ngang 1536×1024)

```text
Grid: 3 columns x 2 rows, left to right, top to bottom:
1. MULTISHOT: three bullets fanning out upward from one point
2. RAPID FIRE: a bullet with three speed lines and a small lightning bolt
3. POWER ROUNDS: a heavy armour-piercing round with a sharp tip
4. PIERCING: an arrow-shaped bolt passing straight through two thin bars
5. CRITICAL HIT: a cracked shield struck by a four-point star burst
6. HOMING MISSILES: a missile curving upward with a dotted trail
```

### Lô 2: `battle_sheet_2.png` (lưới 3 cột × 2 hàng, ảnh ngang 1536×1024)

```text
Grid: 3 columns x 2 rows, left to right, top to bottom:
1. PLASMA ORBS: a small fighter-jet silhouette with two orbs circling it on an orbit ring
2. CHAIN LIGHTNING: a forked lightning bolt jumping between three dots
3. WING CANNONS: two small cannons angled outward on a pair of wings
4. ESCORT DRONES: two small drones side by side, seen from above
5. NOVA PULSE: a ring shockwave bursting out from a central star
6. NANO REPAIR: a wrench crossed with a plus sign
```

### Lô 3: `battle_sheet_3.png` (lưới 4 cột × 2 hàng, ảnh ngang 1536×1024, chỉ 7 ô có icon, ô cuối để đen trống)

```text
Grid: 4 columns x 2 rows, left to right, top to bottom; the 8th (last) cell stays empty black:
1. REINFORCED HULL: a heart inside an armour plate
2. TRACTOR FIELD: a horseshoe magnet pulling three small crystals
3. SCORE: a round medal with a star in the centre
4. ENEMIES DESTROYED: an explosion burst with a small horned mecha mask in front
5. PILOT LEVEL: a military chevron rank badge with a star on top
6. START WITH 2 SKILLS: two stacked skill cards with a plus sign
7. +1 HP: a heart with a plus sign
```

## 4. Icon dùng ở đâu (để Claude đặt tên khi cắt)

| Lô | Ô | File sau khi cắt | Dùng ở |
|---|---|---|---|
| 1 | 1 | `rs_multishot.png` | kỹ năng trận: Đa nòng |
| 1 | 2 | `rs_rapid.png` | Bắn nhanh |
| 1 | 3 | `rs_damage.png` | Đạn xuyên giáp |
| 1 | 4 | `rs_pierce.png` | Xuyên thấu |
| 1 | 5 | `rs_crit.png` | Chí mạng |
| 1 | 6 | `rs_missile.png` | Tên lửa đuổi |
| 2 | 1 | `rs_orbit.png` | Cầu plasma |
| 2 | 2 | `rs_lightning.png` | Sét lan |
| 2 | 3 | `rs_wing.png` | Pháo cánh |
| 2 | 4 | `rs_drone.png` | Drone hộ tống |
| 2 | 5 | `rs_nova.png` | Sóng nova |
| 2 | 6 | `rs_regen.png` | Sửa chữa nano |
| 3 | 1 | `rs_maxhp.png` | Gia cố thân tàu |
| 3 | 2 | `rs_magnet.png` | Trường hút |
| 3 | 3 | `st_score.png` | ô Điểm (Tạm dừng, Chiến thắng) |
| 3 | 4 | `st_kills.png` | ô Đã hạ (Chiến thắng) |
| 3 | 5 | `st_rank.png` | ô Cấp phi công, cấp bậc ở Hồ sơ |
| 3 | 6 | `bst_skills.png` | nút tăng cường "2 kỹ năng" trước trận |
| 3 | 7 | `bst_hp.png` | nút tăng cường "+1 HP" trước trận |

Lệnh cắt (Claude chạy): `py tools/cut_sheet.py <tấm> <cột> <hàng> art/anime/mono/ <tên…>` sau khi đổi nền đen thành trong suốt.

## 5. Lô 4: nút trong trận (khiên, bom, tuyệt chiêu)

Ba nút tròn ở góc phải màn chơi. Đã đổi sang icon trắng và thu nhỏ. Khiên và Bom đang dùng icon kỹ năng cùng tên, 2 ULT dưới đây đang dùng icon tạm (Hố đen dùng Trường hút, Đóng băng dùng đồng hồ FPS), cần vẽ riêng. Dùng cùng lệnh chung ở mục 2 + 3 ảnh mẫu như cũ.

Lưu ảnh nhận được vào `art/anime/mono/battle_sheet_4.png`.

```text
Grid: 4 columns x 2 rows, left to right, top to bottom; the 8th (last) cell stays empty black.
These are the SIGNATURE ULTIMATE skills of 8 fighter pilots; each must be instantly recognisable and different from the others:
1. OVERDRIVE: a fighter-jet silhouette with three speed streaks and a double up-chevron
2. LASER STORM: one huge vertical laser beam with small sparks around its base
3. MISSILE SWARM: a cluster of five small missiles fanning upward
4. ORBITAL RING: a ring of eight small orbs around a central star
5. THUNDERSTORM: a storm cloud with three lightning bolts striking down
6. BLACK HOLE: a spiral vortex with a dark centre and particles being pulled in
7. SOLAR FLARE: a big radiant sun with long sharp rays
```

Lô 4 nhận về thì Claude cắt thành `ult_overdrive`, `ult_laser`, `ult_swarm`, `ult_orbit`, `ult_storm`, `ult_blackhole`, `ult_flare` và vẽ thêm Time Freeze (đồng hồ cát + bông tuyết) trong một lệnh lẻ:

```text
Draw ONE icon in exactly the same style (single cell, 1024x1024): TIME FREEZE: an hourglass with a large snowflake in front of it.
```

Lưu thành `art/anime/mono/ult_freeze.png`.
