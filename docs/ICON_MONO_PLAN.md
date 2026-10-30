# Nova Vanguard - kế hoạch bộ icon đơn sắc (mono glyph)

Đã duyệt ngày 28/10: kiểu icon trắng đặc, khung hình thoi (phương án "giữa").
Đã áp dụng cho 7 icon: Đăng nhập, Nhiệm vụ, Vòng quay, Xếp hạng, Ưu đãi, Quà online, Sự kiện (`art/mono/mono_*.png`).
File này dành cho các icon còn lại; anh tự gửi lệnh cho Codex.

## 1. Quy tắc chung (dán vào đầu mọi lệnh Codex)
```
Style reference attached: art/mono/mono_daily.png and art/mono/mono_spin.png (our approved set). Match them exactly:
- one colour only: pure white (#FFFFFF) shapes on a pure black (#000000) flat background (we key out the black), no gradients, no grey, no shading, no glow, no 3D
- the same thin white diamond (rotated square) frame as the reference, same size and line weight; the glyph sits inside and may break out of the frame a little
- bold solid filled silhouette, clean cut-out gaps for details, crisp edges, readable at 40 px
- small sci-fi accents only (star sparks, orbit arcs, circuit lines), never ornamental swirls
- 512x512 PNG, glyph centred, ~8% margin, no text, no letters, no numbers
- save EACH icon as its own file, no sprite sheet; do not create any other images
```
Lưu ý khi icon nhỏ (≤ 32px, ví dụ cột công cụ bên phải): yêu cầu thêm `glyph fills 80% of the frame, fewer accents` để hình không bị bé.

## 2. Danh sách icon cần làm

| Đợt | File | Vị trí | Hình bên trong (gửi kèm cho Codex) |
|---|---|---|---|
| 1 | `art/mono/mono_settings.png` | Cột phải: Cài đặt | a gear with a small wrench crossing it |
| 1 | `art/mono/mono_notice.png` | Cột phải + thanh tin: Thông báo | a megaphone with three short sound lines |
| 1 | `art/mono/mono_mail.png` | Cột phải: Thư | a closed envelope with a small star seal |
| 2 | `art/mono/mono_shop.png` | Thanh dưới: Cửa hàng | a shopping cart with a gem inside |
| 2 | `art/mono/mono_hangar.png` | Thanh dưới: Xưởng tàu | a fighter jet seen from the top, nose up |
| 2 | `art/mono/mono_questnav.png` | Thanh dưới: Nhiệm vụ | a clipboard with three ticked lines |
| 2 | `art/mono/mono_gear.png` | Thanh dưới: Trang bị | a shield with a crossed sword and wrench |
| 2 | `art/mono/mono_battle.png` | Thanh dưới: Xuất kích (nút giữa) | two crossed missiles over a target reticle; NO diamond frame (the button already has a gold diamond base) |
| 3 (tuỳ chọn) | `art/mono/mono_energy.png`, `mono_coin.png`, `mono_gem.png` | Thanh tài nguyên | chỉ làm nếu muốn đồng bộ hết; hiện giữ icon màu để dễ phân biệt |

Mẫu lệnh một đợt:
```
<quy tắc chung ở mục 1>
Files (folder art/mono/):
1. art/mono/mono_settings.png - settings: a gear with a small wrench crossing it
2. art/mono/mono_notice.png - notices: a megaphone with three short sound lines
3. art/mono/mono_mail.png - mail: a closed envelope with a small star seal
```
Lệnh chạy:
```
codex exec --skip-git-repo-check -s workspace-write -C D:/Node/games/nova_vanguard -i art/mono/mono_daily.png -i art/mono/mono_spin.png - < job.txt
```

## 3. Cách đưa vào game (Claude làm khi anh gửi icon)
1. Tách nền đen thành trong suốt và cắt sát → `art/mono/w_<tên>.png`.
2. `tools/pack_sprites.py` tự thay `ui5_<tên>` bằng bản trắng (không cần sửa code).
3. Chụp Home + thanh dưới để anh duyệt, rồi mới publish / build APK.

## 4. Nên giữ màu (không đổi sang trắng)
- Đồng xu, kim cương, năng lượng (cần phân biệt nhanh).
- Ảnh tàu, boss, thẻ chế độ chơi, hộp quà trong các popup thưởng.
- Chấm đỏ thông báo "!" trên icon.
