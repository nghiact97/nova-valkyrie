# Nova Valkyrie: kế hoạch thiết kế lại toàn bộ dialog

Ngày lập: 29/10/2026. Áp dụng cho bản anime (`nova_vanguard_anime`).

## 1. Hiện trạng

- 22 dialog, tất cả đi qua một hàm `pop(title, html, cls)` (`src/game.html`), dùng chung class `.pop`. Mỗi lần chỉ hiện một popup; popup tiếp theo xếp hàng chờ (`popQueue`).
- Khung cũ là kiểu "casual": thẻ bo tròn 22px, gradient tím–xanh, tiêu đề là viên thuốc cyan nằm giữa, nút X tròn, nút bấm bo tròn kiểu kẹo (vàng/xanh/hồng).
- Kiểu này không hợp với khung UI "Valkyrie" mới của Home (kính tối, cạnh vát, chữ nghiêng Saira, nhấn hồng–cyan).

## 2. Nguyên tắc

1. **Một khung duy nhất** cho mọi dialog. Các biến thể chỉ đổi màu nhấn và phần đầu, không đổi hình khung.
2. **Cùng ngôn ngữ với Home:** kính tối, góc vát chéo, viền trắng mảnh có ngoặc góc, chữ Saira Condensed nghiêng, hồng = hành động chính, cyan = thông tin, vàng = phần thưởng.
3. **Có nhân vật:** các dialog "cảm xúc" (thưởng, thắng/thua, hồi sinh, chào ngày mới) có bán thân Mika ló ra cạnh khung kèm một câu thoại. Đây là thứ làm game "ra chất anime".
4. **Mỗi lúc một dialog**, giữ cơ chế hàng chờ hiện có.
5. Hiệu ứng mở/đóng luôn chạy. Không tắt theo `prefers-reduced-motion`, vì máy test báo sai cờ này.

## 3. Cấu tạo khung chuẩn

```
 ◤▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀◇ ← nút đóng hình kim cương
  ▌DAILY LOGIN ▶   ── điểm danh 7 ngày          ← (A) tấm tiêu đề nghiêng, sát trái, sọc hồng
  ┌                                       ┐
                                                  ← (B) thân: nền kính #0a1030 ~92%, lưới mờ
       nội dung                                         ngoặc góc trắng ở 4 góc
  └                                       ┘
     ▰▰▰ HUỶ ▰▰▰        ▰▰▰ NHẬN ▰▰▰             ← (C) dải nút: nút hình bình hành
 ◣▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄◢    vạch hồng ở cạnh dưới
```

| Phần | Thiết kế |
|---|---|
| Khung | rộng `min(360px, 100%-24px)`, vát góc trên-trái và dưới-phải 16px (`clip-path`), viền trắng 1px 50%, vạch hồng 3px ở cạnh dưới, bóng đổ tối |
| (A) Tiêu đề | tấm nghiêng `skewX(-12deg)` sát mép trái, chữ Saira 22px in hoa nghiêng; bên phải là dòng phụ nhỏ màu cyan (mô tả 1 câu, có bản VI) |
| Nút đóng | hình kim cương 34px ở góc trên phải, viền trắng, dấu × mảnh |
| (B) Thân | nền kính tối + lưới chấm rất mờ; thẻ con bên trong (ô thưởng, ô ngày…) dùng cùng kiểu vát góc nhỏ 8px |
| (C) Nút | hình bình hành nghiêng, chữ thẳng. **Chính** = hồng đặc; **Nhận thưởng** = vàng đặc; **Phụ** = viền cyan, nền trong; **Huỷ** = chữ mờ, không nền. Nút xem quảng cáo có tag ▶ nhỏ |
| Nền sau | phủ tối 70% + làm mờ nhẹ (blur 3px) cảnh phía sau |
| Mở | khung trượt từ phải 24px + mờ dần (0.22s); tiêu đề trượt vào trễ 60ms; các ô thưởng nảy lần lượt |
| Đóng | mờ dần 0.15s |

### Biến thể

| Biến thể | Khác khung chuẩn ở đâu | Dùng cho |
|---|---|---|
| **Chuẩn** | — | danh sách, thông tin, cài đặt |
| **Thưởng** | vạch dưới + tiêu đề màu vàng, tia sáng xoay sau ô thưởng, Mika ló bên trái (mặt vui) | nhận quà, mở hòm, kết quả quay |
| **Xác nhận** | khung nhỏ (300px), không lưới, 2 nút | thoát, bỏ trận, xoá dữ liệu |
| **Cảnh báo** | vạch dưới + tiêu đề màu đỏ `#ff5164`, Mika mặt lo lắng | hết năng lượng, hồi sinh, thua |
| **Toàn màn** | không khung; dải chéo xuyên màn hình + nhân vật lớn | Thắng/Thua, kết quả quay Huyền thoại |

## 4. Danh sách 22 dialog

