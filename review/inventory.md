# Nova Valkyrie — Review & Inventory

Ngày rà soát: 02/11/2026. Phạm vi: `CLAUDE.md`, toàn bộ `docs/*.md`, game nền `src/game.html`, lớp anime `tools/anime-mock.mjs`, bridge thanh toán/quảng cáo và cấu hình Android. Số liệu dưới đây ưu tiên **mã chạy hiện tại**; tài liệu kế hoạch chỉ được dùng cho trạng thái phát hành/rủi ro. Không coi UI hiển thị là backend thật nếu mã không nối dịch vụ.

## 1. Core loop và độ dài phiên chơi

- Vòng lặp chính: chọn màn/độ khó → trừ năng lượng → điều khiển Valkyrie bằng kéo, tự bắn → hạ wave, nhặt tinh thể XP và xu → lên cấp chọn 1 trong 3 thẻ kỹ năng → mini-boss/boss → kết quả, sao và phần thưởng → nâng Valkyrie/kỹ năng/gear/pet rồi chơi tiếp.
- Campaign có 40 màn (4 chương × 10). Mỗi màn thường có `min(12, 4 + floor(stageIndex/3))` wave: 4 wave ở 1-1 đến 1-3, 5 wave từ 1-4, tăng dần tới trần 12. Lớp anime sửa riêng 1-1 còn 3 wave.
- Số địch mỗi wave là `7 + min(6, wave)`, tức 8 ở wave 1 đến tối đa 13; ba màn đầu được giảm lần lượt theo cấu hình dễ. Event dùng 14 địch/wave.
- Màn boss là mỗi màn thứ 5: x-5 và x-10, tổng 8 màn boss trong campaign. Màn thường chèn mini-boss ở wave giữa; boss stage chương 3–4 còn chèn mini-boss ở wave áp chót. Endless có mini-boss mỗi 4 wave (trừ bội 8) và boss mỗi 8 wave. Boss Rush đánh 3 boss liên tiếp.
- Hệ số sức mạnh là hệ số độ khó × `(1 + 0,1 × stageIndex)`: Normal 1,0; Hard 1,8; Nightmare 3,0 trước hệ số màn.
- Một màn được tài liệu ước tính 1,5–2 phút. Event Crimson Swarm dài đúng 90 giây. Endless không giới hạn; Boss Rush kết thúc sau 3 boss.
- Trong một lượt có 14 kỹ năng roguelite: Multishot, Rapid Fire, Power Rounds, Piercing, Critical Hit, Homing Missiles, Plasma Orbs, Chain Lightning, Wing Cannons, Escort Drones, Nova Pulse, Nano Repair, Reinforced Hull, Tractor Field. Mỗi lần lên cấp hiện 3 lựa chọn; tối đa 6 loại đang sở hữu, mỗi loại có 3–5 cấp. Tactical Core có thể cho tối đa 3 lượt chọn miễn phí đầu màn; Power booster cho thêm 2 lượt.
- XP cần lên cấp là `round(5 × 1,24^(level-1))`. Mỗi Valkyrie có 1 ULT riêng, nạp từ kill; trận còn có Shield và Bomb tiêu hao. Boss Core (sau 1-10) tự kích hoạt theo cooldown.
- Ba màn Normal đầu miễn phí năng lượng; 1-1 và 1-2 có bảo hộ không thể chết, 1-3 có nhịp dễ hơn. Từ 1-4, campaign tốn 5 năng lượng/màn.

## 2. Progression

### Campaign, tài khoản và mở tính năng

- 4 chương × 10 màn = 40 màn; 3 độ khó = 120 biến thể màn, tối đa 360 sao.
- Hard được định hướng mở sau khi hoàn thành chương 1. Mã lưu tiến độ riêng cho Normal/Hard/Nightmare; màn kế tiếp mở tuần tự.
- Cấp tài khoản: `1 + floor(sqrt(xp/120))`. Rank hiển thị theo cấp (Cadet → Ensign → Lieutenant → Commander → Captain → Commodore → Admiral). Đây là progression local, không có tài khoản server.
- Lịch mở tính năng thực tế theo số màn Normal đã qua:

