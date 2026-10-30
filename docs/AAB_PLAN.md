# Nova Vanguard: Kế hoạch build AAB và đăng Google Play

Cập nhật 28/10/2026. Bản phát hành đầu tiên: **1.0.0 (versionCode 100)**, AAB đã ký, đăng như **app mới** trên tài khoản Play Console khác (do anh quản lý).
Đã chốt: **hướng B** (AdMob + mua thật), **ẩn Liên kết Google Play** ở bản 1.0, trang chính sách đăng trên **Firebase Hosting** như các game khác.

## 1. Trạng thái

| Việc | Trạng thái |
|---|---|
| Target SDK 36, minSdk 24 (giữ Capacitor 6, giống Petal Gems) | Xong |
| Bản RELEASE: ẩn Công cụ test, ẩn Liên kết Google Play; thêm Chính sách, Điều khoản, Tuỳ chọn quảng cáo, Xoá tiến trình; ID người chơi ngẫu nhiên | Xong |
| AdMob (`@capacitor-community/admob`): quảng cáo có thưởng ở 6 chỗ, xin đồng ý UMP (EU/UK) | Xong, đang dùng **ID quảng cáo thử của Google** |
| Google Play Billing 8 (plugin `NvBilling`): 6 gói kim cương + Gói khởi đầu + gói Seraph, Khôi phục giao dịch | Xong code, chờ tạo sản phẩm trên Play Console |
| Hiển thị tỉ lệ rơi của rương và Vòng quay Huyền thoại (bắt buộc với vật phẩm ngẫu nhiên) | Xong |
| Khoá tải lên `android/nova-upload.jks` + `android/keystore.properties` | Xong. **Anh sao lưu 2 file này ra 2 nơi** |
| Trang web `hosting/`: giới thiệu, `/privacy`, `/terms` (VI + EN), `firebase.json` site `nova-vanguard-app` | **Đã deploy** (project Firebase `petal-pop-2c5af7`, email tạm `lynk130999@gmail.com`; đổi: sửa `hosting/*.html` rồi `firebase deploy --only hosting`) |
| `app-ads.txt` | Chờ mã nhà xuất bản AdMob (pub-…) |
| Ảnh Store: `store/icon-512.png`, `store/feature-1024x500.png`, 7 ảnh chụp 1080×2160 có chữ quảng cáo `store/screenshots/{vi-VN,en-US}/01–07.png` | Xong |
| Chữ trang Store `store/listing/{vi-VN,en-US}/` (title, short, full, notes) | Xong |
| AdMob | Giữ **demo** (mã quảng cáo thử của Google) theo yêu cầu, làm thật sau |

SHA của khoá tải lên (cần khi liên kết Firebase/Play Games sau này):
- SHA-1 `FB:3B:5B:5C:3B:B1:C2:80:E3:21:68:B5:71:BA:DE:E3:51:86:A9:1D`
- SHA-256 `BB:FB:CA:B4:A1:61:6B:4D:44:C8:87:47:33:4A:63:22:82:C3:3B:DF:A5:6B:C2:D7:3E:43:71:4D:07:A3:4A:D4`

## 2. Sản phẩm cần tạo trên Play Console (Monetize → In-app products)

Tất cả là **sản phẩm một lần (one-time)**. Mã sản phẩm phải đúng y hệt:

| Mã sản phẩm | Tên | Giá gợi ý | Loại |
|---|---|---|---|
| `nv_gems_80` | 80 Gems | 0,99 $ (~25.000đ) | Tiêu hao |
| `nv_gems_450` | 450 Gems | 4,99 $ (~119.000đ) | Tiêu hao |
| `nv_gems_1000` | 1,000 Gems | 9,99 $ (~239.000đ) | Tiêu hao |
| `nv_gems_2200` | 2,200 Gems | 19,99 $ (~479.000đ) | Tiêu hao |
| `nv_gems_6000` | 6,000 Gems | 49,99 $ (~1.190.000đ) | Tiêu hao |
| `nv_gems_13000` | 13,000 Gems | 99,99 $ (~2.390.000đ) | Tiêu hao |
| `nv_starter` | Starter Pack (Viper + 500 gems + 10K coins + 5 power) | 1,99 $ (~49.000đ) | Mua 1 lần |
| `nv_seraph` | Seraph Pack (Seraph + 800 gems + 20K coins) | 14,99 $ (~359.000đ) | Mua 1 lần |

Game tự lấy giá thật từ Google Play (đúng tiền tệ của người chơi). Chỉ tạo được sản phẩm **sau khi** đã tải 1 AAB có quyền BILLING lên một track bất kỳ (Internal testing).

