# Kế hoạch thiết kế trang bị hiện trên máy bay

Nền đã có: 8 thân máy bay đã tô màu (`art/anime/ships/mod/hull_*.png`, cùng khung 1024, cùng tâm) và bản thử ghép trên Kestrel (`modship` trong mockup). Kế hoạch này nâng lên thành hệ thống trang bị đầy đủ: **đổi súng / động cơ / giáp / lõi là máy bay đổi theo**, và **súng khác nhau thì bắn khác nhau**.

## 1. Vấn đề cần giải quyết

- 8 thân có sải cánh khác nhau. Viper, Halo và Seraph hẹp, Kestrel và Raptor rộng.
- Bộ phận vẽ theo Kestrel thì khi lắp lên thân hẹp, súng đầu cánh lơ lửng ngoài cánh.
- **Cách giải:**
  - Tách mỗi bộ phận thành **mảnh nhỏ theo từng điểm gắn**.
  - Mỗi thân tự khai báo **toạ độ điểm gắn** của nó.
  - Code đặt từng mảnh vào đúng điểm của thân đang dùng.

## 2. Điểm gắn của mỗi thân (6 điểm)

| Điểm | Gắn gì |
|---|---|
| `nose` | Súng chính |
| `wingL`, `wingR` | Súng phụ hai cánh (đối xứng) |
| `spine` | Lõi |
| `tailL`, `tailR` | Động cơ (đối xứng) |
| *(cả cánh)* | Giáp cánh: vẽ riêng theo dáng từng thân, hoặc dùng tấm ốp nhỏ gắn ở `wingL/R` |

- Toạ độ lưu trong `SHIP_MOUNTS = {kestrel:{nose:[512,120], wingL:[70,640], …}, …}`, đo một lần cho mỗi thân (em đo bằng script và kiểm tra bằng ảnh).
- Mỗi điểm có thêm `scale`, vì thân hẹp thì súng đầu cánh nhỏ lại một chút.

## 3. Loại trang bị

### 3.1 Súng (ô Pháo): đổi hình + đổi kiểu bắn

| Loại | Hình trên máy bay | Kiểu đạn (từ bộ 9 hiệu ứng đạn) | Đặc tính |
|---|---|---|---|
| Súng máy | Nòng ngắn, nhiều nòng xoay | Sao Xuyên nhỏ, bắn rất nhanh | Tốc độ bắn cao, sát thương thấp |
| Laser | Nòng dài mảnh có vòng phát | Giáo Laser | Xuyên mục tiêu |
| Tên lửa | Ống phóng đôi | Tên Lửa Đỏ, có đuổi mục tiêu | Chậm, nổ lan |
| Plasma | Nòng tròn có lõi sáng | Plasma Tím | Viên to, sát thương cao |
| Mặt trời | Vòng phát xạ vàng | Pháo Mặt Trời | Cháy lan |
| Băng | Nòng tinh thể | Mảnh Băng | Làm chậm địch |

Ba bộ hiện có (Vanguard / Aegis / Solar) giữ vai trò **bộ trang bị** cho chỉ số và hiệu ứng bộ 2/4 món. **Loại súng** là thuộc tính mới của món Pháo. Ví dụ: "Laser Vanguard", "Súng máy Aegis".

### 3.2 Động cơ

- Hình cụm phụt ở hai điểm `tail`.
- Màu và độ dài lửa động cơ vẽ bằng code theo bộ và độ hiếm.
- Có thể thêm loại: "phản lực" (lửa dài, +tốc độ) và "ion" (lửa xanh, +né).

### 3.3 Giáp

- Tấm ốp gắn ở 2 cánh. Độ hiếm cao thì tấm dày hơn và có viền phát sáng.
- Thân rộng dùng tấm lớn, thân hẹp dùng tấm nhỏ, khai báo theo thân.

### 3.4 Lõi

- Viên lõi ở điểm `spine`, có hiệu ứng thở sáng (vẽ bằng code).
- Màu theo bộ. Huyền thoại có hạt lấp lánh bay quanh.

### 3.5 Độ hiếm

| Độ hiếm | Hiệu ứng thêm (code) |
|---|---|
| Thường | Không |
| Hiếm | Đường sáng xanh trên bộ phận |
| Sử thi | Viền sáng tím |
| Huyền thoại | Viền sáng cam + hạt lấp lánh + lửa động cơ dài hơn |

## 4. Số tấm cần vẽ

| Nhóm | Số tấm | Ghi chú |
|---|---|---|
| Súng chính (`nose`) | 6 loại | Dùng chung mọi thân |
| Súng phụ (`wing`) | 6 loại | Vẽ 1 bên, bên kia lật gương |
| Động cơ (`tail`) | 3 bộ | Vẽ 1 bên, lật gương |
| Lõi (`spine`) | 3 bộ | |
| Giáp cánh | 3 bộ × 2 cỡ (rộng / hẹp) | Lật gương |

Tổng khoảng **24 tấm nhỏ**. Mọi tấm vẽ ở dạng "một mảnh, tâm ở điểm gắn", nên dễ thêm loại mới về sau.

## 5. Dữ liệu và code

- Món trang bị thêm trường `type` (vd. `cannon` có `type:"laser"`). Đồ cũ chưa có `type` thì mặc định theo bộ: Vanguard là laser, Aegis là súng máy, Solar là mặt trời.
- `drawShip(ship, gear)`:
  - Ghép thân + mảnh theo `SHIP_MOUNTS`, lưu sẵn thành ảnh khi đổi trang bị (như `modship` hiện tại).
  - Dùng chung cho Xưởng, Hồ sơ và trong trận.
- `fire()` đọc `type` của Pháo đang đeo để chọn kiểu đạn và nhịp bắn. Kiểu đạn của từng Valkyrie (đã làm) là mặc định khi chưa đeo pháo.
- Tab Trang bị:
  - Popup món đồ ghi rõ loại súng và hiệu ứng.
  - Bấm vào món đồ thì máy bay ở giữa xem trước ngay.
- Máy bay trong trận phóng to khoảng 40% để thấy rõ bộ phận.

## 6. Chia việc (agent + worktree)

| Task | Nhánh | Việc | Mức |
|---|---|---|---|
| T1 | `task/mounts` | Đo 6 điểm gắn cho 8 thân → `SHIP_MOUNTS` + ảnh kiểm tra từng thân | thường |
| T2 | `task/parts-guns` | Vẽ 12 tấm súng (6 chính + 6 phụ) theo dạng mảnh | thường (Codex) |
| T3 | `task/parts-body` | Vẽ động cơ, lõi, giáp (12 tấm) | thường (Codex) |
| T4 | `task/gear-code` | Code ghép theo điểm gắn, trường `type`, kiểu đạn theo súng, xem trước trong Xưởng, phóng to trong trận | **xhigh** (đụng logic bắn + lưu dữ liệu) |
| T5 | main | Gộp, chụp so sánh, build APK | em |

T1, T2 và T3 chạy song song. T4 bắt đầu khi có T1 (dùng ảnh tạm cho đến khi có T2 và T3).

## 7. Cần anh quyết

1. Danh sách 6 loại súng ở mục 3.1 đã đủ chưa, có muốn thêm hoặc bớt loại nào?
2. Đồ cũ của người chơi gán loại súng mặc định theo bộ như mục 5 có được không?
