# Mẫu thiết kế icon đơn sắc trắng (bản anime)

Dùng cho mọi icon mới cùng kiểu với bộ `art/mono/w_*.png` đã duyệt.

## 1. Cấu tạo một icon

```
        ✦                 ← (3) họa tiết phụ: 1–3 cái nhỏ, có thể tràn ra ngoài khung
     ◇────────◇
    ╱  ██████  ╲          ← (1) khung kim cương: viền trắng mảnh, cỡ và nét giống hệt cả bộ
   ◇   █ ▄▄ █   ◇
    ╲  ██████  ╱          ← (2) hình chính: khối trắng đặc, chi tiết khoét bằng khoảng trống
     ◇────────◇              chiếm ~70% khung, được phép tràn ra khỏi khung một chút
```

| Phần | Quy tắc |
|---|---|
| Màu | chỉ trắng #FFFFFF trên nền đen #000000 (sau đó tách đen thành trong suốt). Không xám, không gradient, không bóng, không glow, không 3D |
| (1) Khung | hình vuông xoay 45°, nét mảnh, cùng kích thước ở mọi icon |
| (2) Hình chính | một vật duy nhất, dễ nhận ra; khối đặc, chi tiết khoét rỗng; cạnh sắc; nhìn rõ ở 36–40px |
| (3) Họa tiết phụ | chọn 1–3 trong bộ của bản anime: ✦ tia sao, cánh nhỏ (lông vũ hoặc cánh mecha), vòng hào quang (cung tròn), dải ruy băng ngắn. Không dùng mây xoắn, hoa văn cổ |
| Cỡ file | 512×512 PNG, căn giữa, chừa ~8% lề, không chữ, không số |

**Tránh:** icon có hai vật trở lên, chi tiết nhỏ hơn 1/20 icon (sẽ nhòe khi thu nhỏ), nét mảnh trong hình chính (chỉ khung mới được mảnh).

## 2. Phiếu đặt icon (anh điền phần này)

| File | Dùng ở đâu | Hình chính | Họa tiết phụ |
|---|---|---|---|
| `mono_<tên>.png` | vd. Cột trái: Gacha | vd. một viên pha lê bên trong vòng tròn tuyển quân | vd. 2 tia sao + vòng hào quang |
| … | | | |

Mẹo chọn hình chính: lấy **một vật biểu tượng** của chức năng, nhìn từ chính diện hoặc hơi nghiêng 3/4. Ví dụ: Gacha → viên pha lê; Đội hình → mặt nạ hoặc tai nghe có cánh; Kho → hòm đồ; Hội → lá cờ có cánh.

## 3. Lệnh giao Codex (dán nguyên văn, chỉ thay danh sách cuối)

```
Style reference attached: art/mono/w_daily.png, art/mono/w_spin.png, art/mono/w_rank.png (our approved icon set). Match them exactly:
- one colour only: pure white (#FFFFFF) shapes on a pure black (#000000) flat background, no gradients, no grey, no shading, no glow, no 3D
- the same thin white diamond (rotated square) frame as the reference, same size and line weight; the glyph sits inside and may break out of the frame a little
- ONE bold solid filled object, details made with clean cut-out gaps, crisp edges, readable at 36 px
- 1-3 small accents from this set only: star sparks, small wings, a halo arc, a short ribbon. No ornamental swirls
- 512x512 PNG, glyph centred, about 8% margin, no text, no letters, no numbers
- save EACH icon as its own file in art/anime/mono/, no sprite sheet, do not create any other images

Icons:
1. art/anime/mono/mono_<name>.png - <hình chính>, <họa tiết phụ>
2. ...
```

Chạy: `codex exec --skip-git-repo-check -s workspace-write -C D:/Node/games/nova_vanguard_anime -i art/mono/w_daily.png -i art/mono/w_spin.png -i art/mono/w_rank.png - < job.txt`

## 4. Ngoại lệ: icon tiền tệ (vàng, kim cương, năng lượng)

Cùng ngôn ngữ glyph phẳng (khối đặc, chi tiết khoét rỗng, không gradient, không 3D), nhưng **mỗi loại một màu riêng**, vì người chơi phải phân biệt ngay ở cỡ 17–20px.

| Loại | Vàng (coin) | Kim cương (gem) | Năng lượng (energy) |
| --- | --- | --- | --- |
| Màu đặc | vàng `#ffd36b` | hồng `#ff6fae` (màu nhấn của game) | cyan `#5ee7ff` |
| Hình | đồng xu tròn nhìn chính diện, khoét hình đôi cánh nhỏ ở giữa | viên kim cương cắt giác nhìn chính diện, 3–4 mặt cắt khoét bằng khe trắng | tia sét đặt trong ô lục giác (cell pin) |
| Điểm nhận diện | hình tròn | hình nhọn nhiều cạnh | tia sét chéo |

Quy tắc riêng:

- **Không khung kim cương**, hình chiếm ~90% ô (icon chỉ cao 17–20px).
- **3 màu:** màu đặc của loại đó + khe/đường trắng `#ffffff` cho chi tiết + **viền xanh đen `#0a1030` dày** bao ngoài, để nổi trên mọi nền (hangar, popup, shop).
- **Ba hình dáng khác hẳn nhau** (tròn / nhọn / chéo), để dù nhìn lướt hay người mù màu vẫn phân biệt được.
- Không chữ, không ký hiệu tiền ($, U…), không giống icon tiền của game khác.

Lệnh Codex:

```text
Create 3 currency icons for an anime sci-fi mobile game, in the SAME flat glyph language as the attached white icons (art/mono/w_daily.png): solid filled shapes, details made with clean cut-out lines, crisp edges, no gradients, no shading, no glow, no 3D.
Each icon uses exactly 3 flat colours: its own fill colour, white (#FFFFFF) for the cut-out detail lines, and a thick dark navy (#0A1030) outline around the whole shape. No diamond frame. Shape fills about 90% of the canvas. 512x512 PNG, transparent background, no text, no letters, no currency symbols. Must read clearly at 18 px. Save each as its own file:
1. art/anime/mono/cur_coin.png - a round coin seen from the front, fill #FFD36B, a small pair of wings cut out in the centre, a thin inner ring.
2. art/anime/mono/cur_gem.png - a faceted diamond gem seen from the front, fill #FF6FAE, 3-4 facet lines cut out in white, one small sparkle.
3. art/anime/mono/cur_energy.png - a lightning bolt inside a hexagon cell, fill #5EE7FF, the bolt cut out in white.
```

## 5. Sau khi Codex vẽ xong (Claude làm)

1. Tách nền đen thành trong suốt → `w_<tên>.png`.
2. Đặt tên khớp với nút trong game (`ui5_<tên>`) rồi pack.
3. Chụp màn hình Home thật để anh duyệt.