| Mốc | Tính năng |
|---|---|
| Mở game | Campaign, sortie, daily login |
| Qua 1-1 | Quests |
| Qua 1-2 | Hangar/nâng Valkyrie, Shop |
| Qua 1-3 | Skills, Lucky Spin, Online Gift, Offer |
| Qua 1-4 | Pets |
| Qua 1-5 | Gear, Boss Rush, Mail, Notices |
| Qua 1-7 | Support officers |
| Qua 1-10 | Boss Cores, Endless, Ranking |
| Qua 2-1 | Events |

### Valkyries

- 8 Valkyrie (ID tàu cũ vẫn được giữ): Mika/Kestrel C miễn phí; Suzu/Viper R 6.000 xu; Kaede/Raptor R 9.000 xu; Elle/Halo E 450 gem; Raika/Tempest E 650 gem; Noa/Nebula E 800 gem; Seraphina/Seraph L 1.200 gem hoặc bundle; Nyx/Oblivion L 1.600 gem.
- 8 loại súng gốc: Spread shot, Twin laser, Rocket pods, Homing orbs, Arc gun, Pulse beam, Solar wave, Void orbs; 8 ULT riêng.
- Valkyrie nâng level bằng xu: lần đầu 300 xu, công thức `round10(300 × 1,28^(lv-1))`; mỗi sao nâng trần thêm 10 level (tối đa hiển thị 5 sao/50 level). Sức mạnh tăng 12% mỗi level và 25% mỗi sao. Tuy nhiên luồng kiếm nguyên liệu/nâng sao không được thể hiện rõ như một hệ thống hoàn chỉnh.
- Rương Epic có 12% và Legend 35% cơ hội mở Valkyrie chưa sở hữu; mã chọn Valkyrie khóa đầu tiên trong mảng, không phải banner nhân vật có pool/rate-up.

### Gear

- 4 slot dùng chung cho mọi Valkyrie: Cannon, Engine, Plating, Core.
- 3 set: Vanguard (2 món +8% damage; 4 món mỗi loạt thứ 10 bắn tia xuyên), Aegis (2 món +1 HP; 4 món Shield +2 giây và hồi 1 HP khi hết), Solar (2 món +10% crit; 4 món crit có 15% tạo mini nova).
- 4 rarity: Common, Rare, Epic, Legendary; tối đa level 10.
- 8 type chức năng: 6 Cannon (Machine Gun, Laser, Missile, Plasma, Sun Cannon, Frost Cannon) và 2 Engine (Jet, Ion). Plating/Core không có type riêng. Type mở theo chương: MG/Laser/Jet/Ion từ chương 1, Missile chương 2, Plasma/Frost chương 3, Solar chương 4.
- Về số “gear pieces”: hệ thống sinh thủ tục từ 3 set × 4 slot = 12 mẫu hình cơ sở; kết hợp type tạo 24 tổ hợp hợp lệ (18 cannon + 6 engine) cộng 6 plating/core = **30 họ món** trước rarity/level/nickname. Có 30 nickname Legendary (3 cho mỗi 8 type + plating + core).
- Upgrade tốn xu `150 × (rarityIndex+1) × level` và Alloy `(rarityIndex+1) × (level+1)`. Merge cần 3 món cùng set + slot + type + rarity, tạo rarity kế tiếp; phân rã trả `(rarity+1)^2 × 5 + level × 2` Alloy.
- Legendary Spin: 60 gem/lượt, 10 lượt giá 540 gem; tỷ lệ tổng hợp Legendary 4%, Epic 16%, Rare 36%, Alloy 44%; bảo hiểm Legendary ở lượt 30. Coin Spin 6.000 xu/lượt, tối đa 5/ngày, Rare 36%/Alloy 64%, không cộng pity.