## 3. AdMob (tài khoản mới)
1. Tạo app Android "Nova Vanguard" trong AdMob, lấy **App ID** `ca-app-pub-…~…`.
2. Tạo 2 đơn vị quảng cáo: **Rewarded** và **Interstitial** (interstitial chưa dùng ở 1.0 nhưng công cụ cần đủ 3 mã).
3. Gửi em 3 mã. Em chạy `node tools/set-admob.mjs <appId> <rewarded> <interstitial>`, build lại AAB.
4. Gửi em **mã nhà xuất bản** `pub-…` để làm `app-ads.txt`, rồi khai website `https://nova-vanguard-app.web.app` ở trang Store.
5. Trong AdMob → Privacy & messaging: tạo thông báo **GDPR** (bắt buộc cho UMP) và xuất bản.

## 4. Lệnh build
```
$env:RELEASE='1'; node tools/build-www.mjs; Remove-Item Env:RELEASE
npx cap sync android
cd android; .\gradlew.bat bundleRelease
```
Kết quả: `android/app/build/outputs/bundle/release/app-release.aab` → chép ra `build/NovaVanguard-1.0.0-vc100.aab`.

## 5. Thông tin trang Store (bản nháp)

| Mục | Nội dung |
|---|---|
| Tên app (≤ 30) | **Nova Vanguard: Sky Defense** |
| Mô tả ngắn EN (≤ 80) | Pilot elite starfighters, upgrade gear and blast through epic boss battles! |
| Mô tả ngắn VI (≤ 80) | Lái chiến cơ, nâng cấp trang bị và tiêu diệt những trùm vũ trụ khổng lồ! |
| Danh mục | Game → **Arcade** |
| Website | https://nova-vanguard-app.web.app |
| Chính sách quyền riêng tư | https://nova-vanguard-app.web.app/privacy |

Hình ảnh: icon 512×512 (`art/app/icon.png`), ảnh bìa 1024×500, 6–8 ảnh chụp 1080×1920 (Home, chọn màn, trận đánh, đánh boss, chọn kỹ năng, xưởng tàu, trang bị).

## 6. App content (Play Console → Policy and programs → App content)

| Mục | Trả lời |
|---|---|
| Privacy policy | `https://nova-vanguard-app.web.app/privacy` |
| App access | All functionality is available without special access |
| Ads | **Yes, my app contains ads** |
| Target audience | **13–15, 16–17, 18+**. "Could unintentionally appeal to children?" → No |
| Advertising ID | **Yes**, mục đích Advertising or marketing |
| Government / Financial / Health / News | No / No financial features / No / No |

**Data safety**

| Câu hỏi | Trả lời |
|---|---|
| Collect or share required user data? | **Yes** |
| Encrypted in transit? | **Yes** |
| Way to request deletion? | **No** (không có tài khoản; dữ liệu AdMob do Google xử lý) |
| Device or other IDs | Collected + Shared · Advertising or marketing, Fraud prevention |
| App info and performance → Diagnostics | Collected · Analytics, Fraud prevention |
| App activity → App interactions | Collected · Advertising or marketing, Analytics |
| Financial info → Purchase history | Collected · App functionality |
| Các mục khác | Không |

**Content rating (IARC), category Game**

| Nhóm câu hỏi | Trả lời |
|---|---|
| Violence | **Yes: fantasy violence**, bắn tàu vũ trụ/robot, không người, không máu |
| Blood / Fear / Sexuality / Language / Drugs | No |
| Gambling | No |
| Random items purchasable (loot box) | **Yes**: rương và Vòng quay Huyền thoại mở bằng kim cương (kim cương mua được bằng tiền), tỉ lệ có hiển thị |
| Users interact / share location / unrestricted web | No |
| Digital purchases | **Yes** |

Dự kiến: PEGI 7 / ESRB Everyone 10+, có nhãn "In-app purchases (includes random items)".

## 7. Các bước còn lại

| Bước | Việc | Ai |
|---|---|---|
| 1 | Gửi email hỗ trợ → em điền vào trang web và deploy Firebase | Anh → Claude |
| 2 | Tạo app trên Play Console mới, tải AAB 1.0.0 lên **Internal testing** | Anh |
| 3 | Tạo 8 sản phẩm ở mục 2, tạo AdMob ở mục 3, gửi em các mã | Anh |
| 4 | Gắn mã AdMob thật, làm app-ads.txt, build lại AAB (vc101), test mua thử bằng tài khoản tester | Claude + Anh |
| 5 | Ảnh Store + mô tả VI/EN, điền App content theo mục 6 | Claude soạn, anh dán |
| 6 | Thử nghiệm kín 12 người × 14 ngày (nếu tài khoản cá nhân tạo sau 13/11/2023) | Anh + nhóm test |
| 7 | Gửi duyệt Production, phát hành theo tỉ lệ 20% → 100% | Anh |