| # | Dialog | Hàm / dòng | Biến thể | Thay đổi bố cục | Mika |
|---|---|---|---|---|---|
| 1 | Daily Login (điểm danh 7 ngày) | `POPS.daily` | Thưởng | 7 ô vát góc; ngày 7 là thẻ lớn có hình nhân vật; ô hôm nay viền hồng nhấp nháy | vui: "Chào buổi sáng, chỉ huy!" |
| 2 | Online Gift | `POPS.online` | Chuẩn | thanh tiến trình nằm ngang dạng mốc thời gian thay cho lưới ô | — |
| 3 | Lucky Spin | `POPS.spin` | Chuẩn | vòng quay đổi màu trắng–cyan–hồng; nút giữa hình kim cương | — |
| 4 | Legendary Spin (gear) | `POPS.gearSpin` | Chuẩn | dòng "bảo hiểm" thành thanh tiến trình ngang | — |
| 5 | Kết quả quay / ×10 | dòng 2013 | Thưởng; **Toàn màn** nếu ra Huyền thoại | ô vật phẩm lật lần lượt | vui |
| 6 | Special Offer | `POPS.offer` | Chuẩn, nhấn vàng | bố cục banner: ảnh nhân vật L (Seraphina) bên phải, giá + nút bên trái | — (ảnh nhân vật đã là điểm nhấn) |
| 7 | Mailbox | `POPS.mail` | Chuẩn | danh sách thư dạng hàng vát góc, chấm hồng cho thư chưa đọc | — |
| 8 | Notices | `POPS.notice` | Chuẩn | tab tag màu thay cho thẻ khối | — |
| 9 | Energy | `POPS.energy` | Cảnh báo khi 0, Chuẩn khi còn | số năng lượng lớn ở giữa + đồng hồ hồi | lo lắng khi hết: "Hết năng lượng rồi…" |
| 10 | Nebula Event | `POPS.event` | Chuẩn | đầu dialog là banner ảnh sự kiện ngang | — |
| 11 | Stage info (trước trận) | dòng 1517 | Chuẩn | tiêu đề "STAGE 1-5", hàng sao, thưởng, nút XUẤT KÍCH hồng lớn | — |
| 12 | Mode info (Boss/Explore) | dòng 1536 | Chuẩn | như #11 | — |
| 13 | Chi tiết kỹ năng | dòng 1566 | Chuẩn | icon trái, chỉ số dạng bảng 2 cột | — |
| 14 | Chi tiết trang bị | dòng 1622 | Chuẩn | khung độ hiếm theo màu C/R/E/L | — |
| 15 | Mở hòm | dòng 1796 | Thưởng | hòm rung → mở → tia sáng → ô thưởng | vui |
| 16 | Quảng cáo (giả lập) | dòng 1802 | Chuẩn | giữ nguyên, chỉ đổi khung | — |
| 17 | Nhận thưởng / Thành công | `claimPop`, `claimFx` | Thưởng | ô thưởng lớn + tia sáng | vui |
| 18 | Xoá dữ liệu | dòng 1870 | Xác nhận (đỏ) | nút xoá màu đỏ | — |
| 19 | Tạm dừng | dòng 2721 | Chuẩn | nút lớn xếp dọc: Tiếp tục / Cài đặt / Bỏ trận | — |
| 20 | Bỏ trận? | dòng 2737 | Xác nhận | — | — |
| 21 | Hồi sinh? | dòng 2741 | Cảnh báo | đếm ngược trong vòng tròn hồng | lo lắng: "Đừng bỏ cuộc!" |
| 22 | Thắng / Thua | dòng 2764 | **Toàn màn** | dải chéo "VICTORY"/"DEFEAT", sao, thưởng, 2 nút | Thắng: ảnh đứng tạo dáng; Thua: mặt buồn |
| + | Thoát game | `tools/native.js` | Xác nhận | — | — |

## 5. Art cần vẽ (Codex)

| File | Mô tả | Dùng cho |
|---|---|---|
| `face_kestrel_happy.png` | bán thân Mika cười, nền trong | dialog Thưởng, Daily |
| `face_kestrel_worried.png` | bán thân Mika lo lắng | Cảnh báo, Hồi sinh, hết năng lượng |
| `face_kestrel_sad.png` | bán thân Mika buồn nhưng quyết tâm | Thua |
| `win_kestrel.png` | Mika tạo dáng chiến thắng (V-sign), toàn thân | Thắng |
| `offer_seraph.jpg` | banner Seraphina cho Special Offer | #6 |
| `daily_day7.png` | thẻ ngày 7: nhân vật bất kỳ cầm hộp quà | #1 |

Các phần còn lại (tia sáng, lưới, ngoặc góc, nút) đều vẽ bằng CSS, không cần ảnh. Khi có thêm nhân vật, bán thân trong dialog đổi theo nhân vật đang chọn.

## 6. Các bước làm

| Bước | Nội dung | Kết quả để anh duyệt |
|---|---|---|
| D1 | Khung chuẩn + bộ nút mới (ghi đè `.pop`, `.btn`); cả 22 dialog đổi theo ngay | **trang "Dialog gallery"** trong mockup: mở lần lượt từng dialog để xem |
| D2 | Biến thể Thưởng / Xác nhận / Cảnh báo + hiệu ứng mở/đóng | gallery cập nhật |
| D3 | Sửa bố cục riêng: Daily, Online, Spin, Offer, Stage info, Pause | ảnh chụp từng dialog |
| D4 | Codex vẽ 6 ảnh ở mục 5 → gắn Mika vào dialog | gallery cập nhật |
| D5 | Màn Thắng/Thua toàn màn + kết quả Huyền thoại | ảnh chụp |

## 7. Cần anh chốt

1. Có cho **Mika ló ra trong dialog** (mục 2.3) không? Nếu có thì cần 4 ảnh biểu cảm ở mục 5.
2. Tiêu đề dialog: **chữ Anh in hoa + dòng phụ tiếng Việt** (kiểu game gacha), hay chỉ một ngôn ngữ theo cài đặt?
3. Thắng/Thua: làm **toàn màn** như mục 3 hay vẫn là popup?