### Pets, skills, support và boss cores

- 9 pet: Sparrow miễn phí; Hornet 4.000 xu; Flak 7.000; Medic 8.000; Aegis 300 gem; Tesla 400; Guardian 450; Phantom 900; Solaris 1.000. Pet có 9 hành vi: shot, missile, laser, flak, heal, chain lightning, bullet shield, void orb, sun fan. Mã anime hiển thị một companion nhưng giữ tổng output tương đương cặp drone nền.
- 16 kỹ năng nâng vĩnh viễn: 3 Active/Ultimate, 5 Offense, 3 Defense, 5 Utility; trần 3–10 cấp. Giá nền 300–4.000 xu, tăng theo `round10(base × 1,45^level)`.
- 3 support officer: Rin miễn phí (+10% xu), Bo 8.000 xu (+1 HP đầu màn), Vega 500 gem (+15% sát thương boss).
- 10 Boss Core tương ứng 10 boss, mở sau 1-10 và tự cast: ring barrage, swarm, breath, solar lance, slow bullets, shield, seeker rain, shells, bullet freeze, eclipse nova. Boss phải được hạ trong campaign để mở core; có level core trong save/UI.

## 3. Economy

### Tiền tệ và tài nguyên

| Loại | Số đầu | Nguồn chính | Sink chính |
|---|---:|---|---|
| Xu/Coins | 2.500 | Địch 8–50 xu/con; thưởng màn; daily 500/1.000/2.000; quest 300–800; online 300/1.200; mail 1.000; rương 2.000+/6.000+/15.000+ | Valkyrie 300+; skill 300–4.000+; pet/support 4.000–9.000; gear upgrade; Coin Spin 6.000; Shield ×2 giá 1.500 |
| Gem | 120 | First-clear/kết quả; daily 20/50/150; quest 15/20; achievement 80–200; online 10/30; mail 50; event 50/150; rewarded +10; IAP | Valkyrie/pet/support; rương 60/180/450; gear spin 60/540; Power ×2 giá 20; refill 40; revive 50 |
| Energy | 30/30 | Hồi tự động; spin có ô +10; rewarded +10; refill gem | 5/màn từ 1-4; event 5; ba màn đầu miễn phí |
| Alloy | 40 | Drop/kết quả màn, Legendary/Coin Spin 20–60, dismantle | Nâng gear: `(rarity+1) × (level+1)` |
| XP tài khoản | 0 | Kết quả/chơi màn | Tăng account level; không tiêu |
| XP trong lượt | 0 mỗi trận | Crystal: Grunt/Dart 1, Orb 2, Tank 3, Elite 6 | Tự tiêu khi lên level để chọn skill |
| Sao | 0 | 1–3 sao/màn theo HP còn lại | Mở tiến trình/achievement/rank; không tiêu |
| Shield/Bomb/Power/Life | Shield 2, Bomb 2, Power 1, Life 0 | Shop, spin, daily, crate | Dùng trong màn/boost trước màn |
| Valkyrie/pet/core shards | Không có | — | — |

- Energy regen trong code là **1 mỗi 30 giây**, tức đầy 30 trong 15 phút. Chính comment gọi đây là “mockup regen”; mức này quá nhanh so với economy live phổ biến. Khi đầy, timer reset.
- Refill đầy energy giá 40 gem; xem rewarded nhận +10 energy. Revive giá 50 gem hoặc rewarded ad.

### Shop và bảng giá

