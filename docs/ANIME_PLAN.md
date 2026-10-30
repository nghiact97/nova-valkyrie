# Nova Vanguard → bản Anime "mecha-girl" (kế hoạch)

Ngày lập: 29/10/2026. Bản này là **app riêng** ở `D:\Node\games\nova_vanguard_anime` (fork từ nova_vanguard, appId `com.novavanguard.valkyrie`, tên tạm "Nova Valkyrie"). Nova Vanguard gốc giữ nguyên.

## 1. Ý tưởng chuyển thể

- Thể loại: shmup dọc + nhân vật anime "mecha musume". Mỗi cô gái mặc một bộ giáp bay (rig), và bộ rig chính là con tàu cũ.
- **8 tàu thành 8 cô gái.** Tên tàu cũ thành callsign, ví dụ Mika "Kestrel". Code giữ `id` cũ (kestrel, viper, …), nên cân bằng, ULT, gear và save không phải viết lại.
- Gameplay giữ nguyên 100%: đạn, boss, mini-boss, gear, skill, drone. Đây là lý do chuyển thể rẻ: phần lớn công việc nằm ở **art và màn hình nhân vật**.
- UI Home v5 hiện tại đã gần giống ảnh mẫu: nút khung bên trái/phải, tiền tệ trên cùng, bottom nav 5 tab. Chỉ cần đặt **nhân vật đứng to ở giữa** thay cho con tàu, thêm mũi tên đổi nhân vật.
- Không sao chép game trong ảnh mẫu: không dùng tên, nhân vật, logo, chữ Trung, rig máy bay cánh quạt, tai mèo + tóc xanh. Ảnh đó chỉ là tham khảo bố cục.

## 2. Dàn nhân vật (gốc, tự đặt)

| id (giữ) | Hạng | Tên – callsign | Màu | Ngoại hình / tính cách | Rig (vũ khí) |
|---|---|---|---|---|---|
| kestrel | C | Mika "Kestrel" | cyan / trắng | tóc bob bạc-xanh ngắn, tân binh vui vẻ | 2 cánh delta nhỏ sau lưng, 2 súng tay (spread) |
| viper | R | Suzu "Viper" | xanh lá / đen | tóc đuôi ngựa dài, lạnh lùng | 2 thương laser dọc hông |
| raptor | R | Kaede "Raptor" | cam / xám thép | 2 bím, tomboy thợ máy, găng tay to | ống phóng tên lửa ở 2 hông |
| halo | E | Elle "Halo" | tím / trắng | tóc dài gợn sóng, dịu dàng | vòng hào quang có quả cầu bay sau lưng |
| tempest | E | Raika "Tempest" | xanh điện / trắng | tóc lệch một bên dựng, hiếu động | cuộn điện ở đầu cánh, tia sét |
| nebula | E | Noa "Nebula" | hồng magenta / trắng | tóc hai bên, kiểu idol | cánh trăng lưỡi liềm, gậy phát tia |
| seraph | L | Seraphina "Seraph" | vàng / trắng | tóc vàng rất dài, chỉ huy | 6 cánh lưỡi mặt trời |
| oblivion | L | Nyx "Oblivion" | đen / tím | tóc hime-cut, bí ẩn | cánh lưỡi đá obsidian, lõi hư không |

- Tab **Pilots** (Rin/Bo/Vega) bỏ. Bonus của pilot chuyển thành "passive" của từng cô gái.
- Phe địch: boss vẫn là máy móc. Mỗi world thêm **1 nữ chỉ huy đối thủ** (4 người), chỉ xuất hiện trong hội thoại trước boss.
- Launch: **4 cô đầu tiên** (Mika, Suzu, Elle, Seraphina, đủ C/R/E/L). 4 cô còn lại ra dần dưới dạng "nhân vật sự kiện", vừa đỡ tải art vừa có nội dung update.

## 3. Danh sách art cần vẽ

Mỗi cô gái cần 6 ảnh:

| File | Kích thước | Dùng ở đâu |
|---|---|---|
| `stand_<id>.png` | 1024×1536, nền trong | Home (nhân vật to giữa màn hình), trang chi tiết |
| `stand_<id>_blink.png` | 1024×1536 | cùng ảnh nhưng nhắm mắt; mình chỉ cắt vùng mắt để làm hiệu ứng chớp mắt |
| `face_<id>_normal / happy / angry.png` | 1024×1024, bust | hội thoại cốt truyện, avatar, thẻ danh sách |
| `fly_<id>.png` | 1024×1024, nền trong | sprite trong trận: nhìn từ trên-sau, bay lên, tỷ lệ đầu to (1:4) cho dễ nhìn ở 90px |
| `cutin_<id>.png` | 1536×1024 | cut-in khi bấm ULT (mắt + vũ khí, động tác mạnh) |

Ảnh dùng chung:
- `bg_hangar.jpg`: nhà chứa sci-fi với bệ hologram tròn ở giữa (Home), 1024×1536.
- `bg_recruit.jpg`: phòng tuyển quân.
- `bg_story_1..4.jpg`: nền hội thoại cho 4 world.
- `rival_1..4` (stand + 2 mặt), `keyart.jpg` (3–4 cô, dùng cho splash và store), `logo`, icon app 512, feature graphic 1024×500.

