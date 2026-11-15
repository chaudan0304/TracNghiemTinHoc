# Chinh phục Tin học

Trang chủ `index.html` liệt kê các bài trong `lessons/index.json`. Trang `quiz.html` đọc bài học theo tham số `?bai=<id>`.

## Thêm bài học

1. Tạo `lessons/<id>.json` theo cấu trúc của `lessons/lop-4-on-tap-may-tinh.json`.
2. Đặt `id` giống tên tệp, dùng chữ thường, số và dấu gạch ngang.
3. Thêm `id` vào `lessons/index.json`.
4. Kiểm tra mỗi câu có bốn phương án và `correctIndex` từ 0 đến 3. Điểm tối đa = số câu × `pointsPerQuestion`.
5. Chạy kiểm tra dữ liệu rồi triển khai lại trên Vercel.

## Giới hạn hiện tại

Khi chưa có cơ sở dữ liệu, kết quả chỉ lưu trên trình duyệt làm bài. Khi đã kết nối Neon trong Vercel Storage và đặt các biến môi trường bên dưới, `/api/submit` lưu lượt làm vào cơ sở dữ liệu; `/teacher.html` hiển thị kết quả theo từng bài, mỗi lần 100 lượt và có nút xuất CSV. Điểm lưu trên máy chủ được tính lại từ đáp án học sinh gửi.

Biến môi trường cần đặt cho Production:

- `DATABASE_URL`: chuỗi kết nối do Vercel/Neon tạo; nếu Vercel cung cấp `POSTGRES_URL` thì ứng dụng cũng nhận biến đó.
- `TEACHER_PASSWORD`: mật khẩu mạnh riêng cho trang giáo viên.
- `SESSION_SECRET`: chuỗi ngẫu nhiên dài ít nhất 32 ký tự để ký phiên đăng nhập.

Sau khi đặt biến môi trường hoặc kết nối Neon, cần triển khai lại. Không đưa các giá trị bí mật vào Git. Không dùng kết quả này như bài kiểm tra bảo mật cao: câu hỏi và đáp án vẫn được tải tới trình duyệt để học sinh nhận phản hồi ngay khi làm bài.

Vercel CLI có thể triển khai trang tĩnh; để quản lý lâu dài, cần đăng nhập tài khoản Vercel và kết nối một kho Git. Bản triển khai tạm không thay thế bước này.
