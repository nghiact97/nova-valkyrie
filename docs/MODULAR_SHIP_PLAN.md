# Tàu ghép module: trang bị hiện ngay trên máy bay

Hướng B (máy bay anime) đã chọn. Mục tiêu: mỗi món trang bị anh đeo (Pháo, Động cơ, Giáp, Lõi; bộ Vanguard / Aegis / Solar; độ hiếm) **hiện thành bộ phận thật trên máy bay**, giống bảng phác thảo tham khảo: thân chính + các module gắn vào.

## 1. Cấu tạo một tàu (vẽ chồng lớp trên canvas)

| Lớp (dưới → trên) | Đổi theo | Ghi chú |
|---|---|---|
| 1. Động cơ | ô **Động cơ** | 2 cụm phụt phía đuôi, lửa động cơ vẽ bằng code theo màu bộ |
| 2. Cánh / giáp cánh | ô **Giáp** | Giáp càng hiếm cánh càng dày, thêm tấm ốp |
| 3. Thân chính | Valkyrie (8 kiểu) | Buồng lái + biểu tượng riêng từng cô; luôn giữ |
| 4. Súng | ô **Pháo** | Gắn ở 2 điểm dưới cánh + mũi; Vanguard nòng dài, Aegis nòng đôi có khiên, Solar nòng tròn phát sáng |
| 5. Lõi | ô **Lõi** | Viên lõi phát sáng giữa thân, màu theo bộ |
| 6. Hiệu ứng | độ hiếm | Viền sáng / hạt lấp lánh cho Sử thi, Huyền thoại |

**Neo cố định:** mọi module vẽ trên cùng một lưới 512×512, chung tâm. Mỗi thân chính có 5 điểm neo cố định: mũi, 2 điểm dưới cánh, 2 điểm đuôi. Nhờ vậy module của bộ nào cũng lắp được vào thân nào.

**Màu theo bộ:**
- Vanguard: xanh cyan.
- Aegis: xanh lá.
- Solar: vàng cam.
- Thân chính giữ trắng.

## 2. Số lượng vẽ

- **Thân:** 8, mỗi Valkyrie một thân.
- **Module:** 3 bộ × 4 ô = 12 module, dùng chung cho mọi thân.
- **Độ hiếm:** cùng một module nhưng thêm chi tiết bằng code (viền, đèn, hạt). Không cần vẽ thêm.

Tổng cộng **20 tấm vẽ**, thay vì 8 × 81 tổ hợp.

## 3. Các bước

| Bước | Việc | Duyệt |
|---|---|---|
| 1 | **Bảng phác thảo nét (line-art) cho Kestrel**: thân trần, 3 kiểu Pháo, 3 Động cơ, 3 Giáp cánh, 3 Lõi; nhìn từ trên + nhìn ngang, giống ảnh tham khảo | Anh duyệt hình khối |
| 2 | Tô màu bản đã duyệt theo phong cách anime (trắng + đèn màu bộ), tách từng module PNG cùng lưới | Anh duyệt màu |
| 3 | Code ghép lớp: thay `ship_kestrel` bằng hàm vẽ theo trang bị đang mặc; dùng cả ở Xưởng (tab Trang bị) và trong trận | Xem trên mockup |
| 4 | Vẽ 7 thân còn lại theo cùng lưới | |
| 5 | Build APK | |
