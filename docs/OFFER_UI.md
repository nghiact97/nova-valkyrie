# Nova Valkyrie: thiết kế UI các loại ưu đãi (Offer)

Ngày lập: 29/10/2026. Mẫu đầu tiên đã duyệt: **gói nhân vật Seraphina** (`POPS.offer` trong `tools/anime-mock.mjs`, CSS `offer`, class `vkoffer` / `vo-*`).

Ưu đãi **không dùng khung dialog chuẩn** (xem `DIALOG_PLAN.md`). Mỗi ưu đãi là một **trang toàn màn** có nhân vật hoặc vật phẩm lớn làm trung tâm, vì đây là màn bán hàng, phải gây ấn tượng hơn dialog thường.

## 1. Bố cục chung (mọi loại ưu đãi)

```
┌──────────────────────────────────────┐
│ (1) TÊN LỚN              (6) [◇ ×]   │
│     dòng phụ · độ hiếm   (5) Còn 20:08│
│ (2) [tag hồng: GÓI GIỚI HẠN · −50%]   │
│                                      │
│        (3) vầng nền xoay              │
│     (4) NHÂN VẬT / VẬT PHẨM LỚN       │
│        lơ lửng, có bụi sáng           │
│                                      │
│ (7)[xem trước] + [ô][ô][ô]            │
│ (8)   chỉ số / mô tả 1–2 dòng         │
│ (9)   [   $29.99  $14.99   ]          │
│ (10)  ghi chú nhỏ                     │
└──────────────────────────────────────┘
```

| # | Vùng | Quy tắc |
|---|---|---|
| 1 | Tên | Saira Condensed nghiêng 46px, chữ gradient theo **màu chủ đề** của ưu đãi, đổ bóng tối + phát sáng |
| 2 | Tag | tấm nghiêng hồng `#ff6fae`, nội dung là lý do mua: "GÓI GIỚI HẠN · −50%", "LẦN ĐẦU NẠP ×2", "CHỈ HÔM NAY" |
| 3 | Vầng nền | CSS thuần, không cần ảnh: tia xoay (`repeating-conic-gradient`) + quầng sáng + 2 vòng tròn. Đổi **hình vầng** theo chủ đề (bảng mục 3) |
| 4 | Trung tâm | ảnh đứng `stand_<id>.png` cao 62% màn, lơ lửng nhẹ. Ưu đãi không có nhân vật thì dùng ảnh vật phẩm lớn |
| 5 | Đồng hồ | góc phải dưới nút đóng, nền kính, viền trái theo màu chủ đề. Không có hạn thì ẩn |
| 6 | Nút đóng | kim cương, giống dialog chuẩn |
| 7 | Hàng quà | ô **xem trước** (dạng chiến đấu / skin trong trận) + dấu "+" + **tối đa 3 ô quà**. Ô quà vát góc, màu theo loại quà: vàng = tiền tệ, tím = kỹ năng/độc quyền, cyan = vật phẩm |
| 8 | Mô tả | tối đa 2 dòng: chỉ số (số xanh lá), rồi tên ULT/đặc quyền (vàng) + mô tả ngắn |
| 9 | Nút giá | nút bình hành vàng, rộng 290px, giá gạch ngang mờ + giá thật. Đã mua thì "Đã sở hữu" màu xám |
| 10 | Ghi chú | 1 dòng nhỏ: giới hạn mua, quà trùng đổi thành gì |

**Hiệu ứng:** nhân vật lơ lửng 3.4s; vầng nền xoay chậm 50s; 6 tia lấp lánh nhấp nháy lệch nhịp; ô quà hiện lần lượt cách nhau 80ms.

**Nội dung:** nhân vật mặc kín đáo (mức Teen), không copy bố cục chữ hay biểu tượng của game khác.

## 2. Các loại ưu đãi

| Loại | Trung tâm (4) | Màu chủ đề | Vầng nền (3) | Hàng quà (7) | Nút (9) | Tần suất |
|---|---|---|---|---|---|---|
| **A. Gói nhân vật** (đã làm: Seraphina) | ảnh đứng nhân vật | theo nhân vật | theo hệ nhân vật | xem trước = tàu/dạng chiến + gem + coin + ULT | giá thật | khi ra nhân vật mới |
| **B. Gói khởi đầu** (Starter) | Mika vẫy tay + hộp quà | cyan `#5ee7ff` | vòng bệ hologram | Mika sao +1, 300 gem, 10K coin | giá rẻ $0.99–1.99 | hiện 1 lần sau màn 1-3 |
| **C. Nạp lần đầu ×2** | đống kim cương lớn | hồng `#ff6fae` | tia hồng + kim cương bay | 3 mốc gói gem, mỗi mốc ghi "×2" | chuyển sang Shop | đến khi nạp lần đầu |
| **D. Trang phục (skin)** | nhân vật mặc skin | màu skin | theo chủ đề skin | xem trước = sprite skin trong trận + bonus chỉ số khi mặc | giá thật | sự kiện / lễ |
| **E. Thẻ tháng** | thẻ bài lớn có chân dung nhân vật | vàng `#ffd36b` | tia vàng | "nhận ngay" + "mỗi ngày ×30" | giá thật | luôn có trong Shop |
| **F. Gói hồi sinh / năng lượng** | Mika mặt lo lắng | đỏ `#ff5164` | không có tia, chỉ quầng | năng lượng + vé hồi sinh | gem hoặc xem quảng cáo | khi hết năng lượng / thua 3 lần |
| **G. Gói sự kiện** | nhân vật sự kiện | màu sự kiện | theo sự kiện | vật phẩm sự kiện + gem | giá thật | trong thời gian sự kiện |

