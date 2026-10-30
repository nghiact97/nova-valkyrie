# Nova Valkyrie — Kế hoạch làm lại nhạc

## 1. Hiện trạng

- Nhạc hiện tại do code tự tạo (`MUSIC` trong `src/game.html`): bộ phát 16 nhịp, sóng tam giác, 3 bản `menu` / `battle` / `boss`, cùng một vòng hợp âm La thứ.
- Nhạc này nghe giống máy 8-bit, đơn điệu, không có chất anime. Chương nào, boss nào cũng chung một bài.
- Hiệu ứng âm thanh (`sfx`) cũng do code tạo. Phần này để sau, kế hoạch này chỉ lo nhạc nền.

## 2. Chọn model

| Model | Chất lượng | Bản quyền thương mại | Ghi chú |
|---|---|---|---|
| **ElevenLabs Music** | Tốt, nhạc không lời ổn | **Sạch nhất**: train trên dữ liệu có bản quyền, cho dùng thương mại; game của studio lớn cần gói Enterprise | Có API; **đề xuất dùng chính** |
| **Stable Audio** | Khá, mạnh ở loop và nhạc điện tử | Dữ liệu có bản quyền; bản nhỏ chạy được trên máy; bản Large chỉ có qua API | Dự phòng; dùng tốt cho tiếng chốt ngắn |
| Suno | Rất "bắt tai", J-pop / anime rất giống thật | Chỉ được dùng thương mại với bài tạo **trong lúc đang trả phí**; pháp lý còn đang thay đổi | Chỉ dùng nếu anh có gói trả phí, và phải lưu bằng chứng ngày tạo |
| Udio | Hay | Đang hạn chế tải file về | Không dùng cho bản phát hành |
| Google Lyria | Có API, giá rẻ | Chưa rõ điều khoản thương mại | Thử sau nếu cần |

Kiểm tra lại điều khoản trên trang của từng hãng trước khi phát hành, vì giá và luật thay đổi thường xuyên.

**Đang thử (29/10):** Stable Audio 3 **Medium**, gọi qua Space demo chính thức `stabilityai/stable-audio-3` bằng `tools/gen_music.py`. Không cần tài khoản, không cần GPU.
- Bản quyền: Stability Community License; người tạo sở hữu nhạc, dùng thương mại được khi doanh thu dưới 1 triệu USD/năm.
- Dữ liệu train: có giấy phép và Creative Commons.
- Bản gốc lưu ở `art/music/src/*.wav`; nén MP3 bằng `tools/wav2mp3.py`.

**Quy tắc prompt:**
- Không ghi tên game, anime, hãng hay ca sĩ có thật (ví dụ "giống nhạc game X"), để tránh bị trùng bản quyền như vụ Mika.
- Chỉ mô tả thể loại, nhịp độ, nhạc cụ, cảm xúc.
- Tất cả là nhạc **không lời**.

## 3. Danh sách bài

Phong cách chung là "anime shooter": J-rock / eurobeat / synth điện tử, guitar điện, synth lead sáng, trống nhanh, cảm giác hào hùng và trẻ trung.

| # | Tên file | Dùng ở | BPM | Độ dài | Mô tả |
|---|---|---|---|---|---|
| 1 | `title` | Màn mở đầu + Home | 100 | loop ~90s | Chủ đề chính của game: piano + synth pad mở đầu, rồi guitar điện và trống vào; hào hùng nhưng nhẹ, nghe lâu không mệt |
| 2 | `menu` | Xưởng, Cửa hàng, Nhiệm vụ | 92 | loop ~75s | Future bass / lo-fi điện tử dịu, ít trống, không lấn át tiếng bấm nút |
| 3 | `battle_1` | Chương 1 | 150 | loop ~90s | J-rock tươi sáng: guitar riff + synth lead, cảm giác "xuất kích" |
| 4 | `battle_2` | Chương 2 | 155 | loop ~90s | Synthwave / eurobeat, nhiều arpeggio, không khí đêm vũ trụ |
| 5 | `battle_3` | Chương 3 | 160 | loop ~90s | Trance tối hơn, bass nặng, căng thẳng |
| 6 | `battle_4` | Chương 4 | 165 | loop ~90s | Rock + dàn nhạc giao hưởng (string, brass), hùng tráng, cao trào |
| 7 | `boss` | Boss thường, Boss Rush | 170 | loop ~75s | Metal / rock nhanh, choir synth, nhiều kịch tính |
| 8 | `boss_final` | Boss cuối chương | 175 | loop ~90s | Bản boss mạnh nhất: dàn nhạc + guitar + hợp xướng không lời |
| 9 | `event` | Sự kiện, Vô tận | 140 | loop ~75s | Vui, kiểu lễ hội điện tử |
| 10 | `win` | Thắng màn | — | 4–6s | Fanfare chiến thắng ngắn (tiếng chốt) |
| 11 | `lose` | Thua | — | 3–4s | Hợp âm buồn đi xuống |
| 12 | `unlock` | Dialog "MỞ KHOÁ MỚI!", lên cấp | — | 2–3s | Tiếng "ting" lấp lánh + hợp âm sáng |

Tổng cộng 9 bài loop và 3 tiếng chốt ngắn.

## 4. Prompt mẫu (ElevenLabs Music / Suno)

Viết bằng tiếng Anh. Mỗi bài tạo 3–4 lần để chọn bản hay nhất.

