# Chuyển máy bay trong trận sang phong cách anime: kế hoạch + từ khoá Huaban

## 1. Hiện trạng

Trong trận vẫn dùng sprite máy bay kiểu sci-fi thường của bản gốc. Ngoài trận thì đã toàn là anime: phi công, Home, chương, drone thú cưng.

| Nhóm | Số lượng | Sprite hiện tại | Vai trò |
|---|---|---|---|
| Tàu người chơi | 8 | `ship_kestrel`, `viper`, `halo`, `seraph`, `raptor`, `tempest`, `nebula`, `oblivion` | Mỗi Valkyrie một tàu |
| Địch thường | 5 | `enemy_grunt`, `dart`, `tank`, `orb`, `elite` | Bay theo đội hình |
| Boss phụ (elite) | 8 | `miniboss_carrier`, `sniper`, `minelayer`, `shield`, `turret`, `splitter`, `wraith`, `charger` | Giữa màn |
| Boss chương | 10 | `boss1` → `boss10` | Cuối màn x-5, x-10 |

Tổng cộng **31 sprite**. Drone đã thành thú cưng robot, không cần làm lại.

## 2. Hướng chuyển đổi (anh chọn)

### Người chơi

| Hướng | Mô tả | Ưu | Nhược |
|---|---|---|---|
| **A. Cô gái bay (đề xuất)** | Valkyrie mặc giáp mecha bay, nhìn từ sau lưng hơi chếch trên, cánh/động cơ toả ra hai bên | Đúng chất "anime bắn máy bay", khớp với Home và Xưởng | Cần vẽ 8 cô, mỗi cô một dáng bay |
| B. Tàu anime | Giữ máy bay nhưng vẽ lại kiểu mecha anime: trắng, đường cong mềm, đèn xanh, có biểu tượng của từng cô | Dễ nhìn hitbox, ít công | Vẫn là máy bay, ít chất anime |

### Địch và boss

| Nhóm | Đề xuất |
|---|---|
| Địch thường | Drone mecha nhỏ đáng yêu kiểu anime (đầu tròn, mắt đèn, cánh nhỏ), tông đỏ/tím đối lập với phe mình trắng-xanh |
| Boss phụ | Mecha cỡ vừa có "cá tính" (khiên, súng bắn tỉa, rải mìn…), nhìn là biết kiểu tấn công |
| Boss chương | **Cô gái đối thủ trong giáp mecha khổng lồ**: dùng 4 nhân vật đối thủ đã vẽ cho banner chương (Vesper, Carmine, Iris, Selene), mỗi người một bộ giáp lớn. 6 boss còn lại là mecha/chiến hạm khổng lồ có lõi phát sáng |

## 3. Yêu cầu kỹ thuật cho mọi sprite (để ảnh tham khảo đúng hướng)

- **Góc nhìn:** từ trên xuống, hơi chếch (top-down 3/4).
  - Người chơi quay **lên trên**.
  - Địch và boss quay **xuống dưới**.
- **Bóng nổi bật trên nền vũ trụ tối:**
  - Phe mình trắng + xanh cyan.
  - Phe địch đỏ / tím / đen.
- **Kích thước trong game:**
  - Người chơi khoảng 70px.
  - Địch thường 30–45px.
  - Boss phụ 70px.
  - Boss khoảng 160–200px.
- Vì sprite nhỏ nên cần **hình khối rõ, ít chi tiết vụn**.
- **Nền trong suốt;** đối xứng trái phải càng tốt (dễ làm hiệu ứng nghiêng khi bay).

## 4. Từ khoá tìm trên Huaban (花瓣)

Gõ nguyên cụm tiếng Trung vào ô tìm kiếm. Nên mở cả mục **画板** (bảng sưu tập) vì người ta hay gom sẵn cả bộ.

### 4.1 Người chơi: cô gái bay (hướng A)

| Từ khoá | Nghĩa |
|---|---|
| `机娘 飞行` | cô gái mecha đang bay |
| `机甲少女 背影 飞行` | thiếu nữ giáp mecha, nhìn từ sau lưng |
| `机娘 俯视 游戏素材` | cô gái mecha nhìn từ trên xuống, tài nguyên game |
| `STG 自机 少女` | nhân vật người chơi trong game bắn máy bay là cô gái |
| `弹幕游戏 自机 立绘` | tranh nhân vật người chơi game đạn mạc |
| `机甲翼 少女 设定` | thiết kế cô gái có cánh mecha |
| `白色机甲 蓝色发光 少女` | giáp trắng phát sáng xanh, cùng tông Mika |