| Mặt hàng | Giá | Nội dung |
|---|---:|---|
| 80 gem | $0.99 | `nv_gems_80` |
| 450 gem | $4.99 | `nv_gems_450` |
| 1.000 gem | $9.99 | `nv_gems_1000` |
| 2.200 gem | $19.99 | `nv_gems_2200` |
| 6.000 gem | $49.99 | `nv_gems_6000` |
| 13.000 gem | $99.99 | `nv_gems_13000` |
| Starter Pack | $1.99 | Viper + 500 gem + 10.000 xu + 5 Power, mua một lần |
| Seraph Pack | $14.99 (UI gạch $29.99) | Seraph + 800 gem + 20.000 xu, mua một lần |
| VIP “30 ngày” | $4.99 hiển thị | Không ads, daily ×2, +1 spin/ngày, 100 gem/ngày; **chỉ mock local** |
| Supply/Epic/Legend crate | 60/180/450 gem | Xu + 1 bomb; Epic 12%/Legend 35% Valkyrie mới; thêm 20/60 gem ở tier cao |
| Đổi xu | 50/110/250 gem | 5.000/12.000/30.000 xu |
| Boost | 1.500 xu / 20 gem | 2 Shield / 2 Power |
| Gear Spin | 60/540 gem | 1/10 lượt, pity 30 |
| Coin Spin | 6.000 xu | 5 lượt/ngày |

Không có battle pass, subscription Play Billing thật, shard shop hay banner tiền tệ riêng cho nhân vật.

## 4. Monetisation thực sự đã triển khai

- **Google Play Billing thật:** 8 product ID ở bảng IAP trên được `tools/native-pay.js` query/mua qua Capacitor plugin `NvBilling`; `NvBillingPlugin.java` dùng BillingClient 8.0.0, hỗ trợ pending purchase, query owned, consume vật phẩm tiêu hao và acknowledge gói vĩnh viễn. JS chống grant trùng bằng purchase token trong localStorage. Giá hiển thị được thay bằng formatted price từ Play khi có.
- Sáu gem pack, Starter và Seraph đều gọi `pay(...)`; trên Android release có native bridge thì đi qua Play. Ở web/test không native, callback cấp đồ giả lập ngay.
- **Mock-only:** VIP $4.99 không gọi `pay`, chỉ đặt `S.vip=1`; không lưu ngày hết hạn, không subscription SKU, và các quyền lợi mô tả chưa được chứng minh là đều có logic. Coin packs/rương/spin/boost là giao dịch bằng tiền mềm local, không trực tiếp Billing.
- **Rewarded ads:** bridge AdMob thật đã có, gồm UMP consent và preload/reload. Có 6 nhóm điểm gọi: +10 gem, online gift ×2, lượt lucky spin bằng ad, +10 energy, revive, xu kết quả ×2. Web dev dùng popup `fakeAd` 3 giây; release không có SDK/ads thì báo không khả dụng.
- AdMob vẫn dùng **Google test ad unit IDs** nếu `NV_ADS_LIVE` chưa được inject. AAB plan cũng ghi đang demo/chờ mã thật. Vì vậy code tích hợp thật nhưng doanh thu quảng cáo production chưa sẵn sàng.
- **Interstitial:** bridge có prepare/show interstitial, nhưng không tìm thấy call gameplay tới `ads.interstitial()`. Thực tế hiện không phát interstitial.
- **Battle pass:** không có.
- **Gacha:** crate pilot 12%/35%, không pity; Gear Spin 4/16/36/44% với pity Legendary 30 và 10-pull giảm 10%; Coin Spin 36/64%, 5/ngày, không pity. Rate được hiển thị trong UI. Crate chọn Valkyrie khóa đầu tiên thay vì random trong pool, nên mô tả “gacha pilot” chưa hoàn chỉnh.

## 5. Retention

