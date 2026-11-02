# Playtest người chơi mới — Nova Valkyrie

## Phương pháp
- Viewport Android: 412×915; save được xóa trước khi mở game; không bỏ tutorial.
- Game loop được tăng **2×** bằng cách tăng timestamp của requestAnimationFrame; thao tác UI, AI địch, cooldown và kinh tế vẫn chạy qua logic game.
- Thời lượng mô phỏng: Ngày 1 khoảng 30 phút; Ngày 2 và 3 khoảng 15 phút/ngày. Đồng hồ Date được dịch +24 giờ mỗi ngày.
- Lối chơi: tự động chọn điểm an toàn dựa trên B.p/B.eb/B.en, chọn thẻ lên cấp, dùng ULT khi đầy, khiên lúc HP thấp và bomb khi màn đạn dày. Không mua bằng tiền/gem.
- Quảng cáo thưởng đã xem: **1**; prompt quảng cáo ghi nhận: **13**. Ảnh chụp: **6/12**.

## Kết quả chính
- Vào trận đầu sau **N/A phút**; kết quả đầu: **win** ở 1-1.
- Tổng stage thắng: **10**; thua: **2**; tiến độ cuối: **4 stage**.
- Số dư cuối: **1010 coin / 140 gem / 28/30 energy**.

## Kết quả từng stage
- Ngày 1, phút 2.9: Stage 1-1 — **WIN**, score 3754, kill 21, HP 2; sau trận 3531 coin, 125 gem, 30 energy.
- Ngày 1, phút 5.4: Stage 1-2 — **WIN**, score 6645, kill 34, HP 3; sau trận 3347 coin, 130 gem, 30 energy.
- Ngày 1, phút 7.9: Stage 1-3 — **WIN**, score 7819, kill 38, HP 3; sau trận 2270 coin, 135 gem, 30 energy.
- Ngày 1, phút 10.4: Stage 1-4 — **LOSS**, score 2588, kill 17, HP 0; sau trận 724 coin, 135 gem, 27 energy.
- Ngày 2, phút 32.9: Stage 1-1 — **WIN**, score 3864, kill 21, HP 2; sau trận 3696 coin, 125 gem, 30 energy.
- Ngày 2, phút 35.4: Stage 1-2 — **WIN**, score 6651, kill 34, HP 4; sau trận 2858 coin, 130 gem, 30 energy.
- Ngày 2, phút 37.9: Stage 1-3 — **WIN**, score 7753, kill 38, HP 2; sau trận 1759 coin, 135 gem, 30 energy.
- Ngày 2, phút 40.4: Stage 1-4 — **LOSS**, score 2457, kill 17, HP 0; sau trận 186 coin, 135 gem, 27 energy.
- Ngày 3, phút 47.9: Stage 1-1 — **WIN**, score 3836, kill 21, HP 2; sau trận 3654 coin, 125 gem, 30 energy.
- Ngày 3, phút 50.4: Stage 1-2 — **WIN**, score 6530, kill 34, HP 3; sau trận 2733 coin, 130 gem, 30 energy.
- Ngày 3, phút 52.9: Stage 1-3 — **WIN**, score 7746, kill 38, HP 2; sau trận 1568 coin, 135 gem, 30 energy.
- Ngày 3, phút 55.4: Stage 1-4 — **WIN**, score 12868, kill 41, HP 1; sau trận 2700 coin, 140 gem, 27 energy.

## Theo ngày
- Ngày 1: kết thúc với 3 stage đã clear; 724 coin, 135 gem, 28 energy.
- Ngày 2: kết thúc với 3 stage đã clear; 186 coin, 135 gem, 28 energy.
- Ngày 3: kết thúc với 4 stage đã clear; 1010 coin, 140 gem, 28 energy.

## Năng lượng, chờ và điểm kẹt
- Ngày 1, phút 10.4: kẹt Stage 1-4: defeat despite active dodging; upgrade currency/gear insufficient
- Ngày 2, phút 40.4: kẹt Stage 1-4: defeat despite active dodging; upgrade currency/gear insufficient
- Không chạm energy-out trong khung 3 phiên; đây là dấu hiệu nhịp đầu game khá rộng.

