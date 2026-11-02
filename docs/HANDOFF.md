# Nova Valkyrie — Bàn giao (02/11/2026)

Tài liệu cho AI/dev tiếp nhận (ví dụ Cline). Đọc theo thứ tự: file này → `CLAUDE.md` (quy ước, lệnh build) → `docs/FIX_PLAN.md` (danh sách việc) → `review/report.md` (vì sao phải sửa).

## 1. Dự án là gì
- Game bắn máy bay dọc kiểu anime (mecha-girl), HTML5 canvas, đóng gói Android bằng Capacitor. App id `com.novavanguard.valkyrie`, phiên bản 0.3.5.
- **Không sửa thẳng file build.** Trang game được tạo bởi:
  - `src/game.html`: game gốc;
  - `tools/anime-mock.mjs`: lớp anime, vá `game.html` bằng `patch(from,to)`. Hàm này báo lỗi nếu không tìm thấy chuỗi cần vá. JS chèn sau ``const js = ` `` nên phải escape `` ` `` và `${`;
  - `tools/pack_girls.py`: đóng gói toàn bộ ảnh anime vào `build/anime_girls.js`.
- Repo: https://github.com/nghiact97/nova-valkyrie (nhánh `main`, tag mỗi APK `vX.Y.Z`).

## 2. Build và gửi APK
```bash
py tools/pack_sprites.py   # chỉ cần lần đầu (tạo build/sprites.js)
py tools/pack_girls.py "kestrel=art/anime/style_a_mika.png@435,75,200#300,20,440,370" "seraph=art/anime/stand_seraph.png#300,10,440,370"
# tăng versionCode/versionName trong android/app/build.gradle bằng sed (KHÔNG dùng PowerShell Set-Content: BOM làm hỏng gradle)
node tools/build-www-anime.mjs && npx cap sync android
cd android && gradlew.bat assembleDebug
node tools/send-apk.mjs --notes "..."   # gửi vào nhóm Telegram của chủ dự án; nếu báo UND_ERR_HEADERS_TIMEOUT thì gửi lại
git tag vX.Y.Z && git push origin main --tags
```
- Máy test: Android A13 (`adb -s R58W20BKNQM`).
- Trang mockup (artifact) đã chạm giới hạn 16MB, nên **chỉ test bằng APK** hoặc mở `build/anime-app.html` trên máy.

## 3. Đã xong
| Việc | Trạng thái |
|---|---|
| Đợt 0: bot chơi thử `tools/playtest/newplayer.mjs` giữ save qua 3 ngày | Xong. Cần mở Chrome cổng 9223 trước khi chạy |
| 2.3 Năng lượng 6 phút/điểm | Xong (merge `d1eb10b`) |
| 2.6 Tối đa 1 popup giữa 2 trận | Xong |
| 1.5 Đồng bộ phiên bản hiển thị | Xong (phần AAB đã ký còn chờ, xem mục 5) |
| 2.1 Gợi ý cụ thể khi thua | Xong (merge `9620739`) |
| 2.4 Hành trình 7 ngày | Xong |
| 1.3 VIP thuê bao thật | **Đang làm** trên nhánh `task/vip-sub`. Kiểm tra nhánh: nếu đã có commit thì review rồi merge, nếu không thì làm lại theo FIX_PLAN 1.3 |

## 4. Việc còn lại (theo `docs/FIX_PLAN.md`)
| # | Việc | Ghi chú |
|---|---|---|
| 1.1 | Firebase Analytics + Crashlytics, sự kiện phễu | **Cần `google-services.json`** từ chủ dự án |
| 1.2 | AdMob ID thật + `app-ads.txt` + UMP consent | **Cần App ID và ad unit ID** từ chủ dự án. Code quảng cáo nằm ở `tools/native.js`, `fakeAd()` |
| 1.5 | AAB đã ký, đưa lên kênh thử nghiệm nội bộ | **Cần keystore** (hoặc được phép tạo mới) |
| 1.6 | Vẽ lại Mika (đang giống "Skysaber"), tách Raika khỏi Mika | Chờ chủ dự án chốt hướng thiết kế |
| 2.2 | Cân lại độ khó và tiền: lần thua đầu nên ở màn 1-6 trở đi (hiện kẹt ở **1-4**) | Nâng cấp bot trước: biết tiêu xu và thử lại khi thua. Đo bằng playtest |
| 2.5 | Thông báo đẩy cục bộ (năng lượng đầy, quà online, điểm danh) | Cần `@capacitor/local-notifications` |
| 3.1 | Chào bán đúng lúc (Starter $1,99 sau lần thua đầu…) | Tối đa 1 lần/phiên |
| 3.2 | Banner Valkyrie có bảo hiểm, trùng → mảnh nâng sao | Logic nặng |
| 3.3 | Battle pass 30 ngày $4,99 qua Billing | Dùng chung hạ tầng với VIP |
| 3.4 | Quảng cáo xen kẽ từ màn 1-6, tối đa 1 lần/3 trận | Sau 1.2 |
| 3.5 | Bảng xếp hạng ghi rõ "offline/bot" hoặc tắt | Nhỏ |
| 4.x | Playtest lại + rà soát lại (mục tiêu ≥ 6,5/10), rồi chạy thử VN/PH | Ngưỡng ở `review/report.md` §8 |

## 5. Quyết định đã chốt
- VIP là gói thuê bao thật. Năng lượng hồi 6 phút/điểm. **Trang chính sách giữ nguyên.**
- Giữ khung UI Valkyrie đã duyệt, chỉ đổi đúng thứ được yêu cầu. Ảnh đã duyệt không tự ý đổi camera, ánh sáng hay chất liệu.
- Gặp phàn nàn mơ hồ thì hỏi lại trước, không tự khôi phục bản cũ.

## 6. Bẫy đã gặp (đỡ mất thời gian)
- Python heredoc: chuỗi `'\n'` trong code ghi ra file bị biến thành xuống dòng thật. Hãy dùng trình sửa file hoặc kiểm tra `node --check` / `py -m py_compile`.
- `tools/anime-mock.mjs` rất lớn (~2.200 dòng vá chuỗi). Merge dễ báo xung đột cả file, dùng `git merge -X ignore-space-at-eol`.
- Blender (`D:\Programs\Blender\...`) chỉ dùng cho đồ 3D (vòng ma thuật). EEVEE xếp sai các lớp alpha chồng nhau, nên pet cắt mảnh được ghép bằng Pillow (`tools/blender/pet_puppet2d.py`).
- Ảnh Codex vẽ thường lệch tỷ lệ hoặc dính khung. Dùng `tools/blender/align_parts.py` để căn, và yêu cầu lưới có khoảng trống.
- Graphify: `py tools/graph_prep.py` rồi `cd analysis && py -m graphify explain|affected "<hàm>"`. Không thấy các chỗ được vá bằng chuỗi lúc build.
