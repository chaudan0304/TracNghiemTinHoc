# Chinh phục Tin học

Ứng dụng web trắc nghiệm Tin học Tiểu học (Chương trình GDPT 2018), hỗ trợ nhiều bài học, lưu kết quả trên đám mây (Neon Postgres) và trang quản lý điểm số dành riêng cho giáo viên.

## Cấu trúc dự án

- `index.html`: Trang chủ liệt kê các bài học từ `lessons/index.json`.
- `quiz.html`: Trang làm bài trắc nghiệm tương tác (`/quiz?bai=<id>`).
- `teacher.html`: Trang quản trị giáo viên (`/teacher`) xem bảng điểm, lọc theo lớp, tìm kiếm học sinh, xóa lượt nộp và xuất Excel/CSV.
- `lessons/`: Ngân hàng câu hỏi trắc nghiệm dạng JSON.
- `api/submit.js`: API nhận bài làm, chấm điểm trên máy chủ và lưu vào cơ sở dữ liệu.
- `api/teacher.js`: API xác thực giáo viên (rate-limit chống dò pass), truy vấn kết quả, xóa lượt nộp.
- `api/status.js`: API kiểm tra trạng thái kết nối CSDL.

## Danh sách bài học hiện có

1. **Lớp 3:** `lop-3-thong-tin-va-quyet-dinh` - *Bài 1. Thông tin và quyết định* (10 câu)
2. **Lớp 4:** `lop-4-bai-6` - *Bài 6. Bản quyền sử dụng phần mềm* (20 câu)
3. **Lớp 4:** `lop-4-tim-kiem-thong-tin-internet` - *Bài 3. Tìm kiếm thông tin trên Internet* (10 câu)
4. **Lớp 4:** `lop-4-on-tap-may-tinh` - *Ôn tập: Sử dụng máy tính an toàn* (5 câu)
5. **Lớp 5:** `lop-5-lap-trinh-scratch-co-ban` - *Bài 8. Làm quen với lập trình trực quan Scratch* (10 câu)

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
2. Thêm `<id>` vào danh sách trong `lessons/index.json`.
3. Chạy `npm test` để kiểm tra tính hợp lệ của dữ liệu.
4. Triển khai lên Vercel: `npx vercel deploy --prod`.

## Biến môi trường (Vercel Production)

- `DATABASE_URL`: Chuỗi kết nối Neon Postgres (tự động cấu hình qua Vercel Storage).
- `TEACHER_PASSWORD`: Mật khẩu giáo viên để đăng nhập trang `/teacher`.
- `SESSION_SECRET`: Chuỗi khóa bảo mật tối thiểu 32 ký tự để ký phiên đăng nhập HMAC SHA-256.
