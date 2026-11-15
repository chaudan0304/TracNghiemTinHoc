# Chinh phục Tin học

Trang chủ `index.html` liệt kê các bài trong `lessons/index.json`. Trang `quiz.html` đọc bài học theo tham số `?bai=<id>`.

## Thêm bài học

1. Tạo `lessons/<id>.json` theo cấu trúc của `lessons/lop-4-on-tap-may-tinh.json`.
2. Đặt `id` giống tên tệp, dùng chữ thường, số và dấu gạch ngang.
3. Thêm `id` vào `lessons/index.json`.
4. Kiểm tra mỗi câu có bốn phương án và `correctIndex` từ 0 đến 3. Điểm tối đa = số câu × `pointsPerQuestion`.
5. Chạy kiểm tra dữ liệu rồi triển khai lại trên Vercel.

## Giới hạn hiện tại

Ứng dụng chưa có cấu hình Firebase trong dự án này. Kết quả chỉ lưu trên trình duyệt làm bài; bảng giáo viên trên thiết bị khác sẽ không thấy. Không dùng kết quả này để đánh giá chính thức cho đến khi có xác thực giáo viên, Firestore Security Rules và kiểm tra điểm phía máy chủ. Mã PIN giao diện hiện tại chỉ là khóa tiện ích trên thiết bị, không phải cơ chế phân quyền dữ liệu.

Vercel CLI có thể triển khai trang tĩnh; để quản lý lâu dài, cần đăng nhập tài khoản Vercel và kết nối một kho Git. Bản triển khai tạm không thay thế bước này.
