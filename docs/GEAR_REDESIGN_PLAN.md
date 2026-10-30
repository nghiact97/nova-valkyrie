# Thiết kế lại hệ thống trang bị cho khớp với máy bay ghép module

Đi kèm `docs/GEAR_VISUAL_PLAN.md` (phần hình trên máy bay). File này là phần **món đồ**: dữ liệu, icon, tên, chỉ số, cách có được và giao diện. Mục tiêu: món đồ trong túi đồ **trông giống đúng bộ phận** sẽ gắn lên máy bay, và mỗi món có lý do để người chơi muốn có.

Hai điểm chưa chốt ở kế hoạch trước em lấy theo đề xuất:
- giữ 6 loại súng;
- đồ cũ chưa có loại súng thì gán theo bộ: Vanguard là Laser, Aegis là Súng máy, Solar là Mặt trời.

## 1. Hiện trạng (bản gốc)

| Thành phần | Hiện tại | Vấn đề |
|---|---|---|
| Ô | Pháo / Động cơ / Giáp / Lõi | Giữ |
| Bộ | Vanguard / Aegis / Solar, bonus 2 và 4 món | Giữ, nhưng thêm loại cho Pháo |
| Độ hiếm | Thường / Hiếm / Sử thi / Huyền thoại, Lv 1–10, ghép 3 món lên 1 bậc, phân rã ra Hợp kim | Giữ |
| Chỉ số | Mỗi ô 1 chỉ số chính (Pháo: +% sát thương, Động cơ: +% tốc bắn, Giáp: +máu, Lõi: −% hồi chiêu và +% XP) | Đơn điệu, không gắn với kiểu chơi |
| Icon | Ảnh 3D cũ (`gear_<bộ>_<ô>`), không giống bộ phận trên máy bay | **Phải làm lại** |

## 2. Món đồ mới

### 2.1 Cấu trúc dữ liệu

```
{uid, slot, set, type, rar, lv}
```

`type` chỉ có ở một số ô:

| Ô | Có `type`? | Các loại |
|---|---|---|
| Pháo | Có | `mg` súng máy, `laser`, `missile` tên lửa, `plasma`, `solar` mặt trời, `frost` băng |
| Động cơ | Có | `jet` phản lực, `ion` |
| Giáp | Không | |
| Lõi | Không | |

Đồ cũ chưa có `type` được gán khi tải save: Pháo theo bộ như trên, Động cơ mặc định `jet`.

### 2.2 Chỉ số

Mỗi món có **chỉ số chính** theo ô và độ hiếm, tăng theo Lv. Pháo có thêm **đặc tính theo loại**:

| Loại pháo | Chỉ số chính | Đặc tính riêng |
|---|---|---|
| Súng máy | +% sát thương | +40% tốc độ bắn, đạn nhỏ |
| Laser | +% sát thương | Xuyên 1 mục tiêu |
| Tên lửa | +% sát thương | Đuổi mục tiêu, nổ lan nhỏ |
| Plasma | +% sát thương | Viên to, +25% sát thương mỗi viên, bắn chậm hơn |
| Mặt trời | +% sát thương | Cháy: gây thêm sát thương theo thời gian |
| Băng | +% sát thương | Làm chậm địch 1 giây |

| Ô | Chỉ số chính | Đặc tính theo loại |
|---|---|---|
| Động cơ | +% tốc độ bắn | Phản lực: +tốc độ di chuyển · Ion: +thời gian bất tử sau khi trúng đạn |
| Giáp | +máu tối đa | Huyền thoại: +1 khiên đầu trận |
| Lõi | −% hồi chiêu · +% XP | Sử thi trở lên: tuyệt chiêu nạp nhanh hơn |

Bonus bộ 2 và 4 món giữ như cũ.

### 2.3 Tên món đồ

Tên ghép theo mẫu **[Loại] [Bộ]**, ví dụ:
- "Laser Vanguard"
- "Súng máy Aegis"
- "Động cơ Ion Solar"
- "Giáp Aegis"
- "Lõi Solar"

Có bản tiếng Việt và tiếng Anh. Món Huyền thoại có thêm biệt danh, ví dụ "Laser Vanguard · Thương Bạc".

## 3. Icon món đồ (làm lại toàn bộ)