- Daily login 7 ngày: 500 xu, 20 gem, 1.000 xu, 2 Shield, 2.000 xu, 50 gem, 150 gem + crate/ship flag. Reset theo ngày UTC từ `toISOString()`.
- 6 daily quests: chơi 3 màn (600 xu), hạ 150 địch (800), hạ 1 boss (20 gem), nhặt 2.000 xu (15 gem), quay 1 lần (300 xu), nâng 1 Valkyrie (500 xu). Nhận 4 quest mở daily chest 1.500 xu + 30 gem.
- 5 achievements một lần: 30 sao/100 gem; 2.000 kill/80; 10 boss/120; sở hữu 3 Valkyrie/150; Endless 50.000/200.
- Online Gift theo thời gian foreground: 1 phút/300 xu, 5 phút/10 gem, 10 phút/1.200 xu, 20 phút/30 gem. Timer local và chỉ tăng khi trang không hidden.
- Lucky Spin miễn phí 1 lần/ngày; state còn `spinsAd:3`, cho tối đa 3 lượt ad theo reset. Vòng có 8 ô: 200/500/1.000/300 xu, 10/30 gem, 1 bomb, 10 energy.
- Event Crimson Swarm 90 giây, mốc 10.000 = 2.000 xu, 25.000 = 50 gem, 50.000 = 150 gem. Thời hạn “2d 14h” là nội dung cứng, không backend/live ops.
- Mail có 2 thư seed local: 50 gem và 1.000 xu; không có server inbox.
- Notices là nội dung tĩnh. Không có Android push notification implementation/FCM; Gradle chỉ ghi chú Google services sẽ không áp dụng nếu thiếu `google-services.json`.
- Leaderboard là **giả/bot**: danh sách `NAMES`, điểm giảm theo công thức `base × 0,82^i`, rồi chèn người chơi local. Không có API, anti-cheat, mùa giải hay phần thưởng server thật.
- Không thấy calendar/live-ops backend; mọi reset và save dựa trên đồng hồ/localStorage, dễ chỉnh giờ hoặc sửa dữ liệu.

## 6. Content volume

| Nội dung | Số lượng hiện có |
|---|---:|
| Chương / màn / độ khó | 4 / 40 / 3 (120 biến thể) |
| Valkyrie | 8 |
| Kiểu vũ khí Valkyrie | 8 |
| ULT | 8 |
| Pet | 9 |
| Support officer | 3 |
| Kỹ năng vĩnh viễn | 16 |
| Kỹ năng roguelite trong lượt | 14 |
| Boss | 10 |
| Mini-boss | 8 |
| Loại địch thường | 5: grunt, dart, tank, orb, elite |
| Boss Core | 10 |
| Gear slot / set / rarity | 4 / 3 / 4 |
| Gear type chức năng | 8 (6 cannon, 2 engine) |
| Họ gear hợp lệ | 30 trước rarity/level/nickname |
| Daily quest / achievement | 6 / 5 |
| Mode phụ | Endless, Boss Rush, event 90s |

- Audio runtime chính vẫn là Web Audio tạo bằng code: 3 mood nhạc procedural (menu 92 BPM, battle 128, boss 142) và 6 cue SFX (`shot`, `boom`, `coin`, `up`, `tap`, `hit`) cộng noise/drum tổng hợp.
- Repo có 4 MP3 thử và 4 WAV nguồn trong `art/music/src` (2 bản title, 2 bản battle), nhưng docs/UI audit ghi đang chờ duyệt và runtime được kiểm tra vẫn có hệ procedural. Chưa có voice acting, nhạc character/event riêng hay bộ SFX hoàn thiện.

## 7. Thiếu so với chuẩn anime gacha shooter

