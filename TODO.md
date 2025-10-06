# TODO: Cải tiến hiệu ứng ánh sáng lồng đèn bay

## Các bước thực hiện:

- [x] Chỉnh sửa phương thức display() trong class Lantern trong lantern_rain.js để thêm hiệu ứng ánh sáng chân thật hơn:
  - Thêm lớp glow ngoài với ellipse lớn hơn và alpha thấp hơn.
  - Sử dụng gradient radial cho glow.
  - Biến đổi màu sắc dựa trên flicker để tạo hiệu ứng ấm áp hơn.
  - Thêm hiệu ứng lấp lánh ngẫu nhiên cho chân thật.
- [x] Kiểm tra hiệu ứng trên trình duyệt để đảm bảo chân thật, điều chỉnh để đều, giảm vùng sáng, tăng độ nét.

## Thông tin thu thập:

- Hiệu ứng hiện tại sử dụng ellipse với blend mode "screen" và tint cho hình ảnh.
- Để chân thật hơn, cần thêm nhiều lớp, gradient, và biến đổi động.

## File phụ thuộc:

- LongDen_1/CodeLongDenBay/lantern_rain.js
