"""Original practice questions aligned to the SGK Tin học 3, 4, 5 lesson list.

Run `python lesson-bank.py` after editing the compact question bank below.
Each row: title, question rows (prompt, correct choice, three distractors).
"""

import json
from pathlib import Path
from lesson_bank_20 import GRADE3 as MORE3, GRADE4 as MORE4, GRADE5 as MORE5, LEGACY, DEEP

ROOT = Path(__file__).parent / "lessons"


def q(prompt, correct, a, b, c):
    return (prompt, correct, a, b, c)


def extras(block):
    return [tuple(part.strip() for part in line.split("|")) for line in block.strip().splitlines()]


EXTRA3 = {
"2": extras("""
Khi nghe lời cô giáo rồi làm theo, thông tin được tiếp nhận qua giác quan nào?|Thính giác|Thị giác|Khứu giác|Vị giác
Khi đọc một biển báo, em tiếp nhận thông tin chủ yếu bằng gì?|Mắt|Tai|Mũi|Lưỡi
Kết quả của việc xử lí thông tin có thể là gì?|Một quyết định hoặc hành động|Một dây điện|Một màn hình mới|Một phím mới
Máy tính nhận chữ em gõ qua thiết bị nào?|Bàn phím|Loa|Màn hình|Máy in
Máy tính đưa âm thanh ra cho em nghe qua thiết bị nào?|Loa|Bàn phím|Chuột|Thân máy
Để trả lời câu hỏi, em nên làm gì với thông tin đã nghe?|Suy nghĩ và chọn câu trả lời phù hợp|Nhắc lại mọi âm thanh|Tắt máy tính|Nhắm mắt
"""),
"3": extras("""
Thiết bị nào đưa thông tin từ máy tính ra giấy?|Máy in|Bàn phím|Chuột|Micro
Loa máy tính đưa ra loại thông tin nào?|Âm thanh|Mùi hương|Vị ngọt|Chuyển động của chuột
Thiết bị nào có thể thu âm giọng nói vào máy tính?|Micro|Màn hình|Máy in|Loa
Máy tính xách tay có đặc điểm nào?|Có thể gập lại và mang theo|Luôn phải nối máy in|Không có màn hình|Không cần nguồn điện
Khi muốn chọn một biểu tượng trên màn hình, em thường dùng gì?|Chuột|Máy in|Loa|Ổ cắm
Thiết bị nào vừa hiển thị thông tin vừa có thể nhận thao tác chạm nếu hỗ trợ?|Màn hình cảm ứng|Máy in|Loa|Bàn phím thường
"""),
"4": extras("""
Khi làm việc với máy tính, bàn tay nên thế nào?|Đặt thoải mái, không gõ quá mạnh|Đập mạnh các phím|Giữ căng liên tục|Để trên màn hình
Nếu màn hình bị chói, em nên làm gì?|Điều chỉnh vị trí hoặc độ sáng phù hợp|Nhìn sát hơn|Tăng sáng tối đa|Che mắt bằng tay rồi gõ
Trước khi dùng máy ở phòng học, em nên làm gì?|Làm theo hướng dẫn của giáo viên|Tự ý tháo dây|Cài phần mềm bất kì|Đổ nước lên bàn
Vật nào nên để xa máy tính và ổ điện?|Đồ uống|Sách vở khô|Tấm lót chuột|Bút chì
Khi máy tính có dấu hiệu hỏng, em nên làm gì?|Báo giáo viên hoặc người lớn|Tự tháo máy|Tiếp tục dùng bất chấp|Rút mọi dây ngẫu nhiên
Trong lúc dùng máy, em nên nghỉ mắt như thế nào?|Nghỉ định kì và nhìn ra xa|Không nghỉ bao giờ|Chỉ nhìn gần hơn|Tăng độ sáng
"""),
"5": extras("""
Phím nào tạo chữ hoa khi giữ cùng phím chữ?|Shift|Space|Enter|Backspace
Phím nào có thể bật chế độ gõ chữ hoa liên tục?|Caps Lock|Space|Enter|Tab
Phím nào xóa kí tự vừa gõ ở bên trái con trỏ?|Backspace|Enter|Shift|Space
Hàng phím có A, S, D, F, J, K, L thuộc hàng nào?|Hàng phím cơ sở|Hàng phím số|Hàng phím trên|Hàng phím dưới
Để gõ nhanh và chính xác hơn, em nên làm gì?|Luyện đúng vị trí các ngón tay|Chỉ dùng một ngón|Nhìn sát phím|Gõ thật mạnh
Khi gõ bàn phím, cổ tay nên thế nào?|Thả lỏng tự nhiên|Gồng cứng|Tì mạnh liên tục|Vặn lệch hẳn
"""),
"6": extras("""
Trang web được mở bằng phần mềm nào?|Trình duyệt|Phần mềm vẽ ngoại tuyến|Máy tính bỏ túi|Trình soạn thảo giấy
Địa chỉ trang web giúp em làm gì?|Truy cập đúng trang web|Tắt máy|Thay bàn phím|In ảnh tự động
Để xem nội dung khác trên một trang, em có thể làm gì?|Nháy vào liên kết phù hợp|Rút mạng|Tắt trình duyệt|Đổi tên máy
Điều nào cần nhớ khi xem thông tin Internet?|Không phải thông tin nào cũng chính xác|Mọi thông tin đều đúng|Trang nào cũng an toàn|Không cần người lớn hướng dẫn
Khi một trang lạ xin mật khẩu, em nên làm gì?|Không nhập và hỏi người lớn|Nhập ngay|Gửi cho bạn bè|Đăng công khai
Internet có thể giúp em học bằng cách nào?|Xem tài liệu phù hợp và trao đổi với thầy cô|Bỏ qua bài học|Tin mọi quảng cáo|Chia sẻ thông tin riêng tư
"""),
"7": extras("""
Để tìm ảnh chuyến đi nhanh hơn, em nên đặt ảnh ở đâu?|Trong thư mục có tên chuyến đi|Trong nhiều thư mục ngẫu nhiên|Trong thùng rác|Trong tệp không tên
Khi sắp xếp sách theo chủ đề, sách cùng chủ đề nên thế nào?|Để cùng một nhóm|Rải đều mọi nơi|Xếp ngẫu nhiên|Giấu đi
Tên thư mục nào rõ nhất để chứa bài tập Toán lớp 3?|Bài tập Toán lớp 3|Tệp mới|12345|Không tên
Nếu không nhớ tệp nằm đâu, việc nào giúp tìm lại dễ hơn về sau?|Đặt tên và lưu theo nhóm rõ ràng|Đổi tên ngẫu nhiên|Xóa thư mục|Lưu nhiều nơi bất kì
Việc phân nhóm tệp có lợi gì?|Dễ quản lí và tìm kiếm|Tăng kích thước màn hình|Làm máy tự học|Thay nguồn điện
Sắp xếp đồ vật theo tiêu chí nào có thể hợp lí?|Theo loại hoặc mục đích sử dụng|Theo vị trí ngẫu nhiên|Theo âm lượng loa|Theo màu màn hình
"""),
"8": extras("""
Trong cây thư mục, một thư mục có thể chứa gì?|Tệp và thư mục con|Chỉ màn hình|Chỉ loa|Chỉ dây nguồn
Thư mục gốc trong một sơ đồ cây có vai trò gì?|Điểm bắt đầu của các nhánh bên dưới|Một phím gõ|Một loại âm thanh|Một hình nền
Thư mục Toán nằm trong thư mục Học tập. Toán là gì của Học tập?|Thư mục con|Thiết bị vào|Thiết bị ra|Phần mềm
Nếu thư mục Ảnh có thư mục 2026, ảnh trong 2026 thuộc nhóm nào?|Nhóm Ảnh rồi đến 2026|Nhóm Bàn phím|Nhóm Loa|Nhóm Internet
Để xem các nhánh con của một thư mục trên máy, em cần gì?|Mở hoặc mở rộng thư mục|Rút điện|Đổi màn hình|Tắt chuột
Tổ chức tệp theo cây thư mục có ích gì?|Thấy rõ vị trí và quan hệ giữa các nhóm|Tăng âm lượng|Giảm số phím|Tự sửa tệp hỏng
"""),
"9": extras("""
Tên tệp nào dễ hiểu cho bài vẽ ngôi nhà?|Ngôi nhà của em|Mới 1|abc|Không tên
Để tạo thư mục mới, em nên chọn vị trí nào?|Vị trí muốn lưu thư mục|Bất kì vị trí không nhớ|Trong thùng rác|Trên phím Enter
Nếu mở nhầm thư mục, em nên làm gì?|Quay lại rồi mở đúng thư mục|Xóa tất cả tệp|Rút dây nguồn|Đổi tên máy
Thao tác đổi tên tệp làm thay đổi điều gì?|Tên hiển thị của tệp|Nội dung bên trong luôn bị xóa|Loại màn hình|Số phím
Khi lưu tệp, vì sao cần nhớ thư mục đích?|Để tìm lại tệp khi cần|Để máy tự tắt|Để chuột sáng lên|Để loa to hơn
Nếu xóa nhầm tệp, em nên làm gì trước?|Báo giáo viên hoặc người lớn để được hỗ trợ|Xóa thêm tệp|Tắt máy vội|Giấu việc đã làm
"""),
"10": extras("""
Mật khẩu nên được chia sẻ với ai?|Chỉ người lớn có trách nhiệm khi cần hỗ trợ|Mọi bạn trong lớp|Người lạ trên mạng|Bất kì trang web nào
Khi rời máy tính dùng chung, em nên làm gì với tài khoản của mình?|Đăng xuất|Để nguyên phiên đăng nhập|Đưa mật khẩu cho bạn|Xóa bài của người khác
Vì sao không nên tự ý xóa tệp của người khác?|Có thể làm mất thông tin của họ|Để màn hình sáng hơn|Để chuột nhanh hơn|Để mạng ổn định
Sao lưu tệp nghĩa là gì?|Tạo thêm bản dự phòng ở nơi phù hợp|Đổi màu tệp|Chỉ đổi tên tệp|Xóa bản đang dùng
Khi nhận lời nhắn hỏi thông tin cá nhân từ người lạ, em nên làm gì?|Không cung cấp và báo người lớn|Trả lời ngay|Gửi cả mật khẩu|Đăng địa chỉ công khai
Để tránh mất bài vừa làm, em nên làm gì trong khi làm việc?|Lưu tệp định kì|Chỉ lưu khi máy tắt|Không bao giờ lưu|Xóa bài cũ
"""),
"11": extras("""
Trang chiếu đầu thường dùng để giới thiệu gì?|Chủ đề bài trình bày|Mật khẩu máy tính|Đường dẫn hệ thống|Tên ổ điện
Một trang chiếu nhiều chữ quá sẽ gây khó khăn gì?|Người xem khó theo dõi|Máy không có điện|Chuột biến mất|Bàn phím không gõ được
Hình ảnh trên trang chiếu nên thế nào?|Liên quan nội dung trình bày|Chọn ngẫu nhiên|Che kín chữ|Luôn thật nhỏ
Để thêm trang mới vào bài trình chiếu, em dùng chức năng nào?|Thêm trang chiếu|Xóa tệp|Tắt màn hình|In ảnh
Khi trình bày trước lớp, em nên làm gì?|Nói rõ ý chính trên trang chiếu|Chỉ đọc hết chữ rất nhanh|Quay lưng liên tục|Không xem người nghe
Vì sao cần xem lại bài trước khi trình bày?|Để phát hiện lỗi chữ và bố cục|Để đổi bàn phím|Để tắt loa|Để xóa mọi trang
"""),
"12": extras("""
Phần mềm mô phỏng Hệ Mặt Trời giúp em quan sát gì?|Các thiên thể và chuyển động mô phỏng|Mật khẩu tài khoản|Tốc độ gõ phím|Tên ổ đĩa
Muốn tìm hiểu một hành tinh trong phần mềm, em nên làm gì?|Chọn đúng hành tinh rồi xem thông tin|Chọn ngẫu nhiên và đoán|Tắt chương trình|Đổi tên máy
Vì sao hình ảnh mô phỏng hữu ích khi tìm hiểu vũ trụ?|Giúp quan sát những đối tượng khó quan sát trực tiếp|Thay thế mọi kiến thức khoa học|Làm hành tinh thật đổi vị trí|Tạo ra ngôi sao thật
Sau khi dùng phần mềm tìm hiểu thiên nhiên, em nên làm gì?|Nêu lại điều đã quan sát và học được|Chỉ nhớ màu giao diện|Xóa chương trình|Đổi mật khẩu
Nếu mô phỏng có nút bắt đầu và tạm dừng, em dùng chúng để làm gì?|Điều khiển việc quan sát chuyển động|Thay bàn phím|Đổi nguồn điện|In toàn bộ màn hình
Mô phỏng trên máy tính là gì?|Cách thể hiện đối tượng hoặc hiện tượng để học và quan sát|Chính vật thật ở ngoài trời|Một dây cáp|Một ổ điện
"""),
"13": extras("""
Nháy đúp chuột gồm mấy lần nhấn thả liên tiếp?|Hai lần|Một lần|Ba lần bắt buộc|Không lần nào
Muốn chọn một biểu tượng, em thường dùng thao tác nào?|Nháy chuột trái một lần|Rút chuột|Tắt màn hình|Nhấn phím nguồn
Con trỏ chuột di chuyển trên màn hình khi em làm gì?|Di chuyển chuột trên mặt bàn|Gõ phím cách|Bật loa|In tài liệu
Muốn đưa một biểu tượng sang vị trí khác, em dùng thao tác nào?|Kéo thả|Chỉ lăn chuột|Nhấn Enter|Tắt máy
Nháy chuột phải thường mở gì?|Bảng chọn theo ngữ cảnh|Máy in|Ổ điện|Bàn phím ảo luôn
Khi dùng chuột, bàn tay nên như thế nào?|Cầm nhẹ, di chuyển thoải mái|Nắm rất chặt|Đập xuống bàn|Tì mạnh không nghỉ
"""),
"14": extras("""
Việc nấu cơm cần bắt đầu bằng gì trong các bước sau?|Chuẩn bị gạo và nồi|Ăn cơm trước khi nấu|Cất nồi trước khi rửa|Tắt đèn phòng học
Một chỉ dẫn rõ ràng nên nói gì?|Việc cần làm và thứ tự thực hiện|Chỉ nói 'làm đi'|Chỉ nói kết quả|Không nói bước nào
Khi công việc có nhiều bước, cách trình bày nào dễ theo dõi?|Đánh số từng bước|Viết các bước lộn xộn|Bỏ bước giữa|Viết thành một từ
Trong việc rửa tay, bước nào cần làm trước khi lau khô?|Rửa và xả sạch tay|Đi ngủ|Đóng sách|Tắt máy
Nếu bỏ sót bước cần thiết, kết quả công việc có thể thế nào?|Không đạt yêu cầu|Luôn tốt hơn|Không liên quan|Tự sửa đúng
Để kiểm tra mô tả công việc, em có thể làm gì?|Thực hiện thử theo các bước|Chỉ nhìn tên việc|Xóa bước đầu|Đổi tên người làm
"""),
"15": extras("""
Trong câu 'Nếu trời nắng thì đội mũ', hành động là gì?|Đội mũ|Trời nắng|Bầu trời|Kiểm tra mưa
Điều kiện trong chỉ dẫn có thể có mấy kết quả cơ bản?|Đúng hoặc sai|Chỉ đúng|Chỉ sai|Luôn ba kết quả
Nếu đèn giao thông xanh, theo chỉ dẫn 'Nếu đèn đỏ thì dừng', em có thực hiện lệnh dừng do điều kiện này không?|Không|Có luôn|Phải tắt đèn|Phải đổi đường
Chỉ dẫn nào phù hợp để tránh ướt sách?|Nếu trời mưa thì cho sách vào túi chống nước|Luôn để sách ngoài mưa|Nếu có sách thì xé sách|Nếu trời nắng thì làm ướt sách
Khi điều kiện đúng, bước gắn với điều kiện được làm khi nào?|Sau khi kiểm tra điều kiện|Trước khi biết điều kiện|Không bao giờ|Chỉ khi tắt máy
Trong câu 'Nếu bài đã xong thì cất vở', em kiểm tra gì?|Bài đã xong chưa|Vở màu gì|Bàn phím có sáng không|Loa có to không
"""),
"16": extras("""
Trước khi tạo bài trình chiếu nhóm, em nên làm gì?|Lên ý tưởng và phân chia việc cần làm|Chọn màu ngẫu nhiên|Xóa bài của bạn|Tắt máy
Để bài trình chiếu rõ ràng, em cần chuẩn bị gì?|Nội dung và hình minh họa phù hợp|Chỉ hiệu ứng thật nhiều|Chỉ một màu nền|Chỉ âm lượng loa
Trong công việc nhóm, máy tính giúp gì?|Tạo và chỉnh sửa các trang chiếu|Tự quyết định mọi ý tưởng|Tự phân công mọi người|Tự thay thầy cô
Sau khi tạo từng trang chiếu, em nên làm gì?|Xem lại nội dung và thứ tự các trang|Xóa mọi tiêu đề|Đổi tên bàn phím|Rút nguồn
Muốn giới thiệu sản phẩm nhóm, em dùng chức năng nào?|Trình chiếu bài đã tạo|Xóa tệp|Tắt màn hình|Đổi con trỏ
Sau khi hoàn thành sản phẩm, cả nhóm nên làm gì?|Kiểm tra, lưu và cùng trình bày|Đóng không lưu|Xóa bài|Để một bạn tự làm hết
"""),
}

