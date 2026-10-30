# Nova Valkyrie — Rà soát UI & logic (30/10/2026)

## 1. Cách test

- **Công cụ:** Chrome headless (puppeteer) chạy bản mock `anime_home.html` (giống APK 0.2.5), màn 412×915.
- **Chụp:** 46 màn hình / popup ở 2 trạng thái save:
  - save mới (chưa qua màn nào);
  - save đã mở hết (42 màn 3 sao).
- **Logic chạy tự động:** khoá tính năng, năng lượng, thắng 1-1, mở khoá, quay, mua rương, nâng cấp, nút nhiệm vụ, đổi ngôn ngữ.
- **Chưa test:** máy thật, nút Back Android, thanh toán / quảng cáo thật, độ khó Khó / Ác mộng, tab Tài khoản.

Danh sách màn đã chụp: splash, Home, Chiến dịch, popup màn, Vô tận, Đấu Boss, Xưởng (Phi công / Gear / Skills / Drones / Boss / Hỗ trợ), popup trang bị, popup kỹ năng, Shop (3 tab), mở rương, Nhiệm vụ, Xếp hạng (2 tab), Cài đặt, Hồ sơ, Quà online, Thông báo, Điểm danh, Vòng quay may mắn, Vòng quay huyền thoại, Offer Seraphina, Hộp thư, Năng lượng, Sự kiện, Nhận thưởng, Mở khoá mới, Hướng dẫn, trận đấu, Lên cấp, Tạm dừng, Boss, Hồi sinh, Thắng, Thua, Vô tận (trận), Đấu Boss (trận), Sự kiện (trận).

## 2. Kết quả tổng

| Nhóm | Số mục |
|---|---|
| A. UI đã đổi khung nhưng nội dung còn sơ sài | 6 |
| B. Chữ tiếng Anh / lẫn Anh–Việt khi chọn tiếng Việt | 17 màn |
| C. Nội dung sai / không khớp | 6 |
| D. Logic sai hoặc rủi ro | 7 |
| E. Việc tồn từ trước | 5 |

Mọi màn đều đã có khung Valkyrie mới. Không còn màn nào giữ nguyên giao diện cũ hoàn toàn.

## 3. Chi tiết

### A. Chỉ mới thay khung, nội dung còn sơ sài

| # | Màn | Vấn đề |
|---|---|---|
| A1 | Popup Vô tận / Đấu Boss | Chỉ có 1 dòng mô tả và "Kỷ lục 0". Không có ảnh, không có phần thưởng, không có bảng xếp hạng |
| A2 | Popup Năng lượng | Chỉ có số 30/30 và 2 nút; dòng "+1 SAU FULL" khó hiểu |
| A3 | Hộp thư | Thẻ thư trơn, chưa có icon và người gửi |
| A4 | Popup Sự kiện | Chưa có ảnh banner sự kiện, chỉ có icon tàu nhỏ |
| A5 | Thông báo | 3 thẻ chữ, chưa có ảnh |
| A6 | HUD trong trận | Thanh máu boss và tên boss **đè lên** thanh máu người chơi (3/3) ở trên cùng |

### B. Lẫn tiếng Anh khi đang chọn tiếng Việt

| # | Màn | Chữ còn tiếng Anh |
|---|---|---|
| B1 | Home | LOGIN, SPIN, RANKING, SPECIAL OFFER, ONLINE GIFT, EVENT, NOTICES, MAIL, CAMPAIGN, BOSS CHALLENGE, EXPLORE, BEST, dòng chạy chữ "Crimson Swarm is live ★ Version 0.2 ★ Welcome gift" |
| B2 | Thanh điều hướng | SHOP, HANGAR, SORTIE, QUESTS, SETTINGS |
| B3 | Splash | READY |
| B4 | Tab Xưởng | GEAR, SKILLS, DRONES, BOSS (trong khi PHI CÔNG, HỖ TRỢ là tiếng Việt) |
| B5 | Tab Gear + popup trang bị | POWER, "+11% fire rate", "Solar set", "2 pcs · +10% crit chance", "4 pcs · Crits have a 15% chance…" |
| B6 | Tab Hỗ trợ | Bo: "Start each stage with 1 extra HP"; Vega: "+15% damage to bosses" |
| B7 | Popup Vô tận | "Infinite đợt · weekly ranking" |
| B8 | Popup Đấu Boss | "3 boss liên tiếp · big gem reward" |
| B9 | Điểm danh | TODAY, "20 gems", "2× shield", "150 gems + crate" |
| B10 | Vòng quay may mắn | FREE, AD, SPIN |
| B11 | Vòng quay huyền thoại | LEGEND, EPIC, RARE, SPIN ×1, SPIN ×10 |
| B12 | Hộp thư | "Welcome, Pilot! A gift to start your tour.", "Server maintenance / Sorry for the downtime.", "50 gems" |
| B13 | Năng lượng | "+10 FREE", "FULL" |
| B14 | Sự kiện | "Crimson Bầy địch · 90S · 2× ENEMIES · 2D 14H" |
| B15 | Thông báo | Nhãn EVENT / UPDATE / GIFT |
| B16 | Nhận thưởng, kết quả trận | "Gem" |
| B17 | Offer Seraphina | "SOLAR COMMANDER · LEGENDARY" |