- **title:** `Instrumental anime game main theme, heroic and hopeful, 100 BPM, soft piano and airy synth pads intro, then electric guitar, bright synth lead melody and punchy drums, sci-fi space adventure, polished modern J-rock production, no vocals, loopable ending`
- **battle_1:** `Instrumental high-energy anime shoot-em-up battle music, 150 BPM, fast J-rock with driving electric guitar riffs, bright synth lead, energetic drums, uplifting and heroic, space fighter combat, no vocals, constant energy for looping`
- **battle_2:** `Instrumental eurobeat synthwave battle track, 155 BPM, rapid arpeggiated synths, pulsing bass, neon night in outer space, anime arcade shooter, no vocals, steady intensity for looping`
- **battle_3:** `Instrumental dark trance battle music, 160 BPM, heavy bass, tense minor key synth leads, cold sci-fi atmosphere, anime space shooter, no vocals, loopable`
- **battle_4:** `Instrumental epic orchestral rock battle theme, 165 BPM, strings and brass with distorted electric guitars and fast drums, climactic final chapter of an anime space war, no vocals, loopable`
- **boss:** `Instrumental intense boss fight music, 170 BPM, fast metal guitars, synth choir, dramatic minor key, anime mecha boss battle, no vocals, loopable`
- **boss_final:** `Instrumental final boss theme, 175 BPM, full orchestra with choir aahs, shredding electric guitar, thunderous drums, desperate and epic, anime sci-fi climax, no vocals, loopable`
- **menu:** `Instrumental calm future bass menu music, 92 BPM, soft synth chords, light percussion, dreamy and cozy sci-fi hangar, anime game, no vocals, seamless loop`
- **event:** `Instrumental festive electronic music, 140 BPM, playful synths and claps, fun anime game event, no vocals, loopable`
- **win:** `Short 5 second victory fanfare, bright brass and synth, anime game stage clear jingle, ends cleanly`
- **lose:** `Short 3 second sad descending synth chord, game over sting, ends cleanly`
- **unlock:** `Short 2 second magical sparkle chime with bright major chord, item unlock sound, anime game UI`

## 5. Xử lý file (em làm)

1. **Cắt loop:** script `tools/loop_music.py` (dùng ffmpeg):
   - đo BPM;
   - chọn điểm bắt đầu và kết thúc loop đúng đầu ô nhịp;
   - nối đuôi với đầu bằng crossfade ~50ms để không có tiếng "bụp" khi lặp lại;
   - chuẩn hoá âm lượng (−14 LUFS cho nhạc, tiếng chốt nhỏ hơn 2dB).
2. **Định dạng:** OGG Opus 80 kbps stereo. Loop 90 giây khoảng 0,9 MB.
   - 9 bài + 3 tiếng chốt khoảng **8–9 MB**, nên APK sẽ tăng từ 17,5 MB lên khoảng 26 MB.
   - Nếu muốn nhẹ hơn: 64 kbps (khoảng 6,5 MB), tai thường khó phân biệt.
3. **Lưu file:** `art/music/src/` giữ bản gốc, `art/music/` giữ bản đã cắt; khi build thì chép vào `www/music/`.

## 6. Gắn vào game (em làm)

- Thay `playMusic(name)` bằng trình phát dùng Web Audio:
  - tải file → `decodeAudioData` → `AudioBufferSourceNode` với `loop=true`, `loopStart` / `loopEnd`, nên loop liền mạch, không bị khựng như thẻ `<audio>`;
  - chuyển bài bằng crossfade 0,8 giây;
  - khi tạm dừng trận thì giảm nhỏ nhạc (−8 dB) thay vì cắt hẳn;
  - giữ nguyên nút bật/tắt và thanh âm lượng nhạc trong Cài đặt (`MUSG`).
- **Chọn bài:**
  - trận đấu: theo chương `battle_1…4`;
  - boss: `boss`, riêng màn boss cuối chương thì `boss_final`;
  - Sự kiện, Vô tận: `event`;
  - Home: `title`, các màn hình khác: `menu`.
- **Tải lười:** chỉ tải `title` và `menu` lúc mở app; bài trận tải khi bấm Xuất kích (file trong APK nên tải gần như tức thì).
- **Dự phòng:** nếu file lỗi thì dùng lại nhạc do code tạo như hiện nay.
- **Tiếng chốt** `win` / `lose` / `unlock` phát trên kênh nhạc, đồng thời giảm nhỏ nhạc nền 1 giây.

## 7. Các bước và ai làm

| Bước | Việc | Ai |
|---|---|---|
| 1 | Chọn model + gói trả phí (đề xuất ElevenLabs; hoặc Suno nếu anh đã có) | Anh |
| 2a | Có API key thì em gọi API tạo tất cả, mỗi bài 3–4 bản | Em |
| 2b | Không có API thì anh tạo trên web theo prompt ở mục 4 rồi gửi file | Anh |
| 3 | Nghe và chọn bản hay nhất (em làm 1 trang nghe thử, bấm chọn) | Anh |
| 4 | Cắt loop, nén, gắn vào game, thử trên trình duyệt | Em |
| 5 | Build APK gửi Telegram để nghe trên máy thật | Em |

**Làm thử trước:** chỉ 2 bài `title` + `battle_1` để anh duyệt phong cách. Ưng rồi mới làm 10 bài còn lại.
