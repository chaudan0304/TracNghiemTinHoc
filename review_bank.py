"""Build semester practice quizzes from the textbook lesson bank.

The lesson ranges follow the grade 3–5 teaching plan in D:/DU_AN/KHBD.
Each review has 15 selected questions plus 5 new application questions.
"""

import json
from pathlib import Path


def question(prompt, correct, wrong1, wrong2, wrong3, explanation):
    return (prompt, correct, wrong1, wrong2, wrong3, explanation)


REVIEWS = [
    {
        "grade": 3, "term": 1, "title": "Ôn tập học kì I (Bài 1–7)",
        "picks": [
            ("lop-3-thong-tin-va-quyet-dinh", [1, 17]),
            ("lop-3-bai-2", [0, 19]), ("lop-3-bai-3", [2, 8]),
            ("lop-3-bai-4", [0, 6]), ("lop-3-bai-5", [0, 8, 16]),
            ("lop-3-bai-6", [2, 11]), ("lop-3-bai-7", [0, 19]),
        ],
        "new": [
            question("Trước giờ ra chơi, cô báo trời có thể mưa. Em cần mang sách ra sân. Quyết định nào hợp lí nhất?", "Để sách trong cặp kín và quan sát thời tiết trước khi ra sân", "Để sách ngoài sân rồi đi chơi", "Bỏ qua thông tin cô vừa báo", "Mang sách ra sân và đặt xuống đất", "Thông tin về khả năng mưa giúp em quyết định cách giữ sách khô và an toàn."),
            question("Minh gõ một từ vào máy rồi nhìn thấy từ đó trên màn hình. Trình tự xử lí thông tin nào đúng?", "Bàn phím đưa chữ vào, máy xử lí, màn hình hiển thị", "Màn hình đưa chữ vào, bàn phím hiển thị", "Loa đưa chữ vào, chuột in giấy", "Máy in đưa chữ vào, màn hình phát âm thanh", "Bàn phím là thiết bị nhập; màn hình là thiết bị hiển thị kết quả."),
            question("Khi dùng máy tính ở lớp, em thấy dây nguồn bị hở. Em nên làm gì trước tiên?", "Tránh chạm vào và báo giáo viên", "Tự nối dây bằng tay", "Tiếp tục dùng vì màn hình vẫn sáng", "Rủ bạn cùng kiểm tra bằng cách chạm vào dây", "Dây điện hở có thể nguy hiểm; giáo viên hoặc người lớn cần xử lí."),
            question("Em cần tìm lại ảnh ngày hội trên máy tính. Cách lưu nào giúp em tìm nhanh về sau?", "Đặt ảnh vào thư mục 'Ngày hội' với tên dễ nhận biết", "Đặt tất cả ảnh tên 'Mới'", "Để ảnh trong nhiều thư mục ngẫu nhiên", "Chỉ nhớ màu biểu tượng ảnh", "Phân nhóm và đặt tên rõ nghĩa giúp thu hẹp nơi tìm và phân biệt tệp."),
            question("Một trang web lạ báo em trúng thưởng và yêu cầu nhập mật khẩu. Cách xử lí nào phù hợp?", "Không nhập mật khẩu và hỏi người lớn đáng tin cậy", "Nhập ngay để nhận quà", "Gửi mật khẩu của bạn bè", "Chia sẻ trang đó cho cả lớp", "Yêu cầu mật khẩu từ trang lạ là dấu hiệu rủi ro; cần giữ kín thông tin tài khoản."),
        ],
    },
    {
        "grade": 3, "term": 2, "title": "Ôn tập học kì II (Bài 8–16)",
        "picks": [
            ("lop-3-bai-8", [1, 19]), ("lop-3-bai-9", [0, 12]),
            ("lop-3-bai-10", [2, 19]), ("lop-3-bai-11", [0, 12]),
            ("lop-3-bai-12", [0, 19]), ("lop-3-bai-13", [1]),
            ("lop-3-bai-14", [0]), ("lop-3-bai-15", [0, 19]),
            ("lop-3-bai-16", [19]),
        ],
        "new": [
            question("Thư mục Học tập chứa thư mục Toán, bên trong có tệp Bài tập 1. Em muốn mở tệp từ Học tập. Bước đầu là gì?", "Mở thư mục Toán", "Xóa thư mục Toán", "Mở tệp bất kì ở ngoài Học tập", "Đổi tên Học tập", "Tệp nằm trong nhánh Toán, nên cần mở thư mục này trước."),
            question("Em sắp chỉnh sửa bài trình chiếu nhóm. Làm gì để vẫn có bản cũ nếu sửa nhầm?", "Tạo một bản sao trước khi sửa", "Xóa bản cũ", "Chỉ đổi màu tên tệp", "Đóng bài mà không lưu", "Bản sao giúp khôi phục nội dung khi việc chỉnh sửa không như ý."),
            question("Phần mềm mô phỏng vẽ Mặt Trời và các hành tinh lớn hơn thực tế để dễ quan sát. Em nên hiểu hình thế nào?", "Dùng để học vị trí và chuyển động, không coi kích thước vẽ là kích thước thật", "Kích thước vẽ luôn đúng tỉ lệ thật", "Phần mềm tạo ra các hành tinh thật", "Không thể học gì từ hình mô phỏng", "Mô phỏng là cách thể hiện để học; kích thước hình có thể thay đổi cho dễ quan sát."),
            question("Cô dặn: 'Nếu trời mưa thì chuyển hoạt động vào lớp'. Trời bắt đầu mưa. Em làm gì?", "Chuyển hoạt động vào lớp", "Tiếp tục ở sân vì đã có kế hoạch", "Chỉ đổi tên hoạt động", "Chờ đến khi mưa tạnh mới đọc chỉ dẫn", "Điều kiện trời mưa đã xảy ra nên thực hiện hành động gắn với điều kiện."),
            question("Nhóm đã tạo đủ trang chiếu nhưng trang kết luận nằm trước phần giới thiệu. Cách sửa phù hợp là gì?", "Sắp lại thứ tự rồi trình chiếu thử", "Chỉ tăng cỡ chữ kết luận", "Xóa toàn bộ bài", "Giữ nguyên vì thứ tự không ảnh hưởng", "Thứ tự trang cần theo mạch trình bày; trình chiếu thử giúp phát hiện lỗi."),
        ],
    },
    {
        "grade": 4, "term": 1, "title": "Ôn tập học kì I (Bài 1–9)",
        "picks": [
            ("lop-4-bai-1", [0, 12]), ("lop-4-bai-2", [0, 14]),
            ("lop-4-bai-3", [0, 12]), ("lop-4-bai-4", [0, 19]),
            ("lop-4-bai-5", [0, 19]), ("lop-4-bai-6", [0, 19]),
            ("lop-4-bai-7", [0]), ("lop-4-bai-8", [0]),
            ("lop-4-bai-9", [0]),
        ],
        "new": [
            question("Máy có bàn phím và màn hình nhưng chưa có phần mềm soạn thảo. Muốn viết thư, em cần thêm gì?", "Phần mềm soạn thảo văn bản phù hợp", "Một bàn phím thứ hai", "Một dây mạng dài hơn", "Chỉ tăng độ sáng màn hình", "Phần cứng cần phần mềm phù hợp để thực hiện công việc soạn thảo."),
            question("Em cần giờ mở cửa mới nhất của bảo tàng. Kết quả đầu là bài cũ, kết quả sau là trang chính thức vừa cập nhật. Nên chọn gì?", "Kiểm tra trang chính thức mới cập nhật", "Tin bài cũ vì đứng đầu", "Chọn ngẫu nhiên", "Chỉ xem ảnh bìa", "Giờ mở cửa có thể thay đổi; nguồn chính thức và thời gian cập nhật là căn cứ quan trọng."),
            question("Em muốn gửi bản sao bài vẽ cho bạn nhưng vẫn giữ bản trên máy. Thao tác phù hợp là gì?", "Sao chép tệp rồi dán vào nơi gửi", "Cắt tệp rồi dán", "Xóa tệp gốc trước", "Đổi tên thư mục mà không chép tệp", "Sao chép tạo thêm bản và giữ nguyên tệp gốc."),
            question("Một phần mềm được cho dùng miễn phí ở nhà nhưng không cho cài ở trường. Em muốn dùng trong phòng Tin học thì làm gì?", "Hỏi giáo viên và tuân thủ điều kiện sử dụng", "Tự cài vì miễn phí", "Chép sang mọi máy", "Xóa tên tác giả rồi cài", "Miễn phí không đồng nghĩa được sử dụng ở mọi nơi; phải tuân thủ giấy phép và quy định phòng máy."),
            question("Trang chiếu có chữ vàng nhạt trên nền trắng và nhiều hiệu ứng liên tục. Cách sửa nào giúp người xem tập trung?", "Chọn màu chữ tương phản rõ và dùng hiệu ứng vừa phải", "Thu nhỏ chữ hơn", "Thêm nhiều màu nhấp nháy", "Bỏ hết nội dung chính", "Chữ rõ và hiệu ứng tiết chế giúp người xem đọc và theo dõi ý chính."),
        ],
    },
    {
        "grade": 4, "term": 2, "title": "Ôn tập học kì II (Bài 9–16, nhánh 12B)",
        "picks": [
            ("lop-4-bai-9", [1]), ("lop-4-bai-10", [0, 14]),
            ("lop-4-bai-11", [0, 19]), ("lop-4-bai-12b", [0, 10]),
            ("lop-4-bai-13", [0, 19]), ("lop-4-bai-14", [0, 11]),
            ("lop-4-bai-15", [0, 19]), ("lop-4-bai-16", [0, 19]),
        ],
        "new": [
            question("Một đoạn văn đang ở cuối bài, em cần chuyển lên đầu mà không tạo bản trùng. Thao tác nào đúng?", "Chọn đoạn, cắt rồi dán ở đầu", "Sao chép rồi dán ở đầu", "Chỉ đổi màu đoạn", "Xóa đoạn mà không dán", "Cắt rồi dán di chuyển đoạn; sao chép sẽ tạo thêm bản."),
            question("Phần mềm luyện gõ báo tốc độ cao nhưng nhiều lỗi. Em nên ưu tiên điều gì tiếp theo?", "Gõ chậm hơn để đúng vị trí ngón và tăng độ chính xác", "Gõ nhanh hơn nữa", "Bỏ qua mọi lỗi", "Chỉ đổi màu bàn phím", "Độ chính xác là mục tiêu quan trọng; tốc độ nên tăng sau khi gõ đúng."),
            question("Rô-bốt cần đi thẳng, quay phải rồi đi tiếp. Nếu đặt lệnh quay lên đầu, điều gì có thể thay đổi?", "Hướng đi của đoạn đường đầu tiên", "Rô-bốt tự sửa thứ tự", "Mọi hành động vẫn giống hệt", "Chương trình tự xóa", "Thay thứ tự lệnh làm rô-bốt quay trước khi thực hiện bước đi đầu."),
            question("Kịch bản yêu cầu mèo nói ở sân trường rồi chuyển sang lớp học. Trình tự lệnh nào phù hợp?", "Đặt nền sân trường, cho mèo nói, rồi đổi nền lớp học", "Đổi nền lớp học trước khi mèo nói ở sân trường", "Chỉ thêm hai nền mà không có lệnh", "Chỉ đổi tên nhân vật", "Các lệnh cần theo đúng trình tự của kịch bản."),
            question("Chương trình Scratch chạy nhưng nhân vật không làm đúng ý. Em nên kiểm tra gì trước khi chia sẻ?", "Các khối lệnh, giá trị và thứ tự rồi chạy thử lại", "Chỉ đổi tên dự án", "Chỉ tăng âm lượng", "Chia sẻ ngay vì chương trình đã chạy", "Chạy được chưa đủ; cần đối chiếu kết quả với ý tưởng và sửa lệnh liên quan."),
        ],
    },
    {
        "grade": 5, "term": 1, "title": "Ôn tập học kì I (Bài 1–8A)",
        "picks": [
            ("lop-5-bai-1", [0, 10]), ("lop-5-bai-2", [0, 12]),
            ("lop-5-bai-3", [0, 19]), ("lop-5-bai-4", [0, 19]),
            ("lop-5-bai-5", [0, 19]), ("lop-5-bai-6", [0, 10]),
            ("lop-5-bai-7", [0, 19]), ("lop-5-bai-8a", [0]),
        ],
        "new": [
            question("Hai trang hướng dẫn chăm cây khác nhau. Một trang không ghi nguồn, trang còn lại do đơn vị chuyên môn đăng và hợp điều kiện nhà em. Em nên làm gì?", "Kiểm tra và ưu tiên hướng dẫn từ nguồn chuyên môn phù hợp", "Tin trang không ghi nguồn vì ngắn hơn", "Chép cả hai như đều đúng", "Bỏ qua điều kiện thực tế", "Giải pháp cần dựa trên nguồn đáng tin và phù hợp hoàn cảnh áp dụng."),
            question("Có hai tệp cùng tên 'Bài 1' ở thư mục Toán và Tiếng Việt. Em muốn mở bài Toán. Cách nào chắc chắn nhất?", "Kiểm tra đường dẫn và chọn tệp trong thư mục Toán", "Chọn tệp hiện đầu tiên", "Đổi tên cả hai thành giống nhau", "Xóa thư mục Tiếng Việt", "Đường dẫn phân biệt các tệp cùng tên ở những thư mục khác nhau."),
            question("Tác giả cho phép dùng ảnh nếu ghi tên. Em đưa ảnh vào bài viết của mình thì phải làm gì?", "Ghi tên tác giả theo điều kiện sử dụng", "Xóa tên tác giả", "Nhận mình đã chụp ảnh", "Không cần xem điều kiện vì ảnh miễn phí", "Được dùng ảnh theo điều kiện không có nghĩa được bỏ yêu cầu ghi công tác giả."),
            question("Em muốn chuyển đoạn mở đầu xuống cuối văn bản, không giữ bản cũ. Thao tác nào phù hợp?", "Cắt đoạn rồi dán ở cuối", "Sao chép đoạn rồi dán ở cuối", "Chỉ đổi phông chữ", "Xóa đoạn mà không dán", "Cắt rồi dán di chuyển nội dung; sao chép sẽ để lại bản gốc."),
            question("Tấm thiệp số có chữ cùng màu với nền và ảnh che mất lời chúc. Em nên sửa gì?", "Đổi màu chữ cho rõ và bố trí lại ảnh", "Thu nhỏ chữ hơn", "Thêm ảnh đè lên", "Giữ nguyên vì đã có đủ chữ", "Chữ cần dễ đọc và ảnh phải hỗ trợ, không che nội dung chính."),
        ],
    },
    {
        "grade": 5, "term": 2, "title": "Ôn tập học kì II (Bài 9A–16)",
        "picks": [
            ("lop-5-bai-9a", [0]), ("lop-5-bai-10", [0, 19]),
            ("lop-5-bai-11", [0, 19]), ("lop-5-bai-12", [0, 19]),
            ("lop-5-bai-13", [0, 19]), ("lop-5-bai-14", [0, 19]),
            ("lop-5-bai-15", [0, 19]), ("lop-5-bai-16", [0, 19]),
        ],
        "new": [
            question("Biến điểm bắt đầu bằng 1. Lệnh tăng điểm thêm 2 nằm trong khối lặp 4 lần. Giá trị cuối là bao nhiêu?", "9", "8", "3", "5", "Bốn lần tăng thêm 2 tạo thêm 8 điểm; cộng với 1 ban đầu được 9."),
            question("Chương trình đặt điểm về 0 rồi cộng 1. Nếu đảo thứ tự hai lệnh và điểm ban đầu là 5, điểm cuối là gì?", "0", "1", "5", "6", "Sau khi cộng 1, lệnh đặt điểm về 0 chạy cuối và ghi đè giá trị trước đó."),
            question("Nếu điểm hiện là 9, lệnh 'nếu điểm ≥ 10 thì nói Thắng, nếu không thì nói Thử lại' cho kết quả nào?", "Thử lại", "Thắng", "Cả hai câu", "Không câu nào", "Vì 9 nhỏ hơn 10 nên chương trình thực hiện nhánh 'nếu không'."),
            question("Biến Cạnh bằng 6. Biểu thức nào tính đúng chu vi hình vuông và cho kết quả bao nhiêu?", "4 × Cạnh = 24", "Cạnh × Cạnh = 36", "Cạnh + 4 = 10", "Cạnh / 4 = 1,5", "Chu vi hình vuông bằng bốn lần độ dài cạnh: 4 × 6 = 24."),
            question("Kịch bản yêu cầu mèo hỏi tên bạn, chào đúng tên rồi lặp lời chào hai lần. Chương trình cần gì?", "Lệnh hỏi, biến trả lời và khối lặp 2 lần", "Chỉ một câu chào cố định", "Chỉ đổi phông nền", "Chỉ đặt điểm về 0", "Tên nhập được lưu trong biến trả lời; kết hợp giá trị này với lời chào và lặp theo kịch bản."),
        ],
    },
]


