"""Original practice questions aligned to the SGK Tin học 3, 4, 5 lesson list.

Run `python lesson-bank.py` after editing the compact question bank below.
Each row: title, question rows (prompt, correct choice, three distractors).
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent / "lessons"


def q(prompt, correct, a, b, c):
    return (prompt, correct, a, b, c)


GRADE3 = [
    ("2", "Xử lí thông tin", [
        q("Bộ phận nào giúp con người suy nghĩ để xử lí thông tin?", "Bộ não", "Bàn tay", "Bàn chân", "Mái tóc"),
        q("Nghe tiếng trống vào lớp rồi đi vào lớp là ví dụ về điều gì?", "Tiếp nhận thông tin, xử lí rồi thực hiện quyết định", "Chỉ lưu trữ thông tin", "Chỉ tạo ra âm thanh", "Không cần xử lí thông tin"),
        q("Máy tính có thể xử lí thông tin dưới dạng nào?", "Chữ, hình ảnh và âm thanh", "Chỉ mùi hương", "Chỉ vị thức ăn", "Chỉ đồ vật bằng gỗ"),
        q("Khi thấy phép tính 5 + 3 và trả lời 8, em đã làm gì?", "Xử lí thông tin để tìm kết quả", "Xóa thông tin", "Tắt máy tính", "Sắp xếp bàn phím"),
    ]),
    ("3", "Máy tính và em", [
        q("Bộ phận nào hiển thị hình ảnh và chữ từ máy tính?", "Màn hình", "Chuột", "Bàn phím", "Thân máy"),
        q("Em dùng thiết bị nào để gõ chữ vào máy tính?", "Bàn phím", "Màn hình", "Loa", "Máy in"),
        q("Thiết bị nào giúp em điều khiển con trỏ trên màn hình?", "Chuột", "Loa", "Máy in", "Màn hình"),
        q("Bộ phận nào chứa các thành phần xử lí chính của máy tính để bàn?", "Thân máy", "Tấm lót chuột", "Loa", "Máy in"),
    ]),
    ("4", "Làm việc với máy tính", [
        q("Khi ngồi làm việc với máy tính, lưng em nên như thế nào?", "Ngồi thẳng, tư thế thoải mái", "Cúi sát màn hình", "Nằm trên bàn", "Vẹo sang một bên"),
        q("Khoảng cách từ mắt đến màn hình nên như thế nào?", "Giữ khoảng cách phù hợp, không nhìn quá gần", "Áp mắt vào màn hình", "Càng gần càng tốt", "Không cần nhìn màn hình"),
        q("Để kết thúc phiên làm việc, em nên làm gì?", "Thực hiện lệnh tắt máy đúng cách", "Rút dây điện ngay", "Đập nút nguồn liên tục", "Đóng màn hình bằng tay"),
        q("Sau khi dùng máy tính một lúc, em nên làm gì để bảo vệ mắt?", "Cho mắt nghỉ và nhìn ra xa", "Nhìn sát màn hình hơn", "Tăng độ sáng tối đa", "Tiếp tục nhìn liên tục"),
    ]),
    ("5", "Sử dụng bàn phím", [
        q("Hai phím nào có gờ để đặt ngón trỏ ở hàng phím cơ sở?", "F và J", "A và L", "Q và P", "Z và M"),
        q("Khi bắt đầu gõ đúng cách, các ngón tay đặt trên hàng phím nào?", "Hàng phím cơ sở", "Hàng phím số", "Hàng phím trên cùng", "Hàng phím dưới cùng"),
        q("Phím cách dùng để làm gì?", "Tạo khoảng trắng giữa các từ", "Xóa toàn bộ văn bản", "Tắt máy", "Viết hoa tất cả chữ"),
        q("Muốn xuống dòng khi gõ văn bản, em nhấn phím nào?", "Enter", "Space", "Caps Lock", "Shift"),
    ]),
    ("6", "Khám phá thông tin trên Internet", [
        q("Internet giúp em thực hiện việc nào?", "Tìm thông tin và học tập trực tuyến", "Tự sửa mọi hỏng hóc máy tính", "Tạo điện mà không cần nguồn", "Bảo đảm mọi thông tin đều đúng"),
        q("Khi muốn xem trang web, em sử dụng phần mềm nào?", "Trình duyệt web", "Máy tính bỏ túi", "Trình phát nhạc ngoại tuyến", "Phần mềm vẽ"),
        q("Thông tin trên Internet có thể ở dạng nào?", "Văn bản, hình ảnh, âm thanh và video", "Chỉ chữ viết", "Chỉ âm thanh", "Chỉ bản in giấy"),
        q("Nếu gặp nội dung trên Internet khiến em lo lắng, em nên làm gì?", "Báo cho người lớn đáng tin cậy", "Giữ bí mật và tiếp tục xem", "Gửi ngay cho mọi bạn", "Nhập thông tin cá nhân theo yêu cầu"),
    ]),
    ("7", "Sắp xếp để dễ tìm", [
        q("Vì sao nên sắp xếp đồ vật và tệp hợp lí?", "Để tìm nhanh khi cần", "Để chúng tự biến mất", "Để máy tính chạy không cần điện", "Để không phải nhớ tên"),
        q("Cách nào giúp tìm sách Toán nhanh hơn?", "Xếp sách theo môn học và gắn nhãn", "Để lẫn tất cả sách", "Giấu sách ở nhiều nơi", "Xếp sách tùy ý mỗi ngày"),
        q("Khi đặt tên thư mục ảnh lớp, tên nào dễ nhận biết nhất?", "Ảnh lớp 3A", "Mới mới mới", "123", "Không tên"),
        q("Nếu có nhiều tệp của các môn học, em nên làm gì?", "Chia vào các thư mục theo môn", "Đổi mọi tệp thành cùng một tên", "Xóa hết tệp", "Để tất cả rải rác trên màn hình"),
    ]),
    ("8", "Sơ đồ hình cây. Tổ chức thông tin trong máy tính", [
        q("Trong sơ đồ hình cây, một nhánh có thể chia thành gì?", "Các nhánh con", "Chỉ một dấu chấm", "Một màn hình", "Một con chuột"),
        q("Thư mục trong máy tính dùng để làm gì?", "Chứa và tổ chức tệp, thư mục con", "Chỉ phát âm thanh", "Chỉ nhập chữ", "Chỉ hiển thị ảnh nền"),
        q("Thư mục nằm bên trong một thư mục khác gọi là gì?", "Thư mục con", "Màn hình con", "Máy tính con", "Phím con"),
        q("Sơ đồ hình cây giúp em thấy rõ điều gì?", "Quan hệ phân cấp giữa các nhóm thông tin", "Độ sáng màn hình", "Tốc độ mạng", "Âm lượng loa"),
    ]),
    ("9", "Thực hành với tệp và thư mục trong máy tính", [
        q("Để lưu các bài tập cùng một môn, em nên tạo gì?", "Một thư mục có tên phù hợp", "Một phím mới", "Một con trỏ mới", "Một màn hình mới"),
        q("Khi đổi tên tệp, điều nào nên được giữ để tệp mở đúng bằng ứng dụng phù hợp?", "Phần mở rộng của tệp", "Màu nền máy tính", "Vị trí con chuột", "Âm lượng loa"),
        q("Muốn xem tệp bên trong thư mục, trước tiên em cần làm gì?", "Mở thư mục đó", "Tắt màn hình", "Rút bàn phím", "Xóa thư mục"),
        q("Trước khi xóa một tệp, em nên làm gì?", "Kiểm tra đúng tệp và hỏi người lớn khi chưa chắc", "Xóa ngay mọi tệp", "Đổi tên mọi thư mục", "Ngắt nguồn máy tính"),
    ]),
    ("10", "Bảo vệ thông tin khi dùng máy tính", [
        q("Vì sao cần lưu lại tệp sau khi chỉnh sửa?", "Để giữ nội dung vừa làm", "Để xóa nội dung", "Để tắt Internet", "Để đổi màn hình"),
        q("Khi không muốn người khác xem thông tin riêng tư, em nên làm gì?", "Giữ kín mật khẩu và nhờ người lớn hỗ trợ", "Đăng mật khẩu công khai", "Cho mọi bạn dùng tài khoản", "Ghi mật khẩu lên màn hình"),
        q("Tệp quan trọng có thể được bảo vệ thêm bằng cách nào?", "Tạo bản sao lưu", "Chỉ để một bản duy nhất", "Đổi tên thành một chữ bất kì", "Xóa bản gốc"),
        q("Nếu nhận tệp lạ từ người không quen, em nên làm gì?", "Không mở vội và hỏi người lớn", "Mở ngay để thử", "Chuyển tiếp cho cả lớp", "Tắt phần mềm bảo vệ"),
    ]),
    ("11", "Bài trình chiếu của em", [
        q("Một bài trình chiếu thường gồm những gì?", "Các trang chiếu", "Các thư mục hệ thống", "Các dây cáp", "Các phím chức năng"),
        q("Em có thể đặt gì lên trang chiếu để trình bày ý tưởng?", "Chữ và hình ảnh", "Chỉ ổ cắm điện", "Chỉ dây mạng", "Chỉ con trỏ chuột"),
        q("Để người xem dễ đọc, chữ trên trang chiếu nên như thế nào?", "Rõ ràng, đủ lớn", "Thật nhỏ", "Trùng màu với nền", "Nhồi kín cả trang"),
        q("Sau khi tạo bài trình chiếu, em nên làm gì để giữ lại?", "Lưu tệp với tên dễ nhận biết", "Rút dây nguồn", "Xóa mọi trang chiếu", "Đóng máy không lưu"),
    ]),
    ("12", "Tìm hiểu về thế giới tự nhiên", [
        q("Máy tính có thể giúp em tìm hiểu thiên nhiên bằng cách nào?", "Xem hình ảnh, video và thông tin phù hợp", "Tự thay thế hoàn toàn hoạt động quan sát", "Tạo ra mọi loài cây thật", "Làm cho mọi thông tin trên mạng đúng"),
        q("Khi tìm hiểu một loài động vật, thông tin nào hữu ích?", "Nơi sống và đặc điểm của nó", "Mật khẩu của bạn", "Số seri bàn phím", "Màu dây điện"),
        q("Nếu hai trang web nói khác nhau về một hiện tượng, em nên làm gì?", "Kiểm tra thêm nguồn tin đáng tin cậy và hỏi thầy cô", "Tin trang đầu tiên ngay", "Sao chép cả hai như sự thật", "Bỏ qua mọi thông tin"),
        q("Khi sử dụng hình ảnh trên mạng cho bài học, em nên làm gì?", "Chọn hình phù hợp và ghi nguồn khi cần", "Nhận là ảnh do mình chụp", "Tải mọi ảnh không xem", "Đổi màu ảnh để che nguồn"),
    ]),
    ("13", "Luyện tập sử dụng chuột", [
        q("Thao tác nháy chuột là gì?", "Nhấn rồi thả nhanh một nút chuột", "Giữ nút chuột mãi", "Rút chuột ra", "Gõ bàn phím"),
        q("Muốn mở biểu tượng trên màn hình theo cách thông thường, em dùng thao tác nào?", "Nháy đúp chuột trái", "Lăn chuột một lần", "Chỉ di chuyển con trỏ", "Nhấn phím cách"),
        q("Kéo thả chuột gồm thao tác nào?", "Giữ nút chuột, di chuyển rồi thả", "Chỉ lăn bánh xe", "Chỉ nháy một lần", "Tắt rồi bật chuột"),
        q("Bánh xe chuột thường giúp em làm gì?", "Cuộn nội dung lên hoặc xuống", "Gõ chữ cái", "In tài liệu", "Bật máy tính"),
    ]),
    ("14", "Em thực hiện công việc như thế nào?", [
        q("Để hoàn thành việc đánh răng, em cần làm gì?", "Thực hiện các bước theo thứ tự hợp lí", "Làm ngẫu nhiên một bước", "Chỉ nêu tên công việc", "Bỏ qua mọi bước"),
        q("Trong mô tả công việc, mỗi bước cần như thế nào?", "Rõ ràng để người thực hiện hiểu", "Càng mơ hồ càng tốt", "Không liên quan đến mục tiêu", "Luôn là một câu hỏi"),
        q("Nếu đổi sai thứ tự các bước của một công việc, điều gì có thể xảy ra?", "Kết quả có thể không như mong muốn", "Kết quả luôn giống nhau", "Máy tính tự sửa mọi lỗi", "Không có tác động nào"),
        q("Khi hướng dẫn bạn làm một việc, cách nào dễ làm theo?", "Liệt kê từng bước theo đúng trình tự", "Nói các bước lộn xộn", "Chỉ nói kết quả cuối", "Bỏ qua bước quan trọng"),
    ]),
    ("15", "Công việc được thực hiện theo điều kiện", [
        q("Câu nào mô tả công việc phụ thuộc điều kiện?", "Nếu trời mưa thì mang áo mưa", "Em đặt sách lên bàn", "Em mở vở rồi viết bài", "Em đếm từ một đến mười"),
        q("Trong câu 'Nếu đèn đỏ thì dừng lại', điều kiện là gì?", "Đèn đỏ", "Dừng lại", "Đi nhanh", "Con đường"),
        q("Nếu điều kiện 'trời mưa' không xảy ra, hành động 'mang áo mưa' trong chỉ dẫn có bắt buộc thực hiện không?", "Không, vì điều kiện không đúng", "Có, trong mọi trường hợp", "Phải tắt máy tính", "Phải đổi điều kiện"),
        q("Để quyết định có tưới cây hay không theo chỉ dẫn 'Nếu đất khô thì tưới cây', em cần kiểm tra gì?", "Đất có khô không", "Màu áo của em", "Số phím trên bàn phím", "Tên thư mục"),
    ]),
    ("16", "Công việc của em và sự trợ giúp của máy tính", [
        q("Máy tính giúp em thực hiện công việc nào?", "Soạn thảo và lưu bài viết", "Tự ăn cơm thay em", "Tự chăm sóc mọi cây thật", "Tự quyết định mọi việc thay con người"),
        q("Khi nhờ máy tính hỗ trợ học tập, em vẫn cần làm gì?", "Tự suy nghĩ và kiểm tra kết quả", "Tin mọi kết quả không kiểm tra", "Bỏ qua hướng dẫn của thầy cô", "Không cần hiểu bài"),
        q("Để máy tính làm đúng việc em muốn, em cần gì?", "Chỉ dẫn rõ ràng, đúng thứ tự", "Chỉ nói tên máy tính", "Chỉ bật loa", "Không đưa yêu cầu nào"),
        q("Nếu kết quả máy tính tạo ra không đúng yêu cầu, em nên làm gì?", "Kiểm tra lại các bước và sửa chỉ dẫn", "Giữ nguyên vì máy luôn đúng", "Xóa mọi tệp", "Tắt màn hình ngay"),
    ]),
]

GRADE4 = [
    ("1", "Phần cứng và phần mềm máy tính", [
        q("Bộ phận nào là phần cứng máy tính?", "Bàn phím", "Trình duyệt web", "Trò chơi trên máy", "Phần mềm vẽ"),
        q("Thành phần nào là phần mềm?", "Chương trình soạn thảo văn bản", "Màn hình", "Chuột", "Loa"),
        q("Phần mềm giúp máy tính làm gì?", "Thực hiện các công việc theo chương trình", "Tạo điện cho ổ cắm", "Thay thế mọi thiết bị phần cứng", "Tự sửa bàn phím hỏng"),
        q("Muốn dùng máy tính để vẽ, em cần gì?", "Thiết bị phù hợp và phần mềm vẽ", "Chỉ cần dây nguồn", "Chỉ cần loa", "Chỉ cần máy in"),
    ]),
    ("2", "Gõ bàn phím đúng cách", [
        q("Khi gõ bàn phím đúng cách, em nên dùng bao nhiêu bàn tay?", "Hai bàn tay", "Chỉ tay trái", "Chỉ một ngón bất kì", "Không cần tay"),
        q("Hai ngón trỏ thường đặt ở phím nào trên hàng cơ sở?", "F và J", "Q và P", "Z và M", "1 và 0"),
        q("Sau khi gõ một phím ở hàng trên hoặc dưới, ngón tay nên trở về đâu?", "Vị trí ban đầu trên hàng phím cơ sở", "Bánh xe chuột", "Màn hình", "Phím nguồn"),
        q("Tư thế gõ bàn phím nào phù hợp?", "Ngồi thẳng, hai tay đặt thoải mái", "Cúi sát bàn phím", "Nằm gõ", "Dùng lực đập mạnh các phím"),
    ]),
    ("3", "Thông tin trên trang web", [
        q("Trang web có thể chứa dạng thông tin nào?", "Văn bản, hình ảnh, âm thanh và video", "Chỉ chữ in giấy", "Chỉ số điện thoại", "Chỉ tệp trong USB"),
        q("Liên kết trên trang web có tác dụng gì?", "Dẫn tới trang hoặc nội dung khác", "Tự kiểm chứng mọi thông tin", "Tắt trình duyệt", "Xóa lịch sử máy tính"),
        q("Muốn xem thêm nội dung phía dưới trang web, em làm gì?", "Cuộn trang xuống", "Rút dây mạng", "Đổi tên trang web", "Xóa trình duyệt"),
        q("Khi đọc thông tin trên trang web, em cần lưu ý gì?", "Xem nguồn và kiểm tra độ tin cậy", "Tin mọi dòng chữ", "Nhập mật khẩu vào mọi ô", "Chia sẻ ngay thông tin chưa kiểm chứng"),
    ]),
    ("4", "Tìm kiếm thông tin trên Internet", [
        q("Muốn tìm thông tin về vòng đời của bướm, từ khóa nào phù hợp nhất?", "vòng đời của bướm", "động vật", "máy tính", "bài hát"),
        q("Công cụ tìm kiếm giúp em làm gì?", "Tìm các trang có thông tin liên quan đến từ khóa", "Đảm bảo mọi kết quả đúng", "Tự viết bài thay em", "Sửa mọi lỗi máy tính"),
        q("Nếu kết quả tìm kiếm quá rộng, em nên làm gì?", "Dùng từ khóa cụ thể hơn", "Xóa trình duyệt", "Tắt màn hình", "Nhập mật khẩu vào trang lạ"),
        q("Trước khi dùng thông tin tìm được, em nên làm gì?", "Kiểm tra nguồn và nội dung", "Tin kết quả đầu tiên luôn đúng", "Sao chép không đọc", "Chỉ xem tiêu đề"),
    ]),
    ("5", "Thao tác với tệp và thư mục", [
        q("Muốn tổ chức các bài tập theo môn học, em nên làm gì?", "Tạo các thư mục có tên theo môn", "Để mọi tệp cùng một tên", "Xóa tệp cũ bất kì", "Đổi tên ổ đĩa"),
        q("Sao chép một tệp có tác dụng gì?", "Tạo thêm bản sao của tệp", "Xóa bản gốc", "Tắt máy", "Biến tệp thành thư mục"),
        q("Di chuyển tệp sang thư mục khác có nghĩa là gì?", "Chuyển vị trí lưu tệp", "Tạo thêm nhiều bản giống nhau", "Đổi nội dung tệp", "In tệp ra giấy"),
        q("Trước khi xóa thư mục, em cần kiểm tra gì?", "Nội dung bên trong và việc còn cần dùng hay không", "Màu con trỏ", "Âm lượng loa", "Tên bàn phím"),
    ]),
    ("7", "Tạo bài trình chiếu", [
        q("Bài trình chiếu gồm các thành phần nào?", "Các trang chiếu", "Các ổ cắm", "Các phím số", "Các dây mạng"),
        q("Để thêm nội dung mới vào bài trình chiếu, em có thể làm gì?", "Thêm trang chiếu", "Rút dây điện", "Xóa tệp", "Tắt màn hình"),
        q("Tiêu đề trang chiếu giúp người xem điều gì?", "Biết nội dung chính của trang", "Nghe âm thanh lớn hơn", "Tăng tốc Internet", "Mở được bàn phím"),
        q("Sau khi tạo bài trình chiếu, em nên làm gì?", "Lưu tệp với tên phù hợp", "Tắt máy không lưu", "Xóa tất cả trang", "Đổi tên máy in"),
    ]),
    ("8", "Định dạng văn bản trên trang chiếu", [
        q("Định dạng nào giúp nhấn mạnh một từ trên trang chiếu?", "In đậm", "Xóa từ", "Tắt màn hình", "Đóng tệp"),
        q("Vì sao cần chọn cỡ chữ phù hợp trên trang chiếu?", "Để người xem dễ đọc", "Để tệp luôn nhỏ hơn", "Để mạng nhanh hơn", "Để chuột hoạt động"),
        q("Khi chọn màu chữ, em cần chú ý gì?", "Chữ nổi bật và dễ đọc trên nền", "Chữ cùng màu với nền", "Càng nhiều màu càng tốt", "Chỉ dùng màu rất nhạt"),
        q("Muốn thay đổi kiểu chữ của một đoạn, trước tiên em cần làm gì?", "Chọn đoạn văn bản cần định dạng", "Tắt phần mềm", "Xóa mọi trang chiếu", "Đổi tên máy tính"),
    ]),
    ("9", "Hiệu ứng chuyển trang", [
        q("Hiệu ứng chuyển trang xuất hiện khi nào?", "Khi chuyển từ trang chiếu này sang trang khác", "Khi gõ từng chữ", "Khi mở máy tính", "Khi cắm chuột"),
        q("Để xem hiệu ứng chuyển trang có phù hợp không, em nên làm gì?", "Trình chiếu thử", "Xóa bài trình chiếu", "Rút bàn phím", "Đổi tên tệp"),
        q("Khi làm bài trình chiếu học tập, hiệu ứng nên dùng như thế nào?", "Vừa phải, không gây mất tập trung", "Càng nhiều càng tốt", "Mỗi chữ một kiểu thật rối", "Chỉ chọn hiệu ứng dài nhất"),
        q("Hiệu ứng chuyển trang khác với nội dung trang chiếu ở điểm nào?", "Nó điều khiển cách chuyển giữa các trang", "Nó là tiêu đề văn bản", "Nó là thư mục lưu ảnh", "Nó là nút nguồn"),
    ]),
    ("10", "Phần mềm soạn thảo văn bản", [
        q("Phần mềm soạn thảo văn bản dùng để làm gì?", "Tạo và chỉnh sửa văn bản", "Chỉ nghe nhạc", "Chỉ đo nhiệt độ", "Chỉ điều khiển chuột"),
        q("Vị trí chữ mới xuất hiện khi em gõ được chỉ bởi gì?", "Con trỏ soạn thảo", "Bánh xe chuột", "Loa", "Ổ điện"),
        q("Muốn xuống dòng và bắt đầu đoạn mới, em nhấn phím nào?", "Enter", "Shift", "Caps Lock", "Esc"),
        q("Để giữ lại văn bản đã soạn, em cần làm gì?", "Lưu tệp", "Rút dây nguồn", "Đóng mà không lưu", "Xóa nội dung"),
    ]),
    ("11", "Chỉnh sửa văn bản", [
        q("Muốn sửa một từ đã gõ sai, em nên làm gì?", "Đặt con trỏ tại vị trí cần sửa rồi chỉnh", "Xóa cả tài liệu luôn", "Tắt bàn phím", "In tài liệu ngay"),
        q("Phím Backspace thường xóa kí tự ở đâu so với con trỏ?", "Bên trái", "Bên phải", "Ở trang khác", "Trong thư mục khác"),
        q("Phím Delete thường xóa kí tự ở đâu so với con trỏ?", "Bên phải", "Bên trái", "Trong tệp khác", "Trên bàn phím"),
        q("Sau khi chỉnh sửa văn bản, để giữ bản mới em cần gì?", "Lưu lại tệp", "Rút điện", "Đổi tên con chuột", "Xóa thư mục"),
    ]),
    ("12A", "Thực hành sử dụng công cụ đa phương tiện", [
        q("Công cụ đa phương tiện có thể giúp em làm việc với gì?", "Hình ảnh, âm thanh và video", "Chỉ dây điện", "Chỉ tệp văn bản in giấy", "Chỉ bàn phím"),
        q("Khi xem video học tập, thao tác nào giúp xem lại đoạn chưa hiểu?", "Tạm dừng hoặc tua lại", "Xóa video", "Tắt màn hình", "Đổi tên máy tính"),
        q("Muốn nghe rõ âm thanh nhưng không ảnh hưởng người khác, em có thể dùng gì?", "Tai nghe ở mức âm lượng phù hợp", "Loa thật lớn", "Màn hình sáng nhất", "Máy in"),
        q("Sau khi tạo sản phẩm với công cụ đa phương tiện, em nên làm gì?", "Lưu tệp ở nơi dễ tìm", "Đóng ứng dụng không lưu", "Xóa bản vừa tạo", "Rút điện"),
    ]),
    ("12B", "Phần mềm luyện gõ bàn phím", [
        q("Phần mềm luyện gõ bàn phím giúp em làm gì?", "Rèn tốc độ và độ chính xác khi gõ", "Tự viết mọi bài văn", "Thay bàn phím bị hỏng", "Tắt máy tính"),
        q("Khi luyện gõ, điều gì quan trọng bên cạnh tốc độ?", "Gõ đúng phím", "Gõ thật mạnh", "Nhìn sát màn hình", "Chỉ dùng một ngón"),
        q("Hai ngón trỏ bắt đầu ở cặp phím nào?", "F và J", "Q và P", "1 và 0", "Z và M"),
        q("Nếu gõ sai nhiều, em nên làm gì?", "Giảm tốc độ và luyện đúng vị trí ngón tay", "Gõ nhanh hơn nữa", "Đập bàn phím", "Bỏ qua mọi lỗi"),
    ]),
    ("13", "Chơi với máy tính", [
        q("Trò chơi trên máy tính có thể giúp em điều gì khi dùng hợp lí?", "Luyện một số kĩ năng và giải trí", "Bỏ hoàn toàn việc học", "Tự khỏi mọi bệnh", "Không cần nghỉ mắt"),
        q("Khi chơi trò chơi trên máy tính, em cần chú ý gì?", "Thời gian hợp lí và nội dung phù hợp lứa tuổi", "Chơi liên tục nhiều giờ", "Chia sẻ mật khẩu để lấy quà", "Bấm mọi liên kết lạ"),
        q("Nếu trò chơi yêu cầu thông tin cá nhân, em nên làm gì?", "Hỏi người lớn trước khi cung cấp", "Nhập ngay mọi thông tin", "Đưa mật khẩu cho bạn", "Công khai địa chỉ nhà"),
        q("Khi thấy trò chơi làm em mỏi mắt, em nên làm gì?", "Dừng lại và nghỉ ngơi", "Ngồi gần màn hình hơn", "Tăng âm lượng", "Chơi thêm nhiều giờ"),
    ]),
    ("14", "Khám phá môi trường lập trình trực quan", [
        q("Trong lập trình trực quan, em thường tạo chương trình bằng cách nào?", "Ghép các khối lệnh", "Chỉ vẽ trên giấy", "Rút dây mạng", "Đổi màu bàn phím"),
        q("Nhân vật trong môi trường lập trình trực quan thực hiện hành động theo gì?", "Các lệnh được sắp xếp trong chương trình", "Màu vỏ máy", "Âm lượng loa", "Kích thước bàn phím"),
        q("Muốn biết chương trình hoạt động ra sao, em làm gì?", "Chạy thử chương trình", "Xóa mọi khối lệnh", "Tắt màn hình", "Đổi tên máy"),
        q("Nếu nhân vật không làm đúng ý, em nên làm gì?", "Kiểm tra thứ tự và nội dung các khối lệnh", "Tin chương trình luôn đúng", "Rút chuột", "Xóa toàn bộ máy tính"),
    ]),
    ("15", "Tạo chương trình máy tính để diễn tả ý tưởng", [
        q("Trước khi ghép lệnh để thể hiện ý tưởng, em nên làm gì?", "Xác định nhân vật cần thực hiện những bước nào", "Đặt lệnh ngẫu nhiên", "Tắt phần mềm", "Xóa nhân vật"),
        q("Nếu muốn nhân vật nói rồi di chuyển, em nên làm gì?", "Ghép lệnh nói trước lệnh di chuyển", "Chỉ đặt lệnh di chuyển", "Chỉ đổi hình nền", "Rút bàn phím"),
        q("Vì sao cần chạy thử chương trình?", "Để kiểm tra kết quả so với ý tưởng", "Để máy tự viết bài", "Để xóa lỗi phần cứng", "Để tăng tốc Internet"),
        q("Khi chương trình chưa thể hiện đúng ý tưởng, bước tiếp theo là gì?", "Sửa các lệnh rồi chạy thử lại", "Giữ nguyên mọi lệnh", "Xóa tệp khác", "Tắt máy ngay"),
    ]),
    ("16", "Chương trình của em", [
        q("Một chương trình trực quan được tạo từ gì?", "Các khối lệnh ghép theo trình tự", "Chỉ màu sắc màn hình", "Chỉ âm lượng loa", "Chỉ hình nền"),
        q("Khi chương trình có nhiều bước, vì sao thứ tự lệnh quan trọng?", "Vì đổi thứ tự có thể đổi kết quả", "Vì lệnh nào cũng chạy cùng lúc", "Vì máy luôn tự sắp xếp", "Vì thứ tự chỉ để trang trí"),
        q("Muốn lưu chương trình để mở lại, em cần làm gì?", "Lưu dự án với tên dễ nhận biết", "Chỉ đóng cửa sổ", "Xóa tất cả nhân vật", "Rút dây điện"),
        q("Sau khi hoàn thành chương trình, em nên làm gì trước khi chia sẻ?", "Chạy thử và sửa lỗi nếu có", "Chia sẻ ngay không xem", "Xóa các lệnh", "Đổi tên máy tính"),
    ]),
]

GRADE5 = [
    ("1", "Em có thể làm gì với máy tính?", [
        q("Máy tính có thể giúp em làm việc nào?", "Học tập, tạo sản phẩm và trao đổi thông tin", "Tự thay em làm mọi việc", "Tạo thức ăn thật", "Đảm bảo mọi nội dung đều đúng"),
        q("Khi dùng máy tính để học, em cần làm gì?", "Tự suy nghĩ và kiểm tra thông tin", "Chép mọi kết quả không đọc", "Bỏ qua thầy cô", "Cung cấp mật khẩu cho mọi trang"),
        q("Sản phẩm nào em có thể tạo bằng máy tính?", "Bài trình chiếu", "Một chiếc bàn gỗ thật", "Cây sống", "Bóng đèn chưa lắp điện"),
        q("Máy tính chỉ hoạt động hữu ích khi nào?", "Con người sử dụng và đưa chỉ dẫn phù hợp", "Không có điện", "Không có phần mềm", "Không có người dùng"),
    ]),
    ("2", "Tìm kiếm thông tin trên website", [
        q("Để tìm nội dung trong một website có ô tìm kiếm, em cần làm gì?", "Nhập từ khóa vào ô tìm kiếm của website", "Tắt trang web", "Xóa địa chỉ web", "Đổi tên máy tính"),
        q("Từ khóa nào cụ thể hơn khi tìm bài về sao Hỏa?", "đặc điểm sao Hỏa", "sao", "bầu trời", "thông tin"),
        q("Nếu website có các mục nội dung, em có thể tìm bằng cách nào?", "Chọn mục phù hợp và xem các trang bên trong", "Bấm ngẫu nhiên mọi quảng cáo", "Chỉ nhìn hình nền", "Rút dây mạng"),
        q("Khi thấy kết quả tìm kiếm, em nên làm gì trước khi dùng?", "Đọc và đánh giá có đúng nhu cầu không", "Sao chép mọi kết quả", "Tin mỗi tiêu đề", "Bỏ qua nguồn"),
    ]),
    ("3", "Tìm kiếm thông tin trong giải quyết vấn đề", [
        q("Trước khi tìm thông tin để giải quyết vấn đề, em nên làm gì?", "Xác định mình cần biết điều gì", "Gõ từ khóa bất kì", "Sao chép trang đầu", "Tắt trình duyệt"),
        q("Muốn biết cách chăm sóc một cây cụ thể, từ khóa nào phù hợp?", "cách chăm sóc cây hoa hồng", "cây", "đẹp", "máy tính"),
        q("Nếu một nguồn tin chưa rõ độ tin cậy, em nên làm gì?", "Đối chiếu với nguồn đáng tin cậy khác", "Dùng ngay làm kết luận", "Chia sẻ như sự thật", "Xóa mọi kết quả"),
        q("Sau khi thu thập thông tin, bước nào giúp giải quyết vấn đề?", "Chọn thông tin liên quan rồi áp dụng phù hợp", "Chép tất cả không đọc", "Bỏ qua yêu cầu ban đầu", "Chỉ xem ảnh"),
    ]),
    ("4", "Cây thư mục", [
        q("Trong cây thư mục, thư mục con nằm ở đâu?", "Bên trong một thư mục khác", "Trong bàn phím", "Trên loa", "Ngoài máy tính"),
        q("Đường dẫn tệp cho biết điều gì?", "Vị trí của tệp trong các thư mục", "Màu của tệp", "Tốc độ gõ", "Âm lượng máy"),
        q("Muốn tìm tệp trong cây thư mục, em nên làm gì?", "Mở lần lượt các thư mục trên đường dẫn", "Xóa thư mục gốc", "Tắt máy", "Đổi màu màn hình"),
        q("Vì sao nên đặt tên thư mục rõ nghĩa?", "Để dễ nhận biết và tìm thông tin", "Để tăng số phím", "Để loa to hơn", "Để máy không cần điện"),
    ]),
    ("5", "Bản quyền nội dung thông tin", [
        q("Ai thường có quyền đối với một bức ảnh do mình sáng tạo?", "Người sáng tạo hoặc chủ sở hữu hợp pháp", "Bất cứ ai xem ảnh", "Người tải ảnh về đầu tiên", "Người đổi tên tệp"),
        q("Khi dùng ảnh của người khác trong bài trình bày, em nên làm gì?", "Kiểm tra quyền sử dụng và ghi nguồn phù hợp", "Nói là mình chụp", "Xóa tên tác giả", "Chia sẻ không cần xem điều kiện"),
        q("Hành động nào tôn trọng bản quyền?", "Xin phép hoặc dùng nội dung được cho phép", "Sao chép rồi nhận là của mình", "Xóa thông tin tác giả", "Bán lại bài của người khác"),
        q("Vì sao cần ghi nguồn nội dung tham khảo?", "Để công nhận người tạo và giúp kiểm tra nguồn", "Để che tác giả", "Để bỏ qua việc đọc", "Để máy chạy nhanh"),
    ]),
    ("6", "Định dạng kí tự và bố trí hình ảnh trong văn bản", [
        q("Định dạng kí tự có thể thay đổi điều gì?", "Phông, cỡ, màu và kiểu chữ", "Tên ổ cắm", "Vị trí bàn phím", "Tốc độ quạt"),
        q("Trước khi đổi kiểu chữ của một đoạn, em cần làm gì?", "Chọn đoạn cần định dạng", "Xóa tệp", "Tắt màn hình", "Rút bàn phím"),
        q("Khi chèn hình vào văn bản, em nên đặt hình như thế nào?", "Phù hợp nội dung và không che chữ", "Che toàn bộ văn bản", "Luôn phóng to hết trang", "Đặt ngẫu nhiên không xem"),
        q("Vì sao cần xem lại bố cục văn bản sau khi thêm hình?", "Để chữ và hình dễ đọc, dễ hiểu", "Để tệp tự biến mất", "Để mạng nhanh hơn", "Để đổi tên máy"),
    ]),
    ("7", "Thực hành soạn thảo văn bản", [
        q("Trước khi soạn một văn bản, em nên xác định gì?", "Nội dung và cách trình bày cần có", "Màu dây điện", "Số phím trên chuột", "Tên máy in của bạn"),
        q("Khi thấy một từ gõ sai, em nên làm gì?", "Sửa lại từ đó trong văn bản", "Để nguyên lỗi", "Xóa cả máy tính", "Rút nguồn"),
        q("Sau khi chỉnh sửa và trình bày văn bản, em cần làm gì?", "Lưu tệp", "Đóng không lưu", "Xóa văn bản", "Tắt bàn phím"),
        q("Tên tệp nào giúp em dễ tìm bài viết về trường?", "Giới thiệu trường em", "abc123", "Mới", "Không tên"),
    ]),
    ("8A", "Làm quen với phần mềm đồ họa", [
        q("Phần mềm đồ họa giúp em làm gì?", "Tạo và chỉnh sửa hình vẽ", "Chỉ tính toán", "Chỉ phát nhạc", "Chỉ gõ phím"),
        q("Muốn vẽ một hình tròn trong phần mềm đồ họa, em chọn gì?", "Công cụ vẽ hình phù hợp", "Nút tắt máy", "Phím âm lượng", "Thư mục hệ thống"),
        q("Nếu muốn đổi màu một vùng trong tranh, em dùng công cụ nào phù hợp?", "Công cụ tô màu", "Công cụ tắt màn hình", "Công cụ in giấy", "Công cụ đổi mật khẩu"),
        q("Sau khi hoàn thành tranh số, em nên làm gì?", "Lưu tệp với tên dễ nhớ", "Đóng không lưu", "Xóa tranh", "Rút điện"),
    ]),
    ("9A", "Sử dụng phần mềm đồ họa tạo sản phẩm số", [
        q("Trước khi tạo một tấm thiệp số, em nên làm gì?", "Xác định nội dung, hình và bố cục", "Vẽ ngẫu nhiên không xem yêu cầu", "Xóa mọi công cụ", "Tắt phần mềm"),
        q("Một sản phẩm số kết hợp chữ và hình cần chú ý gì?", "Chữ dễ đọc và hình phù hợp nội dung", "Chữ bị hình che kín", "Dùng càng nhiều màu càng tốt", "Để trống toàn bộ"),
        q("Khi muốn sửa chi tiết chưa đẹp trên hình, em nên làm gì?", "Chọn công cụ phù hợp để chỉnh sửa", "Xóa tệp khác", "Rút chuột", "In ngay bản lỗi"),
        q("Sau khi tạo sản phẩm số, để còn mở lại em cần gì?", "Lưu đúng định dạng và vị trí dễ tìm", "Chỉ chụp màn hình rồi xóa", "Đóng không lưu", "Xóa thư mục"),
    ]),
    ("8B", "Làm sản phẩm thủ công theo video hướng dẫn", [
        q("Trước khi làm theo video hướng dẫn, em nên làm gì?", "Xem vật liệu và các bước cần thực hiện", "Làm ngay không xem", "Chỉ nhìn ảnh bìa", "Bỏ qua dụng cụ"),
        q("Nếu một bước trong video quá nhanh, em có thể làm gì?", "Tạm dừng hoặc xem lại đoạn đó", "Bỏ qua luôn", "Xóa video", "Làm bước cuối trước"),
        q("Khi video dùng dụng cụ sắc hoặc nóng, em nên làm gì?", "Nhờ người lớn hỗ trợ và tuân thủ an toàn", "Tự làm vội", "Đùa với dụng cụ", "Không cần chú ý"),
        q("Sau khi làm xong sản phẩm, em nên làm gì?", "Đối chiếu sản phẩm với mục tiêu và chỉnh nếu cần", "Vứt ngay sản phẩm", "Xóa video", "Bỏ qua kết quả"),
    ]),
    ("9B", "Thực hành tạo đồ dùng gia đình theo video hướng dẫn", [
        q("Khi chọn video để làm đồ dùng gia đình, em cần chú ý gì?", "Vật liệu sẵn có và cách làm an toàn", "Chỉ lượt xem cao", "Chỉ nhạc nền", "Chỉ màu ảnh bìa"),
        q("Trước khi bắt đầu, em nên chuẩn bị gì?", "Vật liệu và dụng cụ theo các bước hướng dẫn", "Chỉ bật máy tính", "Chỉ chọn màu màn hình", "Không chuẩn bị gì"),
        q("Nếu chưa hiểu một thao tác trong video, em nên làm gì?", "Dừng, xem lại và hỏi người lớn khi cần", "Làm bừa", "Bỏ qua bước quan trọng", "Đổi sang việc khác ngay"),
        q("Khi hoàn thành đồ dùng, em nên đánh giá điều gì?", "Có sử dụng được và có an toàn không", "Có giống màu màn hình không", "Video có nhạc to không", "Bàn phím có sạch không"),
    ]),
    ("10", "Cấu trúc tuần tự", [
        q("Trong cấu trúc tuần tự, các lệnh được thực hiện như thế nào?", "Lần lượt theo thứ tự", "Ngẫu nhiên", "Chỉ lệnh cuối", "Chỉ khi có Internet"),
        q("Nếu nhân vật cần nói rồi di chuyển, em đặt lệnh nào trước?", "Lệnh nói", "Lệnh di chuyển", "Lệnh dừng", "Lệnh xóa"),
        q("Vì sao đổi thứ tự hai lệnh có thể làm kết quả khác?", "Vì máy thực hiện lệnh theo trình tự đã ghép", "Vì màn hình đổi màu", "Vì chuột chạy nhanh", "Vì máy tự bỏ lệnh"),
        q("Muốn kiểm tra chuỗi lệnh có đúng ý, em nên làm gì?", "Chạy thử chương trình", "Chỉ nhìn tên tệp", "Tắt máy", "Xóa mọi lệnh"),
    ]),
    ("11", "Cấu trúc lặp", [
        q("Cấu trúc lặp dùng để làm gì?", "Thực hiện lại một nhóm lệnh", "Chỉ chạy lệnh một lần", "Xóa chương trình", "Đổi màu máy tính"),
        q("Muốn nhân vật bước 10 bước ba lần, cách nào gọn?", "Đặt lệnh bước 10 bước trong khối lặp 3 lần", "Viết lệnh dừng ba lần", "Chỉ thay hình nền", "Xóa nhân vật"),
        q("Trong khối lặp 4 lần, nhóm lệnh bên trong thực hiện bao nhiêu lần?", "4 lần", "1 lần", "3 lần", "Không lần nào"),
        q("Nếu số lần lặp tăng từ 2 lên 5, nhóm lệnh sẽ thực hiện thế nào?", "Nhiều lần hơn", "Ít lần hơn", "Không thay đổi", "Không bao giờ chạy"),
    ]),
    ("12", "Thực hành sử dụng lệnh lặp", [
        q("Muốn vẽ hình vuông bằng lặp, thao tác nào thường được lặp 4 lần?", "Đi thẳng một cạnh rồi quay 90 độ", "Chỉ nói lời chào", "Chỉ đổi màu nền", "Đi thẳng rồi quay 180 độ"),
        q("Khi ghép khối lặp, các lệnh cần lặp đặt ở đâu?", "Bên trong khối lặp", "Sau lệnh dừng máy", "Trong tên tệp", "Trên bàn phím"),
        q("Nếu hình vẽ chưa khép kín, em nên kiểm tra gì?", "Số lần lặp và góc quay", "Âm lượng loa", "Tên máy tính", "Màu dây điện"),
        q("Vì sao dùng lệnh lặp khi một việc xảy ra nhiều lần?", "Chương trình ngắn gọn và dễ sửa hơn", "Để bỏ qua các bước", "Để máy không cần điện", "Để không phải chạy thử"),
    ]),
    ("13", "Cấu trúc rẽ nhánh", [
        q("Cấu trúc rẽ nhánh cho phép chương trình làm gì?", "Chọn hành động tùy điều kiện", "Luôn lặp vô hạn", "Chỉ chạy lệnh đầu", "Tự thay phần cứng"),
        q("Trong chỉ dẫn 'Nếu chạm cạnh thì quay lại', điều kiện là gì?", "Chạm cạnh", "Quay lại", "Chạy chương trình", "Màu nhân vật"),
        q("Khi điều kiện trong lệnh 'nếu ... thì' đúng, chương trình làm gì?", "Thực hiện các lệnh bên trong nhánh đó", "Bỏ qua tất cả lệnh", "Tắt máy", "Tự xóa dự án"),
        q("Lệnh 'nếu ... thì ... nếu không thì ...' có mấy cách xử lí tùy điều kiện?", "Hai nhánh", "Một nhánh duy nhất", "Ba nhánh luôn", "Không có nhánh"),
    ]),
    ("14", "Sử dụng biến trong chương trình", [
        q("Biến trong chương trình dùng để làm gì?", "Lưu một giá trị có thể thay đổi", "Thay dây nguồn", "Tạo bàn phím mới", "Chỉ đổi hình nền"),
        q("Muốn ghi nhớ điểm của người chơi, em có thể dùng gì?", "Biến điểm", "Chỉ tên nhân vật", "Chỉ màu sân khấu", "Chỉ âm lượng loa"),
        q("Nếu biến điểm đang bằng 3 và tăng thêm 2, giá trị mới là bao nhiêu?", "5", "1", "3", "6"),
        q("Vì sao nên đặt tên biến rõ nghĩa?", "Để hiểu biến lưu thông tin gì", "Để màn hình sáng hơn", "Để chuột nhanh hơn", "Để máy tự sửa lỗi"),
    ]),
    ("15", "Sử dụng biểu thức trong chương trình", [
        q("Biểu thức 4 + 3 cho kết quả nào?", "7", "1", "12", "43"),
        q("Nếu điểm = 8, biểu thức 'điểm > 5' có giá trị nào?", "Đúng", "Sai", "8", "5"),
        q("Biểu thức trong chương trình có thể dùng để làm gì?", "Tính toán hoặc kiểm tra điều kiện", "Thay dây điện", "Làm sạch màn hình", "Tạo chuột mới"),
        q("Muốn kiểm tra biến số_lượng bằng 0, em cần dùng kiểu biểu thức nào?", "Biểu thức so sánh", "Biểu thức chỉ đổi màu", "Lệnh in giấy", "Lệnh tắt máy"),
    ]),
    ("16", "Từ kịch bản đến chương trình", [
        q("Kịch bản chương trình mô tả điều gì?", "Những việc nhân vật hoặc chương trình cần thực hiện", "Chỉ màu vỏ máy", "Chỉ giá bàn phím", "Chỉ tên trường"),
        q("Trước khi tạo chương trình từ kịch bản, em nên làm gì?", "Chia kịch bản thành các bước và chọn lệnh phù hợp", "Ghép lệnh ngẫu nhiên", "Xóa nhân vật", "Tắt phần mềm"),
        q("Nếu kịch bản có hành động lặp lại nhiều lần, em nên dùng gì?", "Cấu trúc lặp", "Chỉ lệnh dừng", "Chỉ đổi nền", "Chỉ mở tệp"),
        q("Sau khi lập trình xong, cách nào kiểm tra chương trình đúng kịch bản?", "Chạy thử và đối chiếu từng bước với kịch bản", "Chỉ nhìn biểu tượng", "Không cần thử", "Xóa kịch bản"),
    ]),
]


def write_grade(grade, rows):
    ids = []
    for number, title, questions in rows:
        lesson_id = f"lop-{grade}-bai-{number.lower()}"
        items = []
        for i, (prompt, correct, *wrong) in enumerate(questions):
            choices = [correct, *wrong]
            shift = i % 4
            choices = choices[shift:] + choices[:shift]
            items.append({"question": prompt, "options": choices, "correctIndex": choices.index(correct), "explanation": f"{correct}." if not correct.endswith(".") else correct})
        payload = {"id": lesson_id, "subjectBadge": f"TIN HỌC LỚP {grade}", "lessonTitle": f"Bài {number}. {title}", "gameTitle": f"CHINH PHỤC TIN HỌC LỚP {grade}", "pointsPerQuestion": 10 / len(items), "timeLimitSeconds": 360, "questions": items}
        (ROOT / f"{lesson_id}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        ids.append(lesson_id)
    return ids


if __name__ == "__main__":
    grade3 = write_grade(3, GRADE3)
    grade4 = write_grade(4, GRADE4)
    grade5 = write_grade(5, GRADE5)
    catalog = (["lop-3-thong-tin-va-quyet-dinh"] + grade3 +
               grade4[:5] + ["lop-4-bai-6"] + grade4[5:] + grade5 +
               ["lop-4-tim-kiem-thong-tin-internet", "lop-4-on-tap-may-tinh", "lop-5-lap-trinh-scratch-co-ban"])
    (ROOT / "index.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
