# Chinh phục Tin học

Ứng dụng web luyện tập trắc nghiệm Tin học Tiểu học (Chương trình GDPT 2018), hỗ trợ nhiều bài học, lưu kết quả trên đám mây (Neon Postgres) và trang quản lý điểm số dành riêng cho giáo viên. Đáp án được tải xuống trình duyệt để học sinh xem lại; điểm số là kết quả luyện tập, không dùng làm điểm kiểm tra có xác thực.

## Cấu trúc dự án

- `index.html`: Trang chủ liệt kê các bài học từ `lessons/index.json`.
- `quiz.html`: Trang làm bài trắc nghiệm tương tác (`/quiz?bai=<id>`).
- `teacher.html`: Trang quản trị giáo viên (`/teacher`) xem bảng điểm, thống kê toàn bộ lượt nộp theo bộ lọc, xóa lượt nộp và xuất Excel/CSV.
- Mỗi lần mở trang giáo viên cần nhập lại mật khẩu; phiên đăng nhập cũ được xóa khi trang tải.
- Sau khi nộp bài, học sinh có thể ôn lại riêng các câu trả lời sai hoặc bỏ trống; lượt ôn này không ghi thêm điểm. Giáo viên xem thống kê từng câu và số lượt chọn mỗi đáp án theo bài, lớp, tên học sinh.
- `lessons/`: Ngân hàng câu hỏi trắc nghiệm dạng JSON.
- `api/submit.js`: API nhận bài làm, chấm điểm trên máy chủ và lưu vào cơ sở dữ liệu; giới hạn 300 lượt nộp trong 15 phút cho mỗi địa chỉ và bài học.
- `api/teacher.js`: API xác thực giáo viên (rate-limit chống dò pass), truy vấn kết quả, xóa lượt nộp.
- `api/status.js`: API kiểm tra trạng thái kết nối CSDL.

## Danh sách bài học hiện có

Ngân hàng có đủ 16 bài lớp 3, 17 mục bài lớp 4 (gồm 12A/12B) và 18 mục bài lớp 5 (gồm 8A/8B, 9A/9B) theo ba SGK Tin học của Nhà xuất bản Giáo dục Việt Nam. Mỗi bài có 20 câu hỏi luyện tập, mỗi câu 0,5 điểm, tổng tối đa 10 điểm. Ba bài luyện tập cũ vẫn được giữ ở cuối danh sách để bảo toàn liên kết và lịch sử kết quả.

Mỗi lớp có thêm hai đề ôn tập học kì I và II, mỗi đề 20 câu. Phạm vi theo kế hoạch dạy học: lớp 3 học kì I đến Bài 7, học kì II Bài 8–16; lớp 4 học kì I đến Bài 9 (tiết 1), học kì II từ Bài 9 (tiết 2) đến Bài 16, chọn nhánh 12B; lớp 5 học kì I đến Bài 8A, học kì II từ Bài 9A đến Bài 16. Tổng danh mục hiện có 60 bài và đề ôn tập.

Nguồn đối chiếu: [SGK Tin học 3](https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-3.4698739161), [SGK Tin học 4](https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-4.4698914396), [SGK Tin học 5](https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-5.4699814459). Câu hỏi được biên soạn lại để luyện tập các khái niệm và thao tác trong sách, không sao chép nguyên văn nội dung SGK.

Danh sách bài, câu hỏi và đáp án nằm trong `lessons/`. Các tệp `lesson-bank.py`, `lesson_bank_20.py` và `review_bank.py` chứa nội dung gốc; chạy `python lesson-bank.py` để tạo lại JSON và danh mục sau khi sửa ngân hàng câu hỏi.

## Cách thêm bài học mới

1. Tạo tệp `lessons/<id>.json` theo mẫu:
   ```json
   {
     "id": "lop-4-ten-bai",
     "subjectBadge": "TIN HỌC LỚP 4",
     "lessonTitle": "Tên bài học",
     "gameTitle": "CHINH PHỤC TIN HỌC",
     "pointsPerQuestion": 1,
     "timeLimitSeconds": 600,
     "questions": [
       {
         "question": "Nội dung câu hỏi?",
         "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
         "correctIndex": 0,
         "explanation": "Giải thích chi tiết vì sao đáp án đúng."
       }
     ]
   }
   ```
2. Thêm `<id>` vào danh sách trong `lessons/index.json`. Nếu chỉnh bài hoặc đề được tạo tự động, hãy sửa tệp nguồn Python tương ứng rồi chạy lại `python lesson-bank.py` để tránh bị ghi đè lần sau.
3. Chạy `npm test` để kiểm tra tính hợp lệ của dữ liệu.
4. Triển khai lên Vercel: `npx vercel deploy --prod`.

## Biến môi trường (Vercel Production)

- `DATABASE_URL`: Chuỗi kết nối Neon Postgres (tự động cấu hình qua Vercel Storage).
- `TEACHER_PASSWORD`: Mật khẩu giáo viên để đăng nhập trang `/teacher`.
- `SESSION_SECRET`: Chuỗi khóa bảo mật tối thiểu 32 ký tự để ký phiên đăng nhập HMAC SHA-256.