def build_review(root: Path, spec: dict) -> str:
    grade, term = spec["grade"], spec["term"]
    lesson_id = f"lop-{grade}-on-tap-hoc-ki-{term}"
    selected = []
    for source_id, indices in spec["picks"]:
        source = json.loads((root / f"{source_id}.json").read_text(encoding="utf-8"))
        for index in indices:
            selected.append(source["questions"][index].copy())
    assert len(selected) == 15, (lesson_id, len(selected))
    assert len(spec["new"]) == 5
    questions = []
    for position in range(20):
        if position % 4 == 3:
            prompt, correct, *remainder = spec["new"][position // 4]
            wrong, explanation = remainder[:3], remainder[3]
            choices = [correct, *wrong]
            shift = position % 3 + 1
            choices = choices[shift:] + choices[:shift]
            questions.append({"question": prompt, "options": choices,
                              "correctIndex": choices.index(correct), "explanation": explanation})
        else:
            questions.append(selected.pop(0))
    assert len(questions) == 20 and len({q["question"] for q in questions}) == 20, lesson_id
    payload = {"id": lesson_id, "subjectBadge": f"TIN HỌC LỚP {grade}",
               "lessonTitle": spec["title"], "gameTitle": f"ÔN TẬP TIN HỌC LỚP {grade}",
               "pointsPerQuestion": 0.5, "timeLimitSeconds": 900, "questions": questions}
    (root / f"{lesson_id}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return lesson_id


def write_reviews(root: Path) -> dict:
    result = {3: [], 4: [], 5: []}
    for spec in REVIEWS:
        result[spec["grade"]].append(build_review(root, spec))
    return result