- Không có banner tuyển mộ Valkyrie đúng nghĩa: thiếu pool theo banner, rate-up, rarity pull, multi-pull, pity/guarantee, duplicate conversion và shard/limit-break economy.
- Không có story campaign hoàn chỉnh: chỉ có flavor text/Mika và ý tưởng rival trong tài liệu; thiếu chapter cutscene, dialogue tree, CG, lore archive và bond/affection story.
- Không có PvP, guild/clan, co-op/raid, friend/support list hoặc chat.
- Không có battle pass/free-premium track, subscription thật, mission season hoặc live-ops calendar backend.
- Không có push notification thật cho energy/full, daily reset, event/mail; chỉ UI Notices local.
- Không có cloud save, account login, Play Games Services hoặc đồng bộ đa thiết bị; save nằm trong localStorage.
- Không có analytics SDK/event taxonomy, attribution, remote config, A/B test hoặc crash reporting.
- Localisation chỉ EN/VI và cơ chế thay chuỗi runtime; chưa có pipeline bản địa hóa chuẩn, plural/font QA hay ngôn ngữ thị trường khác.
- Store assets từng được AAB plan của game gốc ghi là có, nhưng fork này không có thư mục `hosting/` và cần xác minh bộ listing/screenshot riêng Nova Valkyrie; link policy hiện vẫn của Nova Vanguard.
- Thiếu backend bảo vệ economy/leaderboard/IAP entitlement; local clock/save có thể chỉnh. Không có content download/patcher.
- Thiếu hệ duplicate, star-up rõ ràng, daily/weekly raid, tower, dorm/base, relationship, skin/cosmetic và character voice — các trụ retention/collection phổ biến của anime gacha.

## 8. Technical/store readiness

- App ID: `com.novavanguard.valkyrie`; app name: `Nova Valkyrie`; namespace Java: `com.novavanguard.game`.
- Android hiện tại: `versionCode 14`, `versionName 0.3.5`; package.json là 1.0.0 và hằng `APP_VER` trong base là 1.0.0 nhưng build có cơ chế inject version. Cần tránh lệch version giữa UI/package/Gradle.
- Capacitor 6.2, minSdk 24 và target/compile SDK lấy từ root (tài liệu nói target 36). Billing 8.0.0; AdMob Capacitor 6.2.0.
- Release signing config đã có và chỉ bật khi `android/keystore.properties` tồn tại; tài liệu ghi upload keystore đã tạo. Không đưa bí mật vào review. `minifyEnabled false`.
- Privacy/Terms hiện trỏ `https://nova-vanguard-app.web.app/privacy` và `/terms`, tức site của game cũ. UI audit xác nhận cần site riêng Nova Valkyrie. Repo hiện không có `hosting/`; trạng thái link fork là **chưa sẵn sàng**.
- Không thấy Firebase Analytics, GA, GameAnalytics, AppsFlyer, Adjust hay SDK analytics khác. Không thấy Firebase Crashlytics/Sentry/Bugsnag. Google services plugin chỉ áp dụng có điều kiện; không chứng minh có `google-services.json` production.
- APK debug mới nhất `NovaValkyrie-0.3.5-debug-1030-2255.apk` là 21.747.168 byte ≈ 20,74 MiB (≈21,75 MB thập phân), khớp con số ~20,7 MB yêu cầu. Đây là debug APK, không phải AAB production đã duyệt.
- Store assets/listing riêng cần xác minh; AAB plan hiện lẫn tên Nova Vanguard và thông tin bản 1.0.0 cũ. Chưa có bằng chứng upload/internal test/closed test của fork.
- Offline play: core campaign, progression, event giả lập, mail, quest và bot leaderboard chạy offline/local. Google Fonts là URL mạng nhưng có fallback; IAP, rewarded ads, consent và mở link policy cần mạng. Không có backend bắt buộc để vào game.
- Quyền lợi mua được grant local; gem tiêu hao được consume, Starter/Seraph acknowledge và restore. Tuy nhiên entitlement/save không cloud, nên cần test restore sau xoá dữ liệu và chống grant lại gói permanent.

## 9. Rủi ro

