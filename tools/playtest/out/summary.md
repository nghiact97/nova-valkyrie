# Playtest người chơi mới — Nova Valkyrie

## Phương pháp
- Viewport Android: 412×915; save được xóa trước khi mở game; không bỏ tutorial.
- Game loop được tăng **2×** bằng cách tăng timestamp của requestAnimationFrame; thao tác UI, AI địch, cooldown và kinh tế vẫn chạy qua logic game.
- Thời lượng mô phỏng: Ngày 1 khoảng 30 phút; Ngày 2 và 3 khoảng 15 phút/ngày. Đồng hồ Date được dịch +24 giờ mỗi ngày.
- Lối chơi: tự động chọn điểm an toàn dựa trên B.p/B.eb/B.en, chọn thẻ lên cấp, dùng ULT khi đầy, khiên lúc HP thấp và bomb khi màn đạn dày. Không mua bằng tiền/gem.
- Quảng cáo thưởng đã xem: **1**; prompt quảng cáo ghi nhận: **6**. Ảnh chụp: **9/12**.

## Kết quả chính
- Vào trận đầu sau **N/A phút**; kết quả đầu: **win** ở 1-1.
- Tổng stage thắng: **3**; thua: **3**; tiến độ cuối: **3 stage**.
- Số dư cuối: **20032 coin / 985 gem / 28/30 energy**.

## Kết quả từng stage
- Ngày 1, phút 2.9: Stage 1-1 — **WIN**, score 3818, kill 21, HP 3; sau trận 3627 coin, 125 gem, 30 energy.
- Ngày 1, phút 5.4: Stage 1-2 — **WIN**, score 6646, kill 34, HP 2; sau trận 3375 coin, 130 gem, 30 energy.
- Ngày 1, phút 7.9: Stage 1-3 — **WIN**, score 7825, kill 38, HP 4; sau trận 2276 coin, 135 gem, 30 energy.
- Ngày 1, phút 10.4: Stage 1-4 — **LOSS**, score 6443, kill 18, HP 0; sau trận 685 coin, 135 gem, 28 energy.
- Ngày 2, phút 33.7: Stage 1-4 — **LOSS**, score 2604, kill 17, HP 0; sau trận 20793 coin, 955 gem, 27 energy.
- Ngày 3, phút 48.7: Stage 1-4 — **LOSS**, score 2465, kill 17, HP 0; sau trận 19732 coin, 985 gem, 27 energy.

## Theo ngày
- Ngày 1: kết thúc với 3 stage đã clear; 685 coin, 135 gem, 28 energy.
- Ngày 2: kết thúc với 3 stage đã clear; 18633 coin, 955 gem, 28 energy.
- Ngày 3: kết thúc với 3 stage đã clear; 20032 coin, 985 gem, 28 energy.

## Năng lượng, chờ và điểm kẹt
- Ngày 1, phút 10.4: kẹt Stage 1-4: defeat despite active dodging; upgrade currency/gear insufficient
- Ngày 2, phút 33.7: kẹt Stage 1-4: defeat despite active dodging; upgrade currency/gear insufficient
- Ngày 3, phút 48.7: kẹt Stage 1-4: defeat despite active dodging; upgrade currency/gear insufficient
- Không chạm energy-out trong khung 3 phiên; đây là dấu hiệu nhịp đầu game khá rộng.

## Coin/gem so với chi phí nâng cấp
- Ngày 1, phút 2.9: 4254 coin; nâng tàu Lv1 giá 300 — đủ.
- Ngày 1, phút 2.9: 3954 coin; nâng tàu Lv2 giá 380 — đủ.
- Ngày 1, phút 2.9: 3574 coin; nâng tàu Lv3 giá 490 — đủ.
- Ngày 1, phút 2.9: 3084 coin; nâng tàu Lv4 giá 630 — đủ.
- Ngày 1, phút 5.4: 4475 coin; nâng tàu Lv5 giá 810 — đủ.
- Ngày 1, phút 5.4: 3665 coin; nâng tàu Lv6 giá 1030 — đủ.
- Ngày 1, phút 5.4: 2635 coin; nâng tàu Lv7 giá 1320 — đủ.
- Ngày 1, phút 5.4: 1315 coin; nâng tàu Lv8 giá 1690 — thiếu.
- Ngày 1, phút 7.9: 2276 coin; nâng tàu Lv8 giá 1690 — đủ.
- Ngày 1, phút 7.9: 586 coin; nâng tàu Lv9 giá 2160 — thiếu.
- Ngày 1, phút 10.4: 685 coin; nâng tàu Lv9 giá 2160 — thiếu.
- Ngày 2, phút 33.7: 20793 coin; nâng tàu Lv9 giá 2160 — đủ.
- Ngày 2, phút 33.7: 18633 coin; nâng tàu Lv10 giá 2770 — đủ.
- Ngày 3, phút 48.7: 20032 coin; nâng tàu Lv10 giá 2770 — đủ.

