# Chinh phục Tin học

Ứng dụng web luyện tập trắc nghiệm Tin học Tiểu học theo Chương trình GDPT 2018. Ngân hàng câu hỏi và kết quả luyện tập được lưu trên Neon Postgres. Học sinh nhận phản hồi khi chọn đáp án và xem lại bài đã làm.

## Cấu trúc dự án

Sau khi chỉnh JavaScript trong `ui/` hoặc đổi lớp CSS Tailwind của trang làm bài, chạy `npm run build:ui` và cập nhật các tệp sinh ra trong `assets/` trước khi triển khai.

- `index.html`: Trang chủ lấy danh mục bài học từ `GET /api/lessons`.
- `quiz.html`: Trang làm bài trắc nghiệm tương tác (`/quiz?bai=<id>`).
- `teacher.html`: Trang giáo viên (`/teacher`) thêm bài, xem bảng điểm, lọc thống kê và xuất báo cáo.
- Mỗi lần mở trang giáo viên cần nhập lại mật khẩu; phiên đăng nhập cũ được xóa khi trang tải.
- Sau khi nộp bài, học sinh có thể ôn lại riêng các câu trả lời sai hoặc bỏ trống; lượt ôn này không ghi thêm điểm. Giáo viên xem thống kê từng câu và số lượt chọn mỗi đáp án theo bài, lớp, tên học sinh.
- Giáo viên có thể ẩn hoặc hiện khu vực thống kê câu hỏi sai; lựa chọn được nhớ trên trình duyệt đang dùng.
- `lessons/`: Dữ liệu để nạp 60 bài ban đầu. Vercel loại thư mục này khỏi bản triển khai. [Tài liệu cấu hình tệp triển khai Vercel](https://vercel.com/docs/deployments/vercel-ignore)
- `api/lessons.js`: Đọc danh mục, tải câu hỏi và phản hồi từ Neon. Thêm bài yêu cầu phiên đăng nhập giáo viên.
- `api/submit.js`: API nhận bài làm, chấm điểm trên máy chủ và lưu vào cơ sở dữ liệu; giới hạn 300 lượt nộp trong 15 phút cho mỗi địa chỉ và bài học.
- `api/teacher.js`: API xác thực giáo viên (rate-limit chống dò pass), truy vấn kết quả, xóa lượt nộp.
- `api/status.js`: API kiểm tra trạng thái kết nối CSDL.

## Danh sách bài học hiện có

Ngân hàng có đủ 16 bài lớp 3, 17 mục bài lớp 4 (gồm 12A/12B) và 18 mục bài lớp 5 (gồm 8A/8B, 9A/9B) theo ba SGK Tin học của Nhà xuất bản Giáo dục Việt Nam. Mỗi bài có 20 câu hỏi luyện tập, mỗi câu 0,5 điểm, tổng tối đa 10 điểm. Ba bài luyện tập cũ vẫn được giữ ở cuối danh sách để bảo toàn liên kết và lịch sử kết quả.

Mỗi lớp có thêm hai đề ôn tập học kì I và II, mỗi đề 20 câu. Phạm vi theo kế hoạch dạy học: lớp 3 học kì I đến Bài 7, học kì II Bài 8–16; lớp 4 học kì I đến Bài 9 (tiết 1), học kì II từ Bài 9 (tiết 2) đến Bài 16, chọn nhánh 12B; lớp 5 học kì I đến Bài 8A, học kì II từ Bài 9A đến Bài 16. Tổng danh mục hiện có 60 bài và đề ôn tập.

Nguồn đối chiếu: [SGK Tin học 3](https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-3.4698739161), [SGK Tin học 4](https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-4.4698914396), [SGK Tin học 5](https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-5.4699814459). Câu hỏi được biên soạn lại để luyện tập các khái niệm và thao tác trong sách, không sao chép nguyên văn nội dung SGK.

Các tệp `lesson-bank.py`, `lesson_bank_20.py` và `review_bank.py` lưu nguồn biên soạn ban đầu. Lệnh `python lesson-bank.py` tạo lại dữ liệu khởi tạo từ các nguồn này.

## Cách thêm bài học mới

Đăng nhập trang **Giáo viên** và mở **Thêm bài học**. Nếu tài khoản có nút chuyển chế độ, hãy chọn **Chỉnh sửa** trước.

- **Nhập trực tiếp.** Chọn khối, nhập tên bài, thời gian và từng câu hỏi. Mỗi câu có bốn phương án, một đáp án đúng và phần giải thích tùy chọn.
- **Nhập từ Excel.** Tải mẫu `.xlsx`, điền mỗi câu một dòng và lặp lại khối, tên bài, thời gian ở mọi dòng thuộc cùng bài. Điền đáp án bằng A, B, C hoặc D. Sau khi chọn tệp, kiểm tra danh sách xem trước rồi bấm **Lưu các bài trong tệp**.

Mỗi bài có tối đa 100 câu và được chấm theo thang điểm 10. Một lượt nhập Excel hỗ trợ tối đa 20 bài, 500 câu và tệp 2 MB. Bài mới xuất hiện trên trang học sinh ngay sau khi lưu. Tên hoặc mã trùng trong cùng khối sẽ dừng cả lượt lưu.

Tên bài mới hiển thị kèm người tạo. Admin có thể đặt **Tên hiển thị trên bài học** cho từng giáo viên trong mục **Tài khoản giáo viên**. Nếu ô này để trống, bài dùng tên đăng nhập lúc tạo.

## Tài khoản và phân quyền

- **Admin** đăng nhập bằng tên `admin` và mật khẩu giáo viên hiện tại. Mục **Tài khoản giáo viên** dùng để tạo tài khoản, ghi môn dạy, giao lớp, chọn quyền quản lý thông tin học sinh, đặt lại mật khẩu và khóa tài khoản. Admin xem điểm tất cả các lớp, có quyền sửa thông tin hoặc gộp tên học sinh và xóa lượt làm.
- **Giáo viên** đăng nhập bằng tài khoản riêng để xem và xuất điểm các lớp được giao. Quyền **Chỉ xem** là mặc định. Quyền **Chỉnh sửa** cho phép sửa họ tên và chuyển học sinh giữa các lớp được giao trong **Bảng xếp hạng → Bảng vàng Học sinh**. Giáo viên đăng nhập lại sau khi admin đổi quyền. Cả hai vai trò đều được thêm bài trực tiếp và nhập bài từ Excel.

Admin và giáo viên có quyền sửa thông tin học sinh thấy hai nút **Xem** và **Chỉnh sửa**. Trang mở ở chế độ **Xem**. Tài khoản **Chỉ xem** có thể mở **Thêm bài học** trực tiếp.

Admin có thể mở **Lịch sử chỉnh sửa** để xem tài khoản thực hiện, thời điểm theo giờ Việt Nam, họ tên và lớp trước–sau, và số lượt làm bị ảnh hưởng khi sửa hoặc gộp thông tin học sinh.

Điểm do hệ thống chấm khi nộp bài. Khi nâng cấp một cơ sở dữ liệu đã phục vụ phiên bản có chức năng sửa điểm, chạy `node scripts/lock-attempt-scores.mjs` với biến kết nối của môi trường đích để chặn cập nhật điểm qua các bản triển khai cũ. Lệnh này giữ nguyên dữ liệu đã lưu.

Chạy `node scripts/record-student-history.mjs` với biến kết nối của môi trường đích để bật ghi lịch sử. Nhật ký bắt đầu từ lúc cài đặt.

## Nạp ngân hàng ban đầu

Chạy lệnh sau từ thư mục dự án trước lần triển khai đầu tiên sử dụng Neon cho ngân hàng bài học. Chọn tệp môi trường ứng với cơ sở dữ liệu đích.

```powershell
node --env-file=.env.development.local scripts/seed-lessons.mjs
```

Lệnh này tạo bảng `quiz_lessons` và nạp 60 bài gốc trong một giao dịch. Nội dung đã có được giữ nguyên khi chạy lại. Mã bài, thứ tự câu và đáp án gốc được giữ để các liên kết và thống kê cũ tiếp tục hoạt động.

## Biến môi trường (Vercel Production)

- `DATABASE_URL`: Chuỗi kết nối Neon Postgres (tự động cấu hình qua Vercel Storage).
- `TEACHER_PASSWORD`: Mật khẩu giáo viên hiện tại, được dùng cho tài khoản `admin`.
- `ADMIN_PASSWORD`: Mật khẩu ưu tiên của tài khoản `admin` khi cần đổi mật khẩu.
- `SESSION_SECRET`: Chuỗi khóa bảo mật tối thiểu 32 ký tự để ký phiên đăng nhập HMAC SHA-256.