- **Hình:** chính là **mảnh bộ phận** sẽ gắn lên máy bay (tấm vẽ ở `GEAR_VISUAL_PLAN` mục 4), đặt nghiêng 3/4 trên **khung độ hiếm** Valkyrie (khung kim cương, viền màu độ hiếm, góc dưới có huy hiệu bộ).
- **Không vẽ riêng icon:** code dựng icon từ tấm bộ phận + khung, lưu sẵn thành ảnh. Nhờ đó icon và máy bay luôn khớp nhau.
- **Góc icon hiển thị:**
  - Lv (góc trái dưới);
  - biểu tượng loại súng (góc phải trên): ⦿ plasma, ≡ súng máy, ┃ laser, ➶ tên lửa, ☀ mặt trời, ❄ băng. Dùng icon mono trắng vẽ theo mẫu `ICON_MONO_FORM`.
- **Ảnh cũ** `gear_*` cất vào `rejected/`.

## 4. Giao diện

| Chỗ | Thay đổi |
|---|---|
| Xưởng · tab Trang bị | Máy bay ở giữa là **máy bay ghép thật**. Bấm một món trong túi thì máy bay **xem trước** món đó (có viền nháy), bấm Trang bị mới lưu. 4 ô hai bên hiện icon mới |
| Lọc túi đồ | Thêm bộ lọc theo **loại súng** khi chọn ô Pháo |
| Popup món đồ | Ảnh bộ phận to + tên mới + chỉ số chính + **đặc tính loại** + bonus bộ + so sánh với món đang đeo (▲▼). Giữ các nút Trang bị / Nâng cấp / Ghép / Phân rã |
| Kết quả trận / mở rương / vòng quay | Dùng icon mới và tên mới |
| Hồ sơ | Ảnh máy bay ghép thật |
| Trong trận | Máy bay phóng to ~40%, đạn đổi theo loại súng (dùng 9 hiệu ứng đạn) |

## 5. Cách có được đồ

Giữ nguồn hiện tại:
- boss rơi (đồ đầu tiên ở màn 1-5 theo hướng dẫn);
- elite rơi;
- vòng quay huyền thoại;
- vòng quay vàng;
- rương.

Thêm quy tắc:
- **Loại súng theo chương:** chương 1 rơi chủ yếu Súng máy và Laser, chương 2 thêm Tên lửa, chương 3 thêm Plasma và Băng, chương 4 thêm Mặt trời. Người chơi mới có nhiều kiểu để mở dần.
- **Vòng quay huyền thoại:** bảo đảm ra Pháo Huyền thoại ở lượt bảo hiểm thứ 30 (giữ như cũ), người chơi được chọn loại súng.

## 6. Cân bằng

- Tổng sát thương giữa các loại súng tương đương nhau (sai lệch dưới 10% theo thử nghiệm bot), chỉ khác kiểu chơi.
- Em viết script bot bắn 60 giây trên màn 1-5, 2-5, 3-5 với từng loại để đo và chỉnh hệ số.

## 7. Chia việc (agent + worktree)

| Task | Nhánh | Việc | Mức |
|---|---|---|---|
| G1 | `task/gear-data` | Dữ liệu mới (`type`, tên, đặc tính), chuyển đổi save cũ, rơi đồ theo chương | **xhigh** (lưu dữ liệu + cân bằng) |
| G2 | `task/gear-icons` | Code dựng icon từ tấm bộ phận + khung độ hiếm + biểu tượng loại; 8 icon loại súng mono (Codex) | thường |
| G3 | `task/gear-ui` | Tab Trang bị: xem trước trên máy bay, bộ lọc loại, popup mới; kết quả trận, rương, vòng quay dùng icon mới | thường |
| G4 | `task/gear-fire` | Đạn theo loại súng + đặc tính (xuyên, cháy, chậm, nổ lan…), phóng to máy bay trong trận | **xhigh** |
| G5 | `task/gear-balance` | Bot đo sát thương từng loại, chỉnh hệ số | thường |
| G6 | main | Gộp, chụp so sánh, kiểm tra 2 ngôn ngữ, build APK | em |

**Thứ tự:**
1. Làm trước phần hình trên máy bay (T1–T3 của `GEAR_VISUAL_PLAN`).
2. Song song với đó chạy G1 và G2.
3. Khi đã có tấm bộ phận thì chạy G3 và G4.
4. Cuối cùng chạy G5, rồi G6.