## Mở khóa tính năng
- Sau clear 1 stage: Quests.
- Sau clear 2 stage: Hangar + Shop.
- Sau clear 3 stage: Skills + Spin + Online Gift + Offer.

## Offer/shop popup
- Không chủ động mở shop trả phí; không có popup bán hàng tự bật được ghi nhận trong lộ trình này.

## Prompt quảng cáo thưởng
- Ngày 1, phút 0: daily x2 — DAILY LOGIN / 7-DAY CHECK-IN / ✕ / Day 1 / 500 coins / Day 2 / 20 gems / Day 3 / 1,000 coins / Day 4 / 2× Shield / Day 5 / 2,000 coins / Day 6 / 50 gems / Day 7 / 150 gems + crate / CLAIM / ▶ CLAIM ×2.
- Ngày 1, phút 2.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,254.
- Ngày 1, phút 5.4: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,842.
- Ngày 1, phút 7.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,922.
- Ngày 2, phút 30: daily x2 — DAILY LOGIN / 7-DAY CHECK-IN / ✕ / Day 1 / 500 coins / Day 2 / 20 gems / Day 3 / 1,000 coins / Day 4 / 2× Shield / Day 5 / 2,000 coins / Day 6 / 50 gems / Day 7 / 150 gems + crate / CLAIM / ▶ CLAIM ×2.
- Ngày 3, phút 45: daily x2 — DAILY LOGIN / 7-DAY CHECK-IN / ✕ / Day 1 / 500 coins / Day 2 / 20 gems / Day 3 / 1,000 coins / Day 4 / 2× Shield / Day 5 / 2,000 coins / Day 6 / 50 gems / Day 7 / 150 gems + crate / CLAIM / ▶ CLAIM ×2.

## Phần thưởng mỗi phiên
- Ngày 1: biến động quan sát được đến cuối phiên: -1815 coin, 15 gem; clear 3 stage.
- Ngày 2: biến động quan sát được đến cuối phiên: 17948 coin, 820 gem; clear 0 stage.
- Ngày 3: biến động quan sát được đến cuối phiên: 1399 coin, 30 gem; clear 0 stage.

## 10 khoảnh khắc then chốt
1. Tutorial bắt buộc dẫn thẳng tới sortie đầu, giúp mục tiêu ban đầu rõ.
2. Điều khiển kéo né đạn phản hồi dễ hiểu ở màn 412×915.
3. Thẻ level-up thường xuyên ngắt nhịp nhưng cho quyết định build có ý nghĩa.
4. ULT tạo cao trào rõ khi thanh đầy.
5. Khiên/bomb miễn phí mỗi stage giảm cảm giác bị ép mua ngay.
6. Victory popup đặt nút quảng cáo ×2 coin nổi bật hơn Home/Next.
7. Mở khóa theo từng stage tạo chuỗi mục tiêu ngắn liên tục.
8. Chi phí nâng tàu tăng nhanh, buộc quay lại Hangar giữa các trận.
9. Free Spin tạo nhịp thưởng tốt nhưng đặt cạnh lượt ad và lượt gem.
10. Energy chưa chặn sớm trong phiên thử này; áp lực trả tiền chủ yếu đến từ tăng sức mạnh và nhân đôi thưởng.

## Friction points
- Popup tutorial/mở khóa nối tiếp có thể làm người chơi muốn vào trận nhanh thấy bị cắt nhịp.
- Level-up overlay xuất hiện giữa combat; nếu đang né dày, chuyển ngữ cảnh liên tục gây mệt.
- Nhiều tab mở khóa trong vài stage đầu tạo tải nhận thức cao.
- Khi thua, lời khuyên nâng cấp chung chung; người chơi chưa chắc biết nâng tàu, gear hay pilot hiệu quả nhất.
- Energy là giới hạn cứng 5/lượt; khi hết chỉ còn đợi hoặc tìm nguồn hồi.

## Pay points
- Victory: quảng cáo thưởng ×2 coin ngay trên hành động rời màn.
- Daily Login: quảng cáo để nhận ×2.
- Lucky Spin: lượt miễn phí nằm cạnh lượt quảng cáo và lượt 30 gem.
- Shop/offer mở sớm sau Stage 1-2/1-3, đúng lúc chi phí nâng cấp bắt đầu tăng.
- Khi thiếu coin/gem, các nút upgrade/spin vẫn hiển thị giá, tạo áp lực chuyển sang shop.

## Kết luận
Vòng lặp chiến đấu–thưởng–nâng cấp có lực kéo tốt; điểm rời game có khả năng cao nhất là chuỗi popup dày hoặc lần thua đầu khi chi phí nâng cấp vượt số dư. Timeline JSONL là nguồn chi tiết cho mọi mốc và số dư.
