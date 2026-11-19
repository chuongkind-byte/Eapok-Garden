# Eapok Garden — Website

Website giới thiệu homestay / khu nghỉ dưỡng sân vườn Eapok Garden — Quảng Phú, Đắk Lắk.

- Hotline: 0356486852
- Địa chỉ: Số nhà 5A, Đội 5, Buôn Sut Mgru, Quảng Phú, Đắk Lắk
- 7 phòng: Phòng đơn, Bungalow, Phòng view cánh đồng, Phòng Master
- Bảng giá theo giờ / qua đêm / 1 ngày, có công cụ tính giá ước tính bằng JavaScript

## Cấu trúc

```
index.html          Trang chính
css/style.css       Toàn bộ CSS (kèm font tự host)
js/main.js          JavaScript: tính giá, lọc thư viện ảnh, lightbox, form đặt phòng
assets/photos/      Ảnh thật của homestay (theo từng loại phòng / khuôn viên)
assets/logo/        Các biến thể logo chính thức (SVG + PNG nền trong suốt)
assets/extra/       Ảnh đã nhúng trong bản xuất (nếu có file không khớp ảnh gốc)
fonts/              Font Quicksand, Playfair Display, Be Vietnam Pro (woff2, tự host)
```

## Chạy thử

Mở `index.html` bằng trình duyệt, hoặc chạy server tĩnh:

```
python3 -m http.server
```

rồi mở http://localhost:8000

## Ghi chú

- Form đặt phòng chỉ gửi yêu cầu, nhân viên sẽ liên hệ xác nhận qua hotline/Zalo.
- Website không cần backend, không cần build.
GitHub Write Permission Test - Eapok Garden