### C. Nội dung sai / không khớp

| # | Vấn đề |
|---|---|
| C1 | Thông báo ghi "Cảm ơn bạn đã chơi thử **Nova Vanguard**" — tên game cũ |
| C2 | Thông báo "Phiên bản 0.2: 8 tàu có tuyệt chiêu, 9 drone…" và dòng chạy chữ "Version 0.2" là nội dung của game gốc, chưa cập nhật |
| C3 | Splash và Cài đặt ghi **v1.0.0**, APK thật là 0.2.5 |
| C4 | Tên rương không khớp: Shop ghi "Rương Tiếp tế", mở ra lại ghi "**Rương Bạc**" |
| C5 | Nhiệm vụ "Nâng cấp **tàu** 1 lần", trong khi Xưởng gọi là Valkyrie / phi công |
| C6 | Popup màn 1-1 → 1-3 vẫn ghi "⚡5" trên nút Bắt đầu, dù thực tế miễn phí |

### D. Logic sai hoặc rủi ro

| # | Mức | Vấn đề | Cách tái hiện |
|---|---|---|---|
| D1 | Cao | Tạm dừng → **Chơi lại** luôn trừ 5 năng lượng, kể cả ở màn 1-1 → 1-3 (đáng lẽ miễn phí) | Vào 1-1, tạm dừng, Chơi lại |
| D2 | Cao | Xu/gem của trận chỉ được cộng khi bấm nút ở màn kết quả. Nếu tắt app hoặc app bị kill lúc đang ở màn kết quả thì **mất thưởng** | Thắng màn, tắt app |
| D3 | Trung bình | Đồng hồ đếm ngược Hồi sinh không bị huỷ khi popup bị đóng theo cách khác (ví dụ nút Back Android) → 5 giây sau tự kết thúc trận | Chết, bấm Back |
| D4 | Trung bình | Thẻ kỹ năng "Drone hộ tống" vẫn có thể hiện khi lên cấp ở màn 1-1 → 1-4, lúc drone chưa mở khoá → chọn vào không có tác dụng | Lên cấp ở 1-1 vài lần |
| D5 | Trung bình | Tab Boss trong Xưởng có "Kỹ năng triệu hồi" (Vòng pháo…) nhưng **trong trận chưa dùng được** — mới có giao diện |
| D6 | Thấp | Thanh máu boss đè HUD (cùng A6) |
| D7 | Thấp | Thắng 1-1 mà không hạ địch nào vẫn được 3 sao (sao chỉ dựa vào máu còn lại) — cần xác nhận đây là luật mong muốn |

### E. Việc tồn từ trước

| # | Việc |
|---|---|
| E1 | Mika giống nhân vật "Skysaber" (Starward) — chưa quyết vẽ lại |
| E2 | Raika giống Mika — đã đề xuất vẽ lại tông vàng chanh |
| E3 | Mũi tên đổi phi công ở Home đè tên trên màn rất thấp (360×640) |
| E4 | Nhạc nền: đang chờ anh duyệt 4 bản thử |
| E5 | Hiệu ứng âm thanh vẫn là âm thanh tạo bằng code, chưa làm lại |

## 4. Những phần đã chạy đúng