- **IP/nhân vật:** `UI_AUDIT.md` ghi Mika giống “Skysaber” của Starward, chưa quyết định vẽ lại; Raika giống Mika. Đây là rủi ro nhận diện/DMCA cao hơn lỗi kỹ thuật. Tài liệu cũng cảnh báo không ship ảnh Pinterest/Huaban/game khác và chỉ dùng reference có license.
- **Placeholder/mock:** leaderboard là bot; event timer/nội dung tĩnh; mail/notice local; ID người chơi ngẫu nhiên; VIP giả; offer countdown cứng; một số art/music/SFX còn thử nghiệm hoặc procedural.
- **Chính sách thanh toán:** VIP hiển thị $4.99 nhưng không gọi Google Play Billing. Nếu xuất hiện trong release như mua tiền thật/cấp quyền lợi, đây là lỗi chức năng và có thể gây vấn đề Play Payments/misleading claims.
- **Ads:** đang dùng Google test IDs; không được phát hành như cấu hình doanh thu. Cần AdMob live ID, app-ads.txt, consent QA và Data Safety khớp hành vi thực tế. Interstitial khai báo/preload nhưng không dùng.
- **Loot box:** gem có thể mua bằng tiền và dùng cho crate/gear spin; cần tiếp tục hiển thị xác suất rõ, nhất quán theo khu vực, và mô tả “random items” trong IARC/Play. Crate hiện không random nhân vật trong pool như người chơi có thể hiểu.
- **Privacy:** policy trỏ thương hiệu/app cũ; Data Safety trong AAB plan mô tả analytics/diagnostics dù repo không có analytics/crash SDK rõ ràng. Khai báo sai cả hai chiều đều có rủi ro duyệt.
- **Integrity:** economy, event, daily, VIP và leaderboard hoàn toàn client-side/localStorage, có thể sửa save/đồng hồ. Không phù hợp cạnh tranh có thưởng thật.
- **Content consistency:** tên tàu cũ/ship vẫn tồn tại trong dữ liệu và một số mô tả; base game và anime patch có thể lệch khi patch target thay đổi. `anime-mock.mjs` dài 2.116 dòng patch chuỗi, dễ vỡ âm thầm nếu không build/test đầy đủ.
- **Release evidence:** tài liệu có trạng thái của Nova Vanguard gốc và các bản mock/debug; không được coi là bằng chứng Nova Valkyrie đã có AAB ký, product active, ads live hay Play approval.
- **Audio/store polish:** nhạc/SFX chưa chốt, thiếu voice; link policy và bộ store riêng chưa xác nhận. Đây là khoảng cách rõ với kỳ vọng anime character collector.

## Tóm tắt 10 dòng — điểm mạnh và điểm yếu

1. Điểm mạnh: core shmup chạy được, nhịp ngắn 1,5–2 phút, có campaign 40 màn và 3 độ khó.
2. Điểm mạnh: content combat khá dày với 8 Valkyrie, 9 pet, 10 boss, 8 mini-boss và 14 skill trong lượt.
3. Điểm mạnh: gear có 4 slot, 3 set, 4 rarity, 30 họ món và vòng merge/upgrade/dismantle rõ ràng.
4. Điểm mạnh: onboarding mở tính năng theo 1-1 đến 2-1, ba màn đầu giảm ma sát tốt.
5. Điểm mạnh: 8 SKU Play Billing và rewarded AdMob đã có bridge native, pending/restore/consume được xử lý.
6. Điểm yếu: VIP $4.99, leaderboard, mail, event và nhiều live-service feature vẫn là mock/local.
7. Điểm yếu: chưa có gacha Valkyrie chuẩn, story đầy đủ, battle pass, guild/PvP/co-op hay social loop.
8. Điểm yếu: không cloud save, analytics, crash reporting, push notification hoặc backend chống gian lận.
9. Điểm yếu: store readiness chưa đạt vì AdMob còn test ID, policy trỏ game cũ và chỉ có APK debug ~20,74 MiB làm bằng chứng.
10. Rủi ro lớn nhất trước phát hành là IP của Mika, claim mua VIP giả, khai báo privacy/Data Safety lệch thực tế và placeholder/bot bị người chơi nhận ra.