## Coin/gem so với chi phí nâng cấp
- Ngày 1, phút 2.9: 4062 coin; nâng tàu Lv1 giá 300 — đủ.
- Ngày 1, phút 2.9: 3762 coin; nâng tàu Lv2 giá 380 — đủ.
- Ngày 1, phút 2.9: 3382 coin; nâng tàu Lv3 giá 490 — đủ.
- Ngày 1, phút 2.9: 2892 coin; nâng tàu Lv4 giá 630 — đủ.
- Ngày 1, phút 5.4: 4447 coin; nâng tàu Lv5 giá 810 — đủ.
- Ngày 1, phút 5.4: 3637 coin; nâng tàu Lv6 giá 1030 — đủ.
- Ngày 1, phút 5.4: 2607 coin; nâng tàu Lv7 giá 1320 — đủ.
- Ngày 1, phút 5.4: 1287 coin; nâng tàu Lv8 giá 1690 — thiếu.
- Ngày 1, phút 7.9: 2270 coin; nâng tàu Lv8 giá 1690 — đủ.
- Ngày 1, phút 7.9: 580 coin; nâng tàu Lv9 giá 2160 — thiếu.
- Ngày 1, phút 10.4: 724 coin; nâng tàu Lv9 giá 2160 — thiếu.
- Ngày 2, phút 32.9: 3696 coin; nâng tàu Lv1 giá 300 — đủ.
- Ngày 2, phút 32.9: 3396 coin; nâng tàu Lv2 giá 380 — đủ.
- Ngày 2, phút 32.9: 3016 coin; nâng tàu Lv3 giá 490 — đủ.
- Ngày 2, phút 32.9: 2526 coin; nâng tàu Lv4 giá 630 — đủ.
- Ngày 2, phút 35.4: 3958 coin; nâng tàu Lv5 giá 810 — đủ.
- Ngày 2, phút 35.4: 3148 coin; nâng tàu Lv6 giá 1030 — đủ.
- Ngày 2, phút 35.4: 2118 coin; nâng tàu Lv7 giá 1320 — đủ.
- Ngày 2, phút 35.4: 798 coin; nâng tàu Lv8 giá 1690 — thiếu.
- Ngày 2, phút 37.9: 1759 coin; nâng tàu Lv8 giá 1690 — đủ.
- Ngày 2, phút 37.9: 69 coin; nâng tàu Lv9 giá 2160 — thiếu.
- Ngày 2, phút 40.4: 186 coin; nâng tàu Lv9 giá 2160 — thiếu.
- Ngày 3, phút 47.9: 3654 coin; nâng tàu Lv1 giá 300 — đủ.
- Ngày 3, phút 47.9: 3354 coin; nâng tàu Lv2 giá 380 — đủ.
- Ngày 3, phút 47.9: 2974 coin; nâng tàu Lv3 giá 490 — đủ.
- Ngày 3, phút 47.9: 2484 coin; nâng tàu Lv4 giá 630 — đủ.
- Ngày 3, phút 50.4: 3833 coin; nâng tàu Lv5 giá 810 — đủ.
- Ngày 3, phút 50.4: 3023 coin; nâng tàu Lv6 giá 1030 — đủ.
- Ngày 3, phút 50.4: 1993 coin; nâng tàu Lv7 giá 1320 — đủ.
- Ngày 3, phút 50.4: 673 coin; nâng tàu Lv8 giá 1690 — thiếu.
- Ngày 3, phút 52.9: 1568 coin; nâng tàu Lv8 giá 1690 — thiếu.
- Ngày 3, phút 55.4: 2700 coin; nâng tàu Lv8 giá 1690 — đủ.
- Ngày 3, phút 55.4: 1010 coin; nâng tàu Lv9 giá 2160 — thiếu.

## Mở khóa tính năng
- Sau clear 1 stage: Quests.
- Sau clear 2 stage: Hangar + Shop.
- Sau clear 3 stage: Skills + Spin + Online Gift + Offer.
- Sau clear 4 stage: Pet.

## Offer/shop popup
- Không chủ động mở shop trả phí; không có popup bán hàng tự bật được ghi nhận trong lộ trình này.

## Prompt quảng cáo thưởng
- Ngày 1, phút 0: daily x2 — DAILY LOGIN / 7-DAY CHECK-IN / ✕ / Day 1 / 500 coins / Day 2 / 20 gems / Day 3 / 1,000 coins / Day 4 / 2× Shield / Day 5 / 2,000 coins / Day 6 / 50 gems / Day 7 / 150 gems + crate / CLAIM / ▶ CLAIM ×2.
- Ngày 1, phút 2.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,062.
- Ngày 1, phút 5.4: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 2,170.
- Ngày 1, phút 7.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,966.
- Ngày 2, phút 30: daily x2 — DAILY LOGIN / 7-DAY CHECK-IN / ✕ / Day 1 / 500 coins / Day 2 / 20 gems / Day 3 / 1,000 coins / Day 4 / 2× Shield / Day 5 / 2,000 coins / Day 6 / 50 gems / Day 7 / 150 gems + crate / CLAIM / ▶ CLAIM ×2.
- Ngày 2, phút 32.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,392.
- Ngày 2, phút 35.4: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,924.
- Ngày 2, phút 37.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,922.
- Ngày 3, phút 45: daily x2 — DAILY LOGIN / 7-DAY CHECK-IN / ✕ / Day 1 / 500 coins / Day 2 / 20 gems / Day 3 / 1,000 coins / Day 4 / 2× Shield / Day 5 / 2,000 coins / Day 6 / 50 gems / Day 7 / 150 gems + crate / CLAIM / ▶ CLAIM ×2.
- Ngày 3, phút 47.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,308.
- Ngày 3, phút 50.4: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,758.
- Ngày 3, phút 52.9: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 1,790.
- Ngày 3, phút 55.4: victory x2 coins — ▶ WATCH AD · / ×2 COINS / 2,264.

## Phần thưởng mỗi phiên
- Ngày 1: biến động quan sát được đến cuối phiên: -1776 coin, 15 gem; clear 3 stage.
- Ngày 2: biến động quan sát được đến cuối phiên: -538 coin, 0 gem; clear 0 stage.
- Ngày 3: biến động quan sát được đến cuối phiên: 824 coin, 5 gem; clear 1 stage.

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