EXTRA4 = {
"1": extras("""
Chuột máy tính thuộc nhóm nào?|Phần cứng|Phần mềm|Trang web|Tệp văn bản
Ứng dụng vẽ trên máy tính thuộc nhóm nào?|Phần mềm|Phần cứng|Dây cáp|Ổ điện
Khi không có phần mềm phù hợp, phần cứng có tự soạn văn bản theo ý em được không?|Không|Luôn được|Chỉ cần loa|Chỉ cần chuột
Hệ điều hành là loại thành phần nào của máy tính?|Phần mềm|Bàn phím|Màn hình|Thân máy
Máy in là thiết bị nào?|Thiết bị phần cứng đưa thông tin ra giấy|Phần mềm vẽ|Trang web|Tệp âm thanh
Khi chọn phần mềm cho công việc, em nên dựa vào gì?|Chức năng phần mềm có phù hợp nhu cầu không|Màu vỏ máy|Độ dài dây nguồn|Số loa
"""),
"2": extras("""
Phím cách thường được gõ bằng ngón nào?|Ngón cái|Ngón trỏ|Ngón út|Ngón giữa
Gõ đúng cách giúp điều gì?|Tăng độ chính xác và sự thoải mái|Không cần học chữ|Bàn phím tự sạch|Màn hình lớn hơn
Khi gõ hàng phím trên, sau đó ngón tay nên làm gì?|Về hàng phím cơ sở|Ở nguyên hàng trên|Chạm màn hình|Cầm chuột
Em nên nhìn vào đâu nhiều hơn khi luyện gõ đúng cách?|Màn hình và nội dung cần gõ|Chỉ nhìn từng phím|Ổ điện|Loa
Khi bị gõ sai liên tục, em nên làm gì?|Chậm lại và sửa vị trí ngón tay|Gõ mạnh hơn|Dùng một ngón|Bỏ mọi lỗi
Tư thế nào giúp tránh mỏi khi gõ?|Ngồi thẳng và thả lỏng vai|Cúi sát bàn|Gồng cứng tay|Nằm gõ
"""),
"3": extras("""
Địa chỉ web cho biết gì?|Vị trí truy cập một trang hoặc website|Màu bàn phím|Âm lượng loa|Số tệp trong máy
Khi nháy vào liên kết, điều gì có thể xảy ra?|Mở trang hoặc nội dung được liên kết|Máy tự tắt luôn|Bàn phím biến mất|Tệp luôn bị xóa
Hình ảnh trên trang web có thể giúp gì?|Minh họa nội dung|Bảo đảm mọi câu đúng|Thay mật khẩu|Tạo dây mạng
Video trên trang web có thể chứa gì?|Hình chuyển động và âm thanh|Chỉ chữ in giấy|Mùi hương|Vị thức ăn
Muốn quay về trang vừa xem trong trình duyệt, em dùng gì?|Nút Quay lại|Nút tắt nguồn|Phím âm lượng|Máy in
Khi trang web hiển thị thông tin riêng tư, em nên làm gì?|Chỉ xem và chia sẻ theo hướng dẫn phù hợp|Đăng công khai|Gửi mật khẩu|Chụp và phát tán ngay
"""),
"4": extras("""
Từ khóa trong tìm kiếm nên phản ánh gì?|Nội dung cần tìm|Màu chuột|Tên ổ cắm|Loại bàn ghế
Từ khóa nào phù hợp để tìm giờ mở cửa bảo tàng cụ thể?|giờ mở cửa Bảo tàng Lịch sử Quốc gia|bảo tàng|giờ|địa điểm
Nếu kết quả không đúng chủ đề, em nên làm gì?|Sửa từ khóa cho rõ hơn|Sao chép kết quả đầu|Tắt mạng|Xóa trình duyệt
Vì sao không nên chỉ đọc tiêu đề kết quả?|Tiêu đề có thể chưa phản ánh đủ nội dung|Tiêu đề luôn sai|Nội dung không quan trọng|Mọi kết quả giống nhau
Nguồn nào đáng tin hơn cho thông tin của một bảo tàng?|Website chính thức của bảo tàng|Bình luận không rõ người viết|Quảng cáo bất kì|Tin nhắn lạ
Khi tìm được thông tin phù hợp, em nên làm gì?|Ghi lại ý cần dùng và nguồn|Chia sẻ không đọc|Nhập mật khẩu|Tắt máy ngay
"""),
"5": extras("""
Nếu sao chép tệp từ thư mục A sang B, tệp gốc ở A thế nào?|Vẫn còn|Luôn biến mất|Thành thư mục|Tự đổi nội dung
Nếu di chuyển tệp từ A sang B thành công, tệp thường nằm ở đâu?|Ở B|Ở A và B như hai bản sao|Trong bàn phím|Trên loa
Muốn đổi tên thư mục, em nên chọn gì?|Đúng thư mục cần đổi tên|Tệp của bạn khác|Ổ điện|Màn hình
Trước khi dán tệp đã sao chép, em cần mở đâu?|Thư mục đích|Thùng rác|Bàn phím ảo|Trang web lạ
Vì sao cần đặt tên tệp dễ hiểu?|Để phân biệt và tìm lại|Để loa to hơn|Để có thêm dung lượng ngay|Để chuột sáng
Khi tệp không còn cần dùng, em có thể làm gì sau khi kiểm tra?|Xóa đúng tệp|Xóa toàn bộ ổ đĩa|Rút điện|Đổi tên mọi thư mục
"""),
"7": extras("""
Trang chiếu mới được thêm vào bài để làm gì?|Trình bày thêm ý hoặc nội dung|Tăng số dây điện|Đổi tên bàn phím|Tắt Internet
Nội dung trên một trang chiếu nên thế nào?|Ngắn gọn, dễ theo dõi|Đầy kín chữ thật nhỏ|Không liên quan chủ đề|Che hết bằng ảnh
Muốn sắp xếp ý theo trình tự, em nên làm gì?|Sắp xếp các trang chiếu theo thứ tự phù hợp|Để ngẫu nhiên|Xóa trang đầu|Chỉ đổi màu nền
Hình ảnh trong bài trình chiếu nên làm gì?|Hỗ trợ người xem hiểu nội dung|Che kín chữ|Luôn làm nền thật rối|Không liên quan bài
Để xem toàn bộ bài như khi trình bày, em dùng chức năng nào?|Trình chiếu|Đổi tên tệp|Xóa trang|Tắt màn hình
Khi lưu bài trình chiếu, tên nào dễ tìm hơn?|Giới thiệu lớp 4A|Mới 2|abc|Không tên
"""),
"8": extras("""
Muốn làm tiêu đề nổi bật, em có thể tăng gì?|Cỡ chữ|Âm lượng loa|Tốc độ chuột|Số trang web
Kiểu chữ in nghiêng thường được dùng để làm gì?|Nhấn mạnh hoặc phân biệt một phần chữ|Xóa toàn bộ chữ|Thay nền trang|Đóng tệp
Nếu chữ vàng trên nền trắng khó đọc, em nên làm gì?|Đổi sang màu có độ tương phản rõ|Giảm cỡ chữ hơn|Che chữ bằng ảnh|Giữ nguyên
Khi căn giữa tiêu đề, điều gì thay đổi?|Vị trí đoạn chữ trên trang chiếu|Nội dung câu chữ|Tên tệp|Số dây cáp
Muốn trình bày danh sách các ý trên trang chiếu rõ hơn, em có thể dùng gì?|Dấu đầu dòng|Chỉ hiệu ứng chuyển trang|Xóa tiêu đề|Tắt ứng dụng
Sau khi định dạng, em nên kiểm tra gì?|Chữ vẫn rõ và bố cục cân đối|Chuột có đổi màu|Loa có sáng|Ổ điện có tên
"""),
"9": extras("""
Hiệu ứng chuyển trang thuộc phần nào của bài trình chiếu?|Cách xuất hiện khi đổi trang|Nội dung tệp âm thanh|Bàn phím|Thư mục
Nếu hiệu ứng quá lâu, người xem có thể cảm thấy gì?|Mất tập trung và phải chờ|Đọc nhanh hơn|Máy không cần điện|Trang tự chính xác
Muốn áp dụng cùng hiệu ứng cho nhiều trang, em nên dùng chức năng nào?|Áp dụng cho các trang phù hợp|Đổi tên máy|Xóa từng trang|Tắt bàn phím
Hiệu ứng chuyển trang có thay thế nội dung bài học không?|Không|Có hoàn toàn|Chỉ cần hiệu ứng|Nội dung sẽ tự tạo
Khi thuyết trình nghiêm túc, em nên ưu tiên gì?|Nội dung rõ ràng và hiệu ứng vừa phải|Hiệu ứng phức tạp nhất|Âm thanh lớn nhất|Mỗi trang một màu chói
Để đổi một hiệu ứng chưa phù hợp, em cần làm gì?|Chọn trang rồi chọn hiệu ứng khác|Xóa cả máy|Rút điện|Đổi bàn phím
"""),
"10": extras("""
Em dùng phím nào để tạo khoảng trắng giữa hai từ?|Space|Enter|Delete|Caps Lock
Khi gõ văn bản, chữ mới xuất hiện ở đâu?|Tại vị trí con trỏ soạn thảo|Trong loa|Trên máy in ngay|Trong thùng rác
Muốn mở lại văn bản đã lưu, em cần gì?|Tìm và mở đúng tệp văn bản|Gõ lại toàn bộ|Đổi chuột|Tắt máy
Đoạn văn bản thường kết thúc khi em nhấn phím nào?|Enter|Shift|Tab|Caps Lock
Nếu chưa lưu văn bản mà đóng ứng dụng, có nguy cơ gì?|Mất phần nội dung vừa làm|Máy tự in bài|Tệp tự sao lưu luôn|Bàn phím hỏng
Tên tệp nào rõ ràng cho bài viết về gia đình?|Gia đình em|Mới|123|Tệp
"""),
"11": extras("""
Muốn sao chép một đoạn văn sang vị trí khác, em làm gì?|Chọn đoạn, sao chép rồi dán|Xóa đoạn rồi đóng tệp|Rút bàn phím|Tắt máy
Muốn di chuyển một đoạn văn, em có thể làm gì?|Cắt đoạn rồi dán vào vị trí mới|Chỉ sao chép mà không xóa bản cũ|Rút bàn phím|Tắt máy
Nếu lỡ xóa sai nội dung, thao tác nào thường giúp khôi phục ngay?|Hoàn tác|Lưu đè ngay|Xóa thêm|Đóng máy
Khi di chuyển một câu sang chỗ khác, em cần kiểm tra gì?|Vị trí mới và dấu câu|Màu dây nguồn|Tốc độ mạng|Tên chuột
Vì sao cần đọc lại văn bản sau khi sửa?|Để phát hiện lỗi còn sót|Để máy tự in|Để tăng dung lượng|Để đổi nền
Muốn thêm hình vào văn bản, em dùng chức năng nào?|Chèn hình ảnh|Tắt máy|Đổi tên tệp|Xóa đoạn văn
"""),
"12A": extras("""
Video về một lễ hội giúp em biết thêm điều gì?|Hình ảnh và âm thanh sinh động về văn hóa|Mật khẩu máy tính|Tên ổ điện|Số phím trên bàn
Khi âm thanh video quá lớn, em nên làm gì?|Giảm âm lượng phù hợp|Tăng tối đa|Tắt màn hình|Rút bàn phím
Muốn xem riêng một đoạn video, em có thể làm gì?|Tua đến đoạn cần xem|Xóa video|Đổi tên máy|Tắt chuột
Sau khi xem video về một địa danh, em nên làm gì?|Kể lại điều mới quan sát được|Chỉ nhớ tên tệp|Xóa video ngay|Đổi tên máy
Nếu công cụ có nút tạm dừng, nút đó dùng để làm gì?|Ngừng phát tạm thời|Xóa tệp|Tắt máy|Đổi định dạng luôn
Để người xem hiểu sản phẩm đa phương tiện, em nên chọn nội dung thế nào?|Phù hợp chủ đề và rõ ràng|Ngẫu nhiên và thật nhiều|Che kín chữ|Chỉ chọn nội dung dài
"""),
"12B": extras("""
Khi phần mềm báo gõ sai, em nên làm gì?|Xem phím đúng và gõ lại|Bỏ qua hết lỗi|Đập mạnh phím|Tắt màn hình
Độ chính xác khi luyện gõ cho biết gì?|Tỉ lệ phím gõ đúng|Màu bàn phím|Số loa|Độ sáng màn hình
Muốn luyện tốt hơn, em nên tập như thế nào?|Đều đặn từ bài dễ đến khó|Chỉ tập bài khó một lần|Không sửa lỗi|Chỉ dùng một ngón
Phím F và J có dấu gờ để giúp gì?|Định vị ngón trỏ không cần nhìn nhiều|Tăng âm lượng|Mở máy in|Đổi màu phím
Khi mỏi tay trong lúc luyện gõ, em nên làm gì?|Nghỉ ngắn và điều chỉnh tư thế|Gõ nhanh hơn|Gồng tay|Gõ mạnh hơn
Kết quả luyện gõ có thể giúp em nhận biết gì?|Tốc độ và độ chính xác để cải thiện|Số trang web|Tên máy in|Mật khẩu tài khoản
"""),
"13": extras("""
Trò chơi trên máy tính được tạo bằng gì?|Chương trình máy tính|Chỉ màu màn hình|Chỉ bàn phím|Chỉ dây mạng
Chương trình máy tính gồm những gì?|Các câu lệnh theo thứ tự xác định|Chỉ hình nền|Chỉ tên nhân vật|Chỉ âm lượng
Trong trò chơi điều khiển rô-bốt, rô-bốt làm gì?|Thực hiện chỉ dẫn theo thứ tự|Tự đoán mọi ý định|Luôn đi ngẫu nhiên|Không cần chỉ dẫn
Trong Scratch, nút cờ xanh thường dùng để làm gì?|Chạy chương trình|Xóa phần mềm|Tắt máy|Đổi ngôn ngữ
Trong Scratch, vùng sân khấu dùng để gì?|Quan sát nhân vật hoạt động|Cắm dây điện|Gõ mật khẩu|Lưu ảnh giấy
Muốn mở một chương trình đã lưu trong Scratch, em dùng chức năng nào?|Mở tệp từ máy tính|Tắt ứng dụng|Xóa sân khấu|In chương trình
"""),
"14": extras("""
Khối lệnh bắt đầu thường cho biết gì?|Khi nào chương trình chạy|Tên bàn phím|Số trang web|Dung lượng ổ điện
Sân khấu trong môi trường lập trình trực quan là gì?|Nơi hiển thị hoạt động của nhân vật|Bàn gõ|Thùng rác|Máy in
Một khối lệnh di chuyển làm nhân vật thế nào?|Thay đổi vị trí theo chỉ dẫn|Thay nguồn điện|Tạo bàn phím|Xóa phần mềm
Khi kéo một khối lệnh vào vùng lập trình, em đang làm gì?|Xây dựng chương trình|In tài liệu|Thay phần cứng|Tắt máy
Nếu các khối chưa nối đúng, điều gì có thể xảy ra?|Chương trình không chạy như mong muốn|Máy tự sửa hết|Loa biến mất|Màn hình đổi loại
Để quan sát kết quả, em nên nhìn đâu khi chạy chương trình?|Sân khấu hoặc vùng hiển thị|Ổ cắm|Mặt sau bàn phím|Máy in tắt
"""),
"15": extras("""
Trong Scratch, nhân vật mới được thêm vào đâu?|Danh sách nhân vật của dự án|Ổ điện|Bàn phím|Máy in
Khi nhân vật cần thực hiện ba hành động, em nên làm gì?|Sắp xếp ba lệnh theo đúng trình tự|Chỉ ghép một lệnh|Ghép ngẫu nhiên|Xóa sân khấu
Khối lệnh nói giúp nhân vật thể hiện gì?|Lời thoại trên màn hình|Mật khẩu máy|Dây mạng|Giấy in
Nếu chương trình cần lặp một hành động, em nên cân nhắc gì?|Dùng khối lặp phù hợp|Sao chép vô hạn không kiểm tra|Xóa hành động|Tắt phần mềm
Khi sản phẩm số chưa đúng ý, em nên làm gì?|Sửa từng chỗ rồi thử lại|Giữ nguyên lỗi|Xóa máy|Đổi bàn phím
Muốn đổi bối cảnh câu chuyện Scratch, em có thể làm gì?|Thay phông nền sân khấu|Đổi dây điện|Xóa bàn phím|Tắt loa
"""),
"16": extras("""
Trước khi viết chương trình, em nên xác định gì?|Mục tiêu và các bước thực hiện|Màu vỏ máy|Giá bàn phím|Tên ổ cắm
Khi nhiều lệnh cùng điều khiển một nhân vật, thứ tự có thể ảnh hưởng gì?|Kết quả hành động|Độ dài dây điện|Màu chuột|Số loa
Lỗi chương trình là gì?|Kết quả khác điều mong muốn do lệnh hoặc dữ liệu chưa phù hợp|Máy không có màu đẹp|Bàn quá nhỏ|Loa quá mới
Muốn chia sẻ chương trình, trước tiên em nên gì?|Lưu và chạy thử dự án|Xóa tệp|Rút mạng|Đóng không lưu
Nếu bạn dùng chương trình không biết bắt đầu, em nên làm gì?|Hướng dẫn cách chạy|Giấu cách dùng|Xóa nhân vật|Đổi tên máy
Khi sửa một lệnh, bước nào giúp biết đã đúng chưa?|Chạy thử lại|Chỉ đổi màu nền|Tắt phần mềm|Xóa kịch bản
"""),
}