### 4.2 Người chơi: tàu anime (hướng B)

| Từ khoá | Nghĩa |
|---|---|
| `二次元 战机 设计` | thiết kế chiến cơ phong cách anime |
| `科幻战机 俯视 游戏素材` | chiến cơ sci-fi nhìn từ trên, tài nguyên game |
| `飞行射击 主角战机` | máy bay nhân vật chính game bắn máy bay |
| `白色 战机 赛璐璐` | chiến cơ trắng tô kiểu cel anime |

### 4.3 Địch thường

| Từ khoá | Nghĩa |
|---|---|
| `Q版 机械 无人机` | drone máy móc kiểu chibi |
| `萌系 机器人 敌人 设计` | robot địch dễ thương |
| `飞行射击 敌机 素材` | máy bay địch trong game bắn máy bay |
| `科幻 小怪 设计 俯视` | quái nhỏ sci-fi nhìn từ trên |
| `机械虫 设计` | côn trùng máy (hợp với Hive, Swarm) |

### 4.4 Boss phụ

| Từ khoá | Nghĩa |
|---|---|
| `机甲 精英怪 设计` | quái tinh anh dạng mecha |
| `科幻 炮台 机甲 设计` | mecha dạng tháp pháo (Turret, Sniper) |
| `护盾 机甲 设计` | mecha mang khiên (Shield) |
| `二次元 机械 怪物` | quái vật máy kiểu anime |

### 4.5 Boss chương

| Từ khoá | Nghĩa |
|---|---|
| `机娘 BOSS 立绘` | boss là cô gái mecha |
| `巨型机甲 少女 驾驶` | cô gái điều khiển mecha khổng lồ |
| `弹幕 BOSS 设计` | thiết kế boss game đạn mạc |
| `机械天使 设计` | thiên thần máy (hợp boss Solar, Eclipse) |
| `暗黑 机甲 女武神` | nữ chiến binh Valkyrie giáp tối (đối thủ) |
| `科幻 母舰 俯视` | chiến hạm mẹ nhìn từ trên (boss Dreadnought, Hive) |

**Từ khoá thêm để lọc đúng phong cách:**
- `日系` (kiểu Nhật);
- `赛璐璐` (tô cel);
- `游戏原画` (tranh gốc game);
- `透明背景` (nền trong suốt);
- `设定图` (bản thiết kế nhân vật).

## 5. Cách anh gửi ảnh tham khảo

1. Mỗi nhóm lưu **3–6 ảnh** anh thích vào thư mục tương ứng:
   - `art/anime/refs/player/`
   - `art/anime/refs/enemy/`
   - `art/anime/refs/elite/`
   - `art/anime/refs/boss/`
2. Ghi chú ngắn (tên file hoặc nhắn em) điểm anh thích ở mỗi ảnh: dáng, màu, chất liệu…
3. Ảnh Huaban **chỉ làm tham khảo phong cách**. Không đưa thẳng vào game vì phần lớn có bản quyền của tác giả; sau vụ Mika giống Skysaber thì càng phải cẩn thận.

## 6. Các bước sau khi có ảnh (em làm)

| Bước | Việc | Ghi chú |
|---|---|---|
| 1 | Em xem ảnh tham khảo, viết bảng thiết kế cho từng sprite: dáng, màu, điểm nhận dạng | Dựa trên ảnh + 5 phi công đã có |
| 2 | Vẽ thử 1 mẫu mỗi nhóm (Mika bay, 1 địch, 1 boss phụ, 1 boss) bằng Codex, hoặc lệnh GPT nếu Codex hết lượt | Ghép vào trận thật để anh duyệt |
| 3 | Anh duyệt → vẽ nốt cả bộ 31 sprite theo đúng mẫu đã duyệt | Khoá góc nhìn, ánh sáng, nét như quy tắc "đã duyệt thì không đổi" |
| 4 | Cắt nền, chỉnh kích thước, thêm hiệu ứng nghiêng khi bay và hiệu ứng nổ | Đạn mới đã sẵn |
| 5 | Build APK gửi Telegram | |

**Thứ tự đề xuất:** Mika bay trước (thấy ngay ở mọi màn) → 5 địch thường → boss chương 1-5 / 1-10 → 7 Valkyrie còn lại → boss phụ → các boss còn lại.

## 7. Cần anh quyết

1. Người chơi: **A (cô gái bay)** hay **B (tàu anime)**?
2. Boss chương: dùng **4 cô đối thủ trong giáp mecha** như đề xuất, hay toàn bộ là mecha/chiến hạm?