Tổng: launch 4 cô ≈ 24 ảnh, cộng ~14 ảnh chung. Đủ 8 cô ≈ 70 ảnh. Codex từng bị giới hạn quota, nên chia mỗi ngày 1–2 cô.

## 4. Quy trình vẽ bằng Codex (giữ đồng bộ phong cách)

1. **Khoá style (bước quan trọng nhất).** Chạy `art/anime/job_00_style_lock.txt`: vẽ Mika 4 phiên bản. Anh chọn 1 → lưu thành `art/anime/ref_style.png`. Từ đó **mọi job đều đính kèm ảnh này** (`-i`) và không đổi style nữa.
2. Mỗi cô: chạy job `stand` trước → anh duyệt → mới chạy các job còn lại (blink, face, fly, cutin), đính kèm `stand_<id>.png` để giữ đúng mặt, tóc, trang phục.
3. Mình hậu kỳ: cắt nền, crop, căn chân đứng cùng một đường, ghép vùng mắt cho blink, nén WebP. Bước này đi vào `tools/pack_sprites.py` như sprite hiện tại.

Lưu ý thực tế: AI vẽ anime toàn thân ổn, nhưng hay sai **tay, ngón, chi tiết rig hai bên không khớp**. Mỗi ảnh nên chạy 2–4 lần rồi chọn. Với 2 cô Legendary (bộ mặt của game), nên cân nhắc thuê hoạ sĩ vẽ lại.

## 5. Nếu anh lấy ảnh từ nguồn khác

- **Được dùng:** ảnh anh mua có giấy phép thương mại (itch.io, Booth.pm ghi rõ "commercial use OK", gói asset trả phí), hoặc thuê vẽ (VGen, Skeb, Fiverr; khoảng 50–300 USD một ảnh toàn thân, nhớ ghi rõ quyền thương mại trong đơn).
- **Không dùng:** ảnh rip từ game khác (kể cả game trong ảnh mẫu), Pinterest, Pixiv, fanart. Google Play gỡ app khi nhận DMCA và có thể khoá tài khoản dev. Tài khoản này còn dùng cho Petal Pop / Nova Vanguard, rủi ro rất lớn.
- Với ảnh có license, mình làm được: tách nền, đổi màu theo bảng màu nhân vật, crop đúng các kích thước trên, làm lớp chớp mắt, rồi cho Codex vẽ lại sprite `fly` và `cutin` dựa trên ảnh đó.

## 6. Việc code (trong bản fork)

| # | Việc | Ghi chú |
|---|---|---|
| C1 | Fork `nova_vanguard` → `nova_vanguard_anime`, đổi appId, tên app, icon | appId đề xuất `com.novavanguard.valkyrie`; tên app chờ anh chốt |
| C2 | `SHIPS[i].girl = {name, title, passive, lines[]}`; đổi chữ "Ship" → "Valkyrie" (EN/VI) | id cũ giữ nguyên, save cũ không vỡ |
| C3 | Home: nhân vật đứng to giữa, có mũi tên trái/phải, chạm → bong bóng thoại | idle động không cần Live2D: chia ảnh thành dải ngang rồi lắc sin (thở ở ngực, tóc đung đưa) + chớp mắt 3–5s |
| C4 | Hangar tab Valkyries: thẻ chân dung có khung theo hạng, trang chi tiết (chỉ số, ULT, passive, nâng sao) | thay tab Ships + Pilots |
| C5 | Trận đấu: sprite `fly_<id>`, giữ nguyên hitbox; ULT bật cut-in 0.8s trên nền slow-mo sẵn có | |
| C6 | Hệ thống hội thoại: bảng `STORY` mỗi world, có nút Skip, chiếu trước stage boss | 3–6 câu mỗi cảnh, EN/VI |
| C7 | Recruit (gacha nhân vật): banner, 1 / 10 lượt, mảnh khi trùng → nâng sao, **hiển thị tỉ lệ** | Google Play bắt buộc công khai tỉ lệ loot box |
| C8 | Store: key art, ảnh chụp mới, nội dung phân loại IARC | |

Giới hạn nội dung: giữ ở mức Teen. Không panty shot, không "rung", không cảnh khỏa thân hay bán khỏa thân. Mức này an toàn với chính sách Play và không ảnh hưởng quảng cáo AdMob.

## 7. Lộ trình

| Bước | Nội dung | Thời gian ước tính |
|---|---|---|
| 0 | Anh chốt tên app, chốt 4 cô launch, nguồn art | — |
| 1 | Khoá style: job_00, anh chọn | 1 ngày |
| 2 | Art 4 cô launch + bg_hangar | 2–4 ngày (phụ thuộc quota Codex) |
| 3 | C1–C5 (fork, Home, Hangar, battle, cut-in) → APK test gửi Telegram | 2 ngày |
| 4 | C6–C7 (cốt truyện, recruit) + art rival / story bg | 2–3 ngày |
| 5 | Store art, AAB, phát hành | 1 ngày |
| 6 | Update: 4 cô sự kiện còn lại, mỗi 1–2 tuần ra 1 cô | sau launch |