### Vầng nền theo hệ nhân vật (dùng cho A, D, G)

| Nhân vật | Hệ | Vầng nền |
|---|---|---|
| Mika (Kestrel) | gió / tân binh | vòng bệ hologram cyan + đường gió |
| Suzu (Viper) | laser | các tia laser xanh lá chéo |
| Kaede (Raptor) | tên lửa | vệt khói cam + vòng ngắm |
| Elle (Halo) | quả cầu | vòng hào quang tím có cầu xoay |
| Raika (Tempest) | sét | tia sét xanh điện nhấp nháy |
| Noa (Nebula) | tinh vân | trăng lưỡi liềm hồng + bụi sao |
| Seraphina (Seraph) | mặt trời | **mặt trời tia xoay vàng** (đã làm) |
| Nyx (Oblivion) | hư không | lỗ đen tím xoáy ngược |

## 3. Dữ liệu (để thêm ưu đãi không phải viết lại HTML)

Hiện gói Seraphina viết thẳng trong `POPS.offer`. Bước tiếp theo: chuyển thành bảng `OFFERS` và một hàm dựng chung `offerPage(o)`:

```js
const OFFERS = {
  seraph: {
    type: "char",                 // char | starter | firstpay | skin | monthly | rescue | event
    name: "SERAPHINA", sub: ["SOLAR COMMANDER", "CHỈ HUY MẶT TRỜI"], rar: "L",
    tag: ["LIMITED BUNDLE · −50%", "GÓI GIỚI HẠN · −50%"],
    theme: "#ffd36b", halo: "sun",           // tên kiểu vầng nền ở mục 2
    art: "seraph",                            // GIRL_SRC key (ảnh đứng)
    preview: "ship_seraph",                   // sprite cho ô xem trước
    items: [{g: 800}, {c: 20000}, {ult: "seraph"}],
    product: "nv_seraph", was: "$29.99", price: "$14.99",
    ends: "daily",                            // daily | <timestamp> | null
    once: true,
    note: ["One-time offer · Seraphina joins your squad forever", "Chỉ mua 1 lần · Seraphina gia nhập đội vĩnh viễn"],
  },
};
```

Thêm ưu đãi mới = thêm một mục vào `OFFERS` + một mã sản phẩm Play Billing (`product`) + art trung tâm. Kiểu vầng nền mới thì thêm một class CSS `vo-halo-<tên>`.

## 4. Art cần cho mỗi ưu đãi

| Loại | Ảnh cần | Ghi chú cho Codex |
|---|---|---|
| A, G | `stand_<id>.png` (đã có nếu nhân vật đã làm) | dùng lại ảnh đứng Home |
| B | `offer_starter.png`: Mika vẫy tay ôm hộp quà, nền trong | đính kèm `style_a_mika.png` |
| C | `offer_gems.png`: đống kim cương hồng phát sáng, nền trong | cùng kiểu tô màu với icon tiền tệ phẳng thì không hợp, vẽ kiểu anime-render như ảnh nhân vật |
| D | `skin_<id>_<skin>.png` + sprite trận `fly_<id>_<skin>.png` | đính kèm ảnh đứng gốc của nhân vật để giữ mặt |
| E | `offer_monthly.png`: thẻ bài có chân dung | |
| F | dùng `face_kestrel_worried.png` (đã có trong `DIALOG_PLAN.md`) | |

## 5. Việc tiếp theo

1. Chuyển `POPS.offer` sang `OFFERS` + `offerPage()` (mục 3).
2. Làm loại **B Starter** và **C Nạp lần đầu**: hai loại này kéo doanh thu đầu game mạnh nhất.
3. Shop có tab "Ưu đãi" liệt kê các thẻ ưu đãi đang mở; bấm vào mở trang toàn màn.
4. Nút "Special Offer" ở Home xoay vòng giữa các ưu đãi đang mở, ưu tiên cái sắp hết hạn.
