# Nova Valkyrie — Kế hoạch sửa sau rà soát (02/11/2026)

Nguồn: `review/report.md` (điểm 4,9/10), `review/inventory.md`, `review/market.md`, `tools/playtest/out/summary.md`.
Cách làm theo `CLAUDE.md`: mỗi việc là một nhánh `task/<tên>`, phạm vi code lấy bằng Graphify, vẽ giao cho Codex, có tiêu chí "xong", chạy lại playtest sau mỗi đợt.

## Đợt 0 — Sửa công cụ đo (làm trước, rẻ)
| # | Việc | Ai | Xong khi |
|---|---|---|---|
| 0.1 | Sửa `tools/playtest/newplayer.mjs`: giữ save khi chuyển ngày (chỉ dịch đồng hồ, không xoá localStorage); tự mở Chrome cổng 9223 | Codex | Ngày 2 chơi tiếp từ màn đã đạt, không nâng lại từ cấp 1 |
| 0.2 | Playtest in thêm: lần đầu thua, thời gian tới "tường" xu, số chào bán hiện ra, số quảng cáo mời | Codex | `summary.md` có đủ 4 số này cho 3 ngày |

## Đợt 1 — Chặn phát hành và đo được người thật (bắt buộc trước khi chạy thử)
| # | Việc | Ai / mức | Xong khi |
|---|---|---|---|
| 1.1 | Firebase Analytics + Crashlytics; sự kiện phễu: mở app, trận đầu, thắng/thua từng màn, mở khoá, xem quảng cáo, mở shop, mua | Agent, xhigh | Thấy sự kiện trong DebugView từ máy A13 |
| 1.2 | AdMob ID thật + `app-ads.txt` + hộp đồng ý UMP | Agent, thường | Quảng cáo thưởng thật hiện trên A13, có doanh thu thử |
| 1.3 | VIP: bỏ khỏi shop hoặc làm thuê bao thật qua Play Billing | Agent, thường | Không còn nút mua nào chỉ đặt cờ trên máy |
| 1.4 | Trang chính sách/điều khoản riêng cho Nova Valkyrie; sửa link trong Cài đặt; khai lại An toàn dữ liệu | Em + anh (trang web) | Link mở đúng trang Nova Valkyrie |
| 1.5 | Đồng bộ phiên bản (APP_VER = versionName), AAB đã ký, đưa lên kênh thử nghiệm nội bộ | Agent, thường | Cài được từ Play Console internal |
| 1.6 | Vẽ lại Mika, tách Raika khỏi Mika (giữ bộ khung đã duyệt, chỉ đổi thiết kế mặt/tóc/giáp) | Codex | Anh duyệt; không còn giống Skysaber |

## Đợt 2 — Giữ chân (sửa "tường" phút 10 mà playtest thấy)
| # | Việc | Ai / mức | Xong khi |
|---|---|---|---|
| 2.1 | Màn thua có **gợi ý cụ thể**: tính phần thiếu (cấp phi công / trang bị / pet) và nút đưa thẳng tới chỗ nâng | Agent, thường | Playtest: sau lần thua đầu bot đi đúng chỗ gợi ý và qua màn |
| 2.2 | Cân lại đường tiền: xu thưởng 1-4…1-10 và giá cấp 8–12 để "tường" đến ở khoảng phút 15–20, không phải phút 8 | Agent, xhigh (dùng playtest đo) | Playtest: lần thua đầu ở 1-6 trở đi |
| 2.3 | Năng lượng hồi 6 phút/điểm (thay 30 giây), tối đa 30; 3 màn đầu vẫn miễn phí | Agent, thường | Ngày 1 chơi ~20 phút thì hết năng lượng một lần |
| 2.4 | Nhiệm vụ chuỗi 7 ngày (mục tiêu mỗi ngày, quà lớn ngày 7) | Agent, thường | Hiện ở tab Nhiệm vụ, lưu tiến độ qua ngày |
| 2.5 | Thông báo đẩy cục bộ: năng lượng đầy, quà online, điểm danh | Agent, thường | Thông báo hiện trên A13 khi app tắt |
| 2.6 | Bớt popup dồn dập ở 3 màn đầu (gộp các mở khoá vào 1 dialog) | Em, thường | Tối đa 1 popup giữa 2 trận |

## Đợt 3 — Kiếm tiền
| # | Việc | Ai / mức | Xong khi |
|---|---|---|---|
| 3.1 | Chào bán **đúng lúc**: sau lần thua đầu → Starter $1,99; khi thiếu xu nâng cấp → gói xu/quảng cáo bù phần thiếu; tối đa 1 lần/phiên | Agent, thường | Playtest ghi được ≥1 chào bán/ngày, không quá 2 |
| 3.2 | Banner Valkyrie: rương ngẫu nhiên thật, bảo hiểm 50 lượt, trùng → mảnh nâng sao; công bố tỷ lệ | Agent, xhigh | Mở banner thấy tỷ lệ; trùng nhân vật ra mảnh |
| 3.3 | Battle pass 30 ngày ($4,99) qua Billing thật, nhiệm vụ pass | Agent, xhigh | Mua thử bằng tài khoản test Play |
| 3.4 | Quảng cáo xen kẽ nhẹ từ màn 1-6, tối đa 1 lần/3 trận, không chen giữa trận | Agent, thường | Đúng tần suất trong playtest |
| 3.5 | Bảng xếp hạng: ghi rõ "offline/bot" hoặc tắt cho tới khi có máy chủ | Em, thường | Không còn bảng xếp hạng giả như thật |

## Đợt 4 — Kiểm tra lại rồi chạy thử
| # | Việc | Xong khi |
|---|---|---|
| 4.1 | Chạy lại playtest 3 ngày + rà soát lại (Codex kiểm kê lại, cập nhật `report.md`) | Điểm ≥ 6,5/10; lần thua đầu sau màn 1-6; ≥1 chào bán/ngày |
| 4.2 | Chạy thử VN + Philippines, $500–1.000, 1.500–3.000 lượt cài, 3–4 tuần (ngưỡng trong `report.md` §8) | D1 ≥ 35%, D7 ≥ 12%, ARPDAU ≥ $0,20 → tăng tốc; trượt → quay lại đợt 2/3 |

## Thứ tự và chi phí
- Đợt 0 → 1 → 2 → 3 → 4. Trong mỗi đợt, việc không đụng nhau chạy song song (worktree riêng).
- Vẽ (1.6, art banner) → Codex trực tiếp. Code nhiều logic (1.1, 2.2, 3.2, 3.3) → agent xhigh. Còn lại → agent mức thường hoặc em.
- Sau mỗi đợt: dựng lại Graphify, kiểm tra `affected`, chạy playtest, build APK gửi Telegram, gắn tag.

## Cần anh quyết
1. VIP: bỏ hẳn, hay làm thuê bao thật?
2. Năng lượng 6 phút/điểm có chấp nhận được không (hay 4–5 phút)?
3. Ai làm trang chính sách: em tạo trang tĩnh (GitHub Pages của repo) được không?