- **Khoá tính năng:** save mới có 22 nút bị khoá, đúng các mốc 1-1 → 2-1. Qua 1-1 thì mở Nhiệm vụ và hiện dialog "MỞ KHOÁ MỚI!".
- **Màn dễ:** 1-1 có 3 đợt, đúng thông số dễ, không tốn năng lượng.
- **Màn kết quả thắng 1-1:** 300 xu, 5 gem, 8 hợp kim; nhiệm vụ "Chơi 3 màn" tăng 1.
- **Vòng quay:** miễn phí 1 lần/ngày, quay xong chuyển sang nút trả phí.
- **Mua rương:** rương 60 gem trừ đúng 60.
- **Nâng cấp phi công:** lv 1→2, trừ 300 xu.
- **Nhiệm vụ:** nút "Đi" mở đúng màn Chiến dịch.
- Không có lỗi JavaScript trong suốt các lượt test.

## 5. Trạng thái sau khi sửa (APK 0.3.0, 30/10)

| Mục | Trạng thái |
|---|---|
| D1 Chơi lại tốn năng lượng ở 1-1 → 1-3 | Đã sửa: miễn phí, nút ghi ⚡0 |
| D2 Mất thưởng nếu tắt app ở màn kết quả | Đã sửa: xu/gem cộng ngay khi hiện kết quả; xem quảng cáo chỉ cộng phần ×2 |
| D3 Đồng hồ Hồi sinh | Kiểm tra lại: nút Back bấm ✕ nên không lỗi thật; vẫn thêm chặn cho chắc |
| D4 Thẻ Drone hộ tống khi chưa mở drone | Đã sửa: thẻ không xuất hiện trước 1-4 |
| D5 Kỹ năng triệu hồi lõi boss | Đã làm: tự tung theo hồi chiêu, ô "LÕI" góc trái dưới, đủ 10 kỹ năng, mở từ 1-10 |
| D6 / A6 Thanh máu boss đè HUD | Đã sửa: nằm dưới thanh máu người chơi, kiểu Valkyrie |
| D7 3 sao khi không hạ địch | Không phải lỗi: sao tính theo máu còn lại, game thật không thể thắng mà không hạ địch |
| C1–C2 Thông báo tên cũ, nội dung game gốc | Đã viết lại cho Nova Valkyrie |
| C3 Phiên bản v1.0.0 | Đã sửa: lấy theo versionName của Android |
| C4 Tên rương | Đã sửa: "Rương Tiếp tế" ở mọi nơi |
| C5 "tàu" | Đã đổi sang "phi công" trong các câu tiếng Việt về nâng cấp / sở hữu |
| C6 ⚡5 ở màn miễn phí | Đã sửa: ghi "MIỄN PHÍ" |
| B1–B17 Tiếng Anh lẫn | Đã sửa: rà lại tự động trên mọi màn, tiếng Việt không còn chữ Anh, tiếng Anh không lẫn chữ Việt; máy tiếng Việt mặc định tiếng Việt |
| A1–A5 Popup sơ sài | Đã làm: banner ảnh + phần thưởng (Vô tận / Đấu Boss, có lưu kỷ lục Đấu Boss), thanh năng lượng, icon thư + người gửi, banner sự kiện, lời Mika ở Thông báo |

**Ghi chú phát hiện thêm:** khi bản rà soát đầu tiên chụp, script test đổi ngôn ngữ mà chưa chạy bước dịch lại, nên một số chữ ở Home trông như tiếng Anh. Lỗi thật là game **mặc định tiếng Anh** cho mọi máy; đã đổi sang tự chọn tiếng Việt khi điện thoại dùng tiếng Việt.

**Còn mở:**
- Link Chính sách / Điều khoản trong Cài đặt vẫn trỏ về trang của game cũ (`nova-vanguard-app.web.app`); cần trang riêng cho Nova Valkyrie trước khi lên Play.
- E1–E5 ở trên.

## 6. Đề xuất thứ tự sửa (bản gốc)

1. **D1, D2, D3, C6** — logic năng lượng / phần thưởng, ảnh hưởng người chơi thật.
2. **C1–C5** — nội dung sai tên game, sai phiên bản.
3. **B1–B17** — Việt hoá toàn bộ, gom chuỗi vào bảng dịch.
4. **A6 / D6** — sửa HUD boss đè.
5. **D4, D5** — thẻ drone khi chưa mở; làm kỹ năng triệu hồi boss trong trận.
6. **A1–A5** — làm đẹp các popup còn sơ sài.