EXTRA5 = {
"1": extras("""
Máy tính có thể hỗ trợ em trao đổi với bạn qua gì?|Ứng dụng liên lạc phù hợp|Dây nguồn|Máy in không giấy|Tấm lót chuột
Khi tạo bài học bằng máy tính, em cần chọn gì?|Phần mềm phù hợp với công việc|Phần mềm bất kì|Chỉ màn hình|Chỉ loa
Máy tính giúp lưu thông tin bằng cách nào?|Lưu tệp trên thiết bị lưu trữ|Chỉ phát ra tiếng|Chỉ đổi màu màn hình|Chỉ di chuyển chuột
Điều nào máy tính không tự bảo đảm?|Mọi thông tin tìm được đều chính xác|Hiển thị ảnh theo lệnh|Lưu tệp theo lệnh|Phát âm thanh theo lệnh
Để dùng máy tính có ích, em cần gì?|Mục tiêu rõ và sử dụng hợp lí|Chơi liên tục|Tin mọi kết quả|Không kiểm tra thông tin
Khi cần trình bày một ý tưởng, sản phẩm nào phù hợp?|Bài trình chiếu|Dây cáp|Bàn phím|Ổ cắm
"""),
"2": extras("""
Ô tìm kiếm trong website thường giúp gì?|Tìm nội dung bên trong website đó|Tắt máy|Đổi tên ổ đĩa|In mọi trang
Nếu không thấy ô tìm kiếm, em có thể tìm bằng gì?|Danh mục hoặc liên kết trên website|Bàn phím bị rút|Ổ điện|Loa
Muốn tìm bài về loài cá trên website bảo tàng, từ khóa nào phù hợp?|loài cá|bàn phím|thời tiết hôm qua|máy in
Nếu từ khóa quá chung, kết quả có thể thế nào?|Nhiều và khó chọn|Luôn chỉ một kết quả|Luôn chính xác nhất|Không có trang nào
Khi một kết quả nằm ngoài website đang xem, em cần làm gì?|Kiểm tra địa chỉ và nguồn trước khi dùng|Tin ngay|Nhập mật khẩu|Chia sẻ liền
Khi tìm xong, em nên ghi lại gì để xem lại nguồn?|Tên trang hoặc địa chỉ phù hợp|Mật khẩu của bạn|Tên chuột|Số phím
"""),
"3": extras("""
Vấn đề 'chọn cây trồng ở ban công ít nắng' cần tìm thông tin gì?|Cây phù hợp ánh sáng yếu và cách chăm sóc|Tất cả trò chơi|Giá bàn phím|Màu máy in
Nếu có quá nhiều kết quả, em nên làm gì?|Lọc theo nhu cầu và nguồn tin đáng tin|Đọc ngẫu nhiên|Tin quảng cáo đầu|Bỏ vấn đề ban đầu
Thông tin giải quyết vấn đề cần có đặc điểm nào?|Liên quan và đáng tin cậy|Càng dài càng tốt|Không cần nguồn|Chỉ là hình đẹp
Khi hai nguồn đưa lời khuyên khác nhau, em nên làm gì?|Đối chiếu và hỏi người có hiểu biết|Chọn ngẫu nhiên|Chép cả hai như đúng|Không đọc nữa
Sau khi tìm thông tin, em cần đưa ra gì?|Cách giải quyết phù hợp với điều kiện thực tế|Mật khẩu|Tên tệp nhạc|Màu nền máy
Vì sao cần nêu nguồn khi trình bày giải pháp?|Để người khác kiểm tra thông tin|Để che người viết|Để thay nội dung|Để máy chạy nhanh
"""),
"4": extras("""
Thư mục A chứa B, B chứa tệp X. Muốn mở X từ A, em cần làm gì?|Mở B rồi mở X|Mở loa|Tắt A|Đổi bàn phím
Đường dẫn giúp phân biệt hai tệp cùng tên ở đâu?|Ở các thư mục khác nhau|Trên cùng phím|Trong loa|Trên màn hình khác
Trong cây thư mục, nhánh con có thể chứa gì?|Các thư mục con hoặc tệp|Chỉ dây điện|Chỉ chuột|Chỉ loa
Thư mục cha của thư mục Ảnh nếu Ảnh nằm trong Học tập là gì?|Học tập|Ảnh|Một tệp bất kì|Bàn phím
Nếu đặt sai tệp trong cây thư mục, em nên làm gì?|Chuyển tệp tới thư mục phù hợp|Xóa toàn bộ cây|Rút điện|Đổi tên mọi tệp
Khi không nhớ vị trí một tệp, em có thể dùng gì trên máy tính?|Công cụ tìm kiếm tệp|Nút âm lượng|Phím nguồn|Máy in
"""),
"5": extras("""
Văn bản do người khác viết là nội dung có thể có gì?|Quyền tác giả|Quyền tự nhận là của mình|Quyền xóa nguồn|Quyền bán lại tự do luôn
Khi trích ý từ bài viết trên mạng, em nên làm gì?|Nêu nguồn phù hợp|Nhận là ý mình|Xóa tên tác giả|Sao chép toàn bài không đọc
Nội dung được cho phép dùng miễn phí có nghĩa gì?|Được dùng theo điều kiện mà chủ sở hữu nêu|Muốn làm gì cũng được|Được nhận mình là tác giả|Được bán lại luôn
Nếu không rõ quyền sử dụng một ảnh, em nên làm gì?|Tìm điều kiện sử dụng hoặc xin phép|Dùng ngay không hỏi|Xóa chú thích|Đổi tên ảnh để che nguồn
Hành động nào thể hiện tôn trọng tác giả?|Ghi tên tác giả khi sử dụng theo yêu cầu|Xóa tên tác giả|Đăng lại và nhận công|Sửa nội dung rồi nhận là của mình
Vì sao không nên chép bài của người khác thành bài mình?|Vì không trung thực và xâm phạm quyền của người tạo|Vì máy chạy chậm|Vì bàn phím hỏng|Vì mạng luôn tắt
"""),
"6": extras("""
Muốn một cụm từ nổi bật, em có thể dùng kiểu chữ nào?|In đậm|Ẩn chữ|Xóa chữ|Đổi tên tệp
Cỡ chữ quá nhỏ có thể gây gì?|Khó đọc|Máy tự tắt|Chuột mất|Ảnh tự xóa
Khi chọn màu chữ, em cần xem gì?|Độ tương phản với nền|Độ dài dây điện|Số cổng USB|Âm lượng loa
Khi ảnh che mất chữ, em cần làm gì?|Điều chỉnh vị trí và cách bố trí ảnh|Giữ nguyên|Xóa văn bản|Đổi máy in
Trước khi thay phông chữ, em cần làm gì?|Chọn phần văn bản muốn đổi|Rút dây nguồn|Đổi chuột|Xóa thư mục
Sau khi bố trí ảnh, em nên xem lại gì?|Văn bản và hình có cân đối, dễ đọc không|Giá máy tính|Số phím|Tốc độ mạng
"""),
"7": extras("""
Một văn bản hoàn chỉnh thường cần gì?|Nội dung đúng và trình bày dễ đọc|Chỉ nhiều màu|Chỉ ảnh lớn|Chỉ tên tệp
Khi gõ nhầm một chữ, em nên dùng gì để sửa?|Con trỏ soạn thảo và phím xóa phù hợp|Máy in|Loa|Ổ điện
Vì sao nên kiểm tra chính tả trước khi nộp?|Để giảm lỗi và người đọc hiểu đúng|Để máy in nhanh|Để tệp đổi tên|Để chuột sáng
Khi văn bản cần ảnh minh họa, em nên chọn ảnh thế nào?|Liên quan nội dung và được phép sử dụng|Ảnh ngẫu nhiên|Ảnh che hết chữ|Ảnh không rõ nguồn bắt buộc
Muốn chuyển một đoạn văn đến chỗ khác, thao tác nào phù hợp?|Cắt rồi dán vào vị trí mới|Chỉ sao chép rồi để nguyên|Xóa cả tài liệu|Đổi tên tệp
Sau khi lưu, muốn chắc tệp còn dùng được, em có thể làm gì?|Mở lại và kiểm tra nội dung|Xóa tệp|Đóng máy ngay|Đổi tên mọi thư mục
"""),
"8A": extras("""
Vùng vẽ trong phần mềm đồ họa là nơi nào?|Nơi em tạo hình ảnh|Nơi cắm điện|Nơi phát loa|Nơi gõ mật khẩu
Công cụ bút vẽ thường dùng để gì?|Vẽ nét tự do|In tài liệu|Tắt máy|Xóa ứng dụng
Muốn xóa một nét vẽ sai, em có thể dùng gì?|Công cụ tẩy hoặc hoàn tác|Máy in|Loa|Dây mạng
Muốn hình vẽ có màu, em dùng gì?|Bảng màu và công cụ tô phù hợp|Chỉ bàn phím số|Chỉ ổ điện|Chỉ tên tệp
Nếu vẽ hỏng một bước vừa làm, thao tác nào hữu ích?|Hoàn tác|Lưu đè ngay|Đóng không lưu|Tắt màn hình
Để tiếp tục vẽ hôm sau, em cần gì?|Lưu sản phẩm ở vị trí dễ tìm|Chỉ nhớ hình trong đầu|Xóa bản vẽ|Rút điện
"""),
"9A": extras("""
Khi làm sản phẩm số, bước đầu là gì?|Xác định mục đích và người xem|Chọn màu ngẫu nhiên|Xóa vùng vẽ|In trang trắng
Một tấm thiệp số cần lời chúc dễ đọc. Em nên gì?|Đặt chữ rõ ràng trên nền phù hợp|Cho chữ trùng màu nền|Che chữ bằng ảnh|Giảm cỡ chữ thật nhỏ
Hình và chữ trên sản phẩm nên có quan hệ nào?|Cùng phục vụ nội dung chính|Hoàn toàn không liên quan|Tranh nhau che phủ|Càng nhiều càng tốt
Nếu muốn đổi vị trí một hình, em dùng gì?|Công cụ chọn và di chuyển phù hợp|Phím nguồn|Máy in|Loa
Trước khi chia sẻ sản phẩm số, em cần gì?|Kiểm tra nội dung và quyền dùng tư liệu|Gửi ngay chưa xem|Xóa nguồn ảnh|Nhập mật khẩu người khác
Nếu người xem không hiểu thông điệp, em nên làm gì?|Chỉnh bố cục hoặc chữ cho rõ hơn|Thêm thật nhiều hình ngẫu nhiên|Xóa mọi chữ|Giữ nguyên mọi lỗi
"""),
"8B": extras("""
Video hướng dẫn thường trình bày các bước bằng gì?|Hình chuyển động và lời nói hoặc chữ|Chỉ mùi hương|Chỉ giấy in|Chỉ âm thanh không bao giờ có hình
Muốn biết cần bao nhiêu vật liệu, em nên xem phần nào?|Phần chuẩn bị trong video hoặc mô tả|Chỉ đoạn kết|Chỉ ảnh bìa|Chỉ nhạc nền
Khi xem hướng dẫn, vì sao nên ghi nhớ trình tự?|Để làm đúng từng bước|Để bỏ bớt bước|Để làm ngược luôn|Để tắt video nhanh
Nếu vật liệu trong video không có, em nên làm gì?|Hỏi người lớn về vật liệu thay thế phù hợp và an toàn|Tự dùng vật nguy hiểm|Bỏ hết vật liệu|Dùng bất cứ thứ gì
Sau mỗi bước làm thủ công, em nên làm gì?|So sánh với video trước khi tiếp tục|Luôn bỏ qua kết quả|Làm ngược bước trước|Xóa video
Khi thao tác với keo hoặc kéo, em cần chú ý gì?|Sử dụng an toàn theo hướng dẫn người lớn|Đùa nghịch với dụng cụ|Làm thật vội|Để dụng cụ gần mặt
"""),
"9B": extras("""
Một đồ dùng gia đình làm từ vật liệu tái sử dụng cần ưu tiên gì?|An toàn và có ích khi dùng|Chỉ màu thật chói|Chỉ giống ảnh bìa|Chỉ làm nhanh
Nếu video có bước cắt vật liệu cứng, em nên làm gì?|Nhờ người lớn hỗ trợ|Tự cố cắt vội|Bỏ qua cảnh báo|Dùng tay không
Khi chuẩn bị vật liệu, em cần kiểm tra gì?|Đủ số lượng và phù hợp hướng dẫn|Chỉ giá bán|Chỉ màu bàn|Chỉ tên tệp
Nếu sản phẩm không đứng vững, em nên làm gì?|Kiểm tra và gia cố theo cách an toàn|Dùng ngay bất chấp|Giấu lỗi|Đập bỏ ngay
Sau khi hoàn thành, em có thể làm gì để chia sẻ cách làm?|Giới thiệu các bước và điều đã điều chỉnh|Chỉ nói tên video|Không thử sản phẩm|Xóa hình minh họa
Khi dùng video của người khác để giới thiệu sản phẩm, em nên gì?|Ghi nguồn video phù hợp|Nhận là video của mình|Xóa tên người làm|Đăng lại không xem quyền
"""),
"10": extras("""
Nếu lệnh A đứng trước lệnh B, lệnh nào chạy trước trong trình tự?|A|B|Cả hai luôn cùng lúc|Không lệnh nào
Trong công việc pha nước chanh, bước nào thường trước bước khuấy?|Cho nguyên liệu vào cốc|Uống hết trước|Cất cốc|Rửa cốc sau
Trong chương trình tuần tự, khi lệnh trước chưa hoàn thành, lệnh sau thường thế nào?|Chờ đến lượt thực hiện|Luôn chạy trước|Tự xóa|Thay phần cứng
Đổi hai lệnh nói và di chuyển có thể làm gì?|Thay đổi thứ tự hành động nhìn thấy|Không thể có thay đổi|Tạo thêm bàn phím|Tắt điện
Một chương trình có ba lệnh nối tiếp sẽ chạy thế nào?|Theo thứ tự từ lệnh đầu đến lệnh cuối|Ngẫu nhiên|Chỉ lệnh cuối|Chỉ lệnh giữa
Muốn sửa trình tự sai, em nên làm gì?|Sắp lại các khối lệnh rồi chạy thử|Chỉ đổi hình nền|Rút chuột|Xóa mọi tệp
"""),
"11": extras("""
Khối lặp 3 lần chứa lệnh nói 'Xin chào' sẽ nói bao nhiêu lần?|3 lần|1 lần|2 lần|4 lần
Số lần lặp trong khối lặp cho biết gì?|Nhóm lệnh bên trong chạy bao nhiêu lần|Số nhân vật|Màu sân khấu|Tên tệp
Nếu cần thực hiện một việc 10 lần, cấu trúc nào phù hợp?|Lặp với số lần phù hợp|Chỉ rẽ nhánh không lặp|Chỉ lệnh dừng|Chỉ đổi nền
Lệnh đặt ngoài khối lặp có được lặp theo khối đó không?|Không|Có luôn|Chỉ khi có loa|Chỉ khi mạng nhanh
Nếu khối lặp 5 lần chứa hai lệnh, mỗi lệnh chạy bao nhiêu lần?|5 lần|2 lần|1 lần|10 lần
Khi dùng lặp, em vẫn cần làm gì?|Kiểm tra số lần và kết quả chạy|Không cần thử|Xóa các lệnh bên trong|Chỉ nhìn màu khối
"""),
"12": extras("""
Để vẽ tam giác đều bằng lặp, mỗi lần thường quay bao nhiêu độ ngoài?|120 độ|90 độ|60 độ|180 độ
Muốn vẽ hình vuông, khối lặp cần chạy bao nhiêu lần cho bốn cạnh?|4 lần|2 lần|3 lần|5 lần
Trong mỗi vòng vẽ hình vuông, nhân vật cần làm gì?|Đi thẳng rồi quay 90 độ|Chỉ đổi màu|Chỉ nói|Đi rồi quay 180 độ
Nếu lặp thiếu một lần khi vẽ hình vuông, hình sẽ thế nào?|Thiếu một cạnh trong chuỗi vẽ|Tự hoàn chỉnh|Thành hình tròn|Máy tự tắt
Khi thay độ dài bước đi trong lệnh lặp vẽ vuông, điều gì đổi?|Độ dài cạnh hình vuông|Số lần lặp luôn|Tên nhân vật|Màu bàn phím
Để sửa hình vẽ chưa đúng, em nên gì?|Kiểm tra lệnh trong vòng lặp và chạy lại|Xóa máy|Chỉ đổi tên tệp|Bỏ qua lỗi
"""),
"13": extras("""
Điều kiện 'điểm > 5' đúng khi điểm bằng 8 không?|Có|Không|Chỉ khi điểm bằng 5|Không xác định dù đã biết điểm
Nếu điều kiện sai trong lệnh 'nếu ... thì', nhánh lệnh đó thường thế nào?|Không được thực hiện|Luôn thực hiện|Tự lặp vô hạn|Xóa chương trình
Nhánh 'nếu không thì' chạy khi nào?|Khi điều kiện ban đầu sai|Khi điều kiện đúng|Luôn chạy trước|Không bao giờ
Muốn nhân vật nói 'Thắng' khi điểm đủ 10, em dùng gì?|Lệnh rẽ nhánh kiểm tra điểm|Chỉ lệnh di chuyển|Chỉ đổi nền|Chỉ dừng âm thanh
Vì sao cần đặt điều kiện đúng trong chương trình?|Để chương trình chọn hành động phù hợp|Để màn hình lớn hơn|Để chuột nhanh hơn|Để tăng dung lượng
Khi rẽ nhánh cho kết quả sai, em nên kiểm tra gì?|Biểu thức điều kiện và các lệnh trong từng nhánh|Màu vỏ máy|Tên ổ điện|Số phím
"""),
"14": extras("""
Trong Scratch, lệnh 'hỏi ... và đợi' lưu điều người dùng nhập vào đâu?|Biến trả lời|Biến điểm luôn|Hình nền|Tên tệp
Một biến có thể thay đổi khi nào?|Khi chương trình gán hoặc cập nhật giá trị|Chỉ khi tắt máy|Chỉ khi đổi chuột|Không bao giờ
Muốn tạo biến mới có tên tự đặt trong Scratch, em chọn gì?|Tạo một biến|Đổi hình nền|In màn hình|Xóa sân khấu
Trước khi cộng điểm trong trò chơi, em thường đặt điểm ban đầu bằng gì?|0|100 luôn|Không cần giá trị|Tên nhân vật
Nếu biến số_lần đang là 4 và tăng 1, nó thành bao nhiêu?|5|3|4|1
Nếu muốn hiển thị điểm hiện tại, chương trình cần đọc gì?|Giá trị biến điểm|Màu sân khấu|Tên loa|Tên máy in
"""),
"15": extras("""
Nếu biến Cạnh lưu độ dài cạnh hình vuông, biểu thức tính chu vi là gì?|4 × Cạnh|4 + Cạnh|4 - Cạnh|4 / Cạnh
Biểu thức 3 × 4 có kết quả gì?|12|7|1|34
Nếu điểm bằng 5, biểu thức 'điểm = 5' là gì?|Đúng|Sai|10|0
Biểu thức '7 < 3' cho kết quả gì?|Sai|Đúng|7|3
Trong lệnh rẽ nhánh, biểu thức so sánh giúp gì?|Xác định điều kiện đúng hay sai|Vẽ nét tự do|Đổi tên máy|In giấy
Nếu biến x = 2, biểu thức x + 3 bằng bao nhiêu?|5|2|3|6
"""),
"16": extras("""
Kịch bản có thể giúp người lập trình làm gì?|Lên kế hoạch cho các hành động trước khi ghép lệnh|Thay màn hình|Tăng âm lượng|Xóa nhân vật
Nếu kịch bản yêu cầu hai kết quả tùy điểm, em cần cấu trúc nào?|Rẽ nhánh|Chỉ tuần tự một nhánh|Chỉ đổi nền|Chỉ phát âm thanh
Nếu kịch bản yêu cầu làm lại một việc bốn lần, em dùng gì?|Lệnh lặp 4 lần|Chỉ một lệnh dừng|Chỉ đổi tên tệp|Chỉ mở trình duyệt
Khi chương trình không đúng kịch bản, em nên làm gì?|Tìm bước sai, sửa rồi thử lại|Bỏ kịch bản ngay|Giữ nguyên lỗi|Đổi bàn phím
Khi kịch bản có nhiều nhân vật, em cần làm gì trong Scratch?|Tạo và lập trình cho từng nhân vật phù hợp|Chỉ đổi tên máy|Xóa sân khấu|Chỉ tắt âm thanh
Để trình bày sản phẩm cho lớp, em nên gì?|Nêu mục tiêu, chạy thử và giải thích các bước chính|Chỉ đọc tên tệp|Không cho xem kết quả|Xóa mã lệnh
"""),
}


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
        q("Trong phần mềm mô phỏng Hệ Mặt Trời, em có thể tìm hiểu gì?", "Tên và đặc điểm các hành tinh", "Mật khẩu của bạn", "Số phím bàn phím", "Màu dây điện"),
        q("Muốn xem một hành tinh trong phần mềm, em thường làm gì?", "Chọn biểu tượng hành tinh đó", "Tắt màn hình", "Xóa phần mềm", "Rút chuột"),
        q("Máy tính có thể giúp em tìm hiểu thiên nhiên bằng cách nào?", "Quan sát hình ảnh và mô phỏng phù hợp", "Tự thay thế hoàn toàn quan sát thực tế", "Tạo ra hành tinh thật", "Làm cho mọi mô phỏng chính xác tuyệt đối"),
        q("Khi xem mô phỏng, vì sao cần đọc lời giải thích đi kèm?", "Để hiểu đúng điều đang quan sát", "Để tăng âm lượng", "Để đổi tên máy", "Để tắt bàn phím"),
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
        q("Khi nhóm muốn làm bài trình chiếu, bước đầu nên là gì?", "Chọn ý tưởng và lập kế hoạch", "Đổi chuột", "Xóa ảnh", "Tắt màn hình"),
        q("Máy tính hỗ trợ nhóm tạo sản phẩm nào trong bài học?", "Bài trình chiếu", "Cây thật", "Bàn gỗ thật", "Đồ ăn"),
        q("Khi phân công làm bài trình chiếu nhóm, em nên làm gì?", "Nhận phần việc rõ ràng và phối hợp với bạn", "Để một bạn làm tất cả", "Không trao đổi", "Xóa phần của bạn"),
        q("Nếu trang chiếu chưa thể hiện đúng ý, em nên làm gì?", "Chỉnh sửa nội dung hoặc hình ảnh rồi xem lại", "Giữ nguyên vì máy luôn đúng", "Xóa mọi tệp", "Tắt máy ngay"),
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
        q("Muốn chép một phần văn bản mà vẫn giữ bản gốc, em dùng thao tác nào?", "Sao chép rồi dán", "Cắt rồi dán", "Xóa rồi dán", "Đóng tệp"),
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
        q("Trong trò chơi rô-bốt, chỉ dẫn 'quay trái 90 độ' làm rô-bốt thay đổi gì?", "Hướng đi", "Màu áo", "Tên trò chơi", "Số người chơi"),
        q("Trong Scratch, nhân vật thực hiện hành động dựa trên gì?", "Các câu lệnh trong chương trình", "Màu vỏ máy", "Tên bàn phím", "Âm lượng loa"),
        q("Muốn dừng chương trình Scratch đang chạy, em dùng nút nào?", "Nút dừng", "Nút cờ xanh", "Nút âm lượng", "Nút in"),
        q("Để thoát phần mềm sau khi chơi xong, em nên làm gì?", "Dùng lệnh đóng hoặc thoát ứng dụng", "Rút dây điện ngay", "Xóa mọi tệp", "Đập nút nguồn"),
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
        q("Muốn giữ nguyên đoạn gốc và có thêm bản ở vị trí khác, em dùng gì?", "Sao chép rồi dán", "Cắt rồi dán", "Xóa rồi dán", "Đóng tệp"),
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
    additional = {3: EXTRA3, 4: EXTRA4, 5: EXTRA5}[grade]
    more = {3: MORE3, 4: MORE4, 5: MORE5}[grade]
    for number, title, questions in rows:
        lesson_id = f"lop-{grade}-bai-{number.lower()}"
        items = []
        all_questions = questions + additional[number] + more[number]
        assert len(all_questions) == 20, (lesson_id, len(all_questions))
        if (grade, number) in DEEP:
            all_questions[-1] = DEEP[(grade, number)]
        for i, row in enumerate(all_questions):
            prompt, correct, *remaining = row
            wrong = remaining[:3]
            explanation = remaining[3] if len(remaining) == 4 else correct + "."
            assert len(wrong) == 3 and len({correct, *wrong}) == 4, (lesson_id, i)
            choices = [correct, *wrong]
            shift = i % 4
            choices = choices[shift:] + choices[:shift]
            items.append({"question": prompt, "options": choices, "correctIndex": choices.index(correct), "explanation": explanation})
        payload = {"id": lesson_id, "subjectBadge": f"TIN HỌC LỚP {grade}", "lessonTitle": f"Bài {number}. {title}", "gameTitle": f"CHINH PHỤC TIN HỌC LỚP {grade}", "pointsPerQuestion": 0.5, "timeLimitSeconds": 900, "questions": items}
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
    review_path = ROOT / "lop-4-on-tap-may-tinh.json"
    review = json.loads(review_path.read_text(encoding="utf-8"))
    if len(review["questions"]) == 5:
        additional_review = extras("""
Khi dùng máy tính trong thời gian dài, em nên làm gì?|Nghỉ mắt và vận động nhẹ|Nhìn sát màn hình hơn|Tăng độ sáng tối đa|Không cần nghỉ
Nếu thấy dây điện máy tính bị hở, em nên làm gì?|Không chạm vào và báo người lớn|Tự nối bằng tay|Đổ nước vào|Tiếp tục dùng
Để bảo vệ thông tin cá nhân, em nên làm gì?|Giữ kín mật khẩu|Dán mật khẩu lên màn hình|Gửi mật khẩu cho bạn|Nhập vào trang lạ
Khi trang web yêu cầu tải tệp không rõ nguồn, em nên làm gì?|Hỏi người lớn trước khi tải|Tải ngay|Tắt phần mềm bảo vệ|Chia sẻ cho cả lớp
Trước khi rời máy tính dùng chung, em nên làm gì?|Lưu công việc và đăng xuất tài khoản|Để nguyên tài khoản mở|Rút dây bất kì|Xóa tệp của bạn
""")
        for i, (prompt, correct, *wrong) in enumerate(additional_review, start=5):
            choices = [correct, *wrong]
            shift = i % 4
            choices = choices[shift:] + choices[:shift]
            review["questions"].append({"question": prompt, "options": choices, "correctIndex": choices.index(correct), "explanation": correct + "."})
        review["pointsPerQuestion"] = 1
        review["timeLimitSeconds"] = 600
        review_path.write_text(json.dumps(review, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for lesson_id, new_questions in LEGACY.items():
        lesson_path = ROOT / f"{lesson_id}.json"
        lesson = json.loads(lesson_path.read_text(encoding="utf-8"))
        if len(lesson["questions"]) == 10:
            for i, (prompt, correct, *wrong) in enumerate(new_questions, start=10):
                assert len(wrong) == 3 and len({correct, *wrong}) == 4, (lesson_id, i)
                choices = [correct, *wrong]
                shift = i % 4
                choices = choices[shift:] + choices[:shift]
                lesson["questions"].append({"question": prompt, "options": choices, "correctIndex": choices.index(correct), "explanation": correct + "."})
            lesson["pointsPerQuestion"] = 0.5
            lesson["timeLimitSeconds"] = 900
            lesson_path.write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        assert len(lesson["questions"]) == 20, (lesson_id, len(lesson["questions"]))
    lesson_path = ROOT / "lop-4-bai-6.json"
    lesson = json.loads(lesson_path.read_text(encoding="utf-8"))
    prompt, correct, *remaining = DEEP[(4, "6")]
    wrong, explanation = remaining[:3], remaining[3]
    choices = [correct, *wrong]
    shift = 19 % 4
    choices = choices[shift:] + choices[:shift]
    lesson["questions"][-1] = {"question": prompt, "options": choices, "correctIndex": choices.index(correct), "explanation": explanation}
    lesson["timeLimitSeconds"] = 900
    lesson_path.write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
