"""Additional original practice questions for the 20-question lesson bank.

Each line has five fields separated by |: prompt, correct option, three wrong options.
"""


def rows(block):
    parsed = [tuple(cell.strip() for cell in line.split("|")) for line in block.strip().splitlines()]
    assert all(len(row) == 5 for row in parsed)
    return parsed


GRADE3 = {
"2": rows("""
Em nhìn thấy biển báo thư viện rồi đi nhẹ, bước suy nghĩ nằm giữa việc nhìn và đi là gì?|Xử lí thông tin|In thông tin|Xóa thông tin|Tắt thông tin
Khi máy tính hiển thị kết quả phép tính, màn hình đóng vai trò gì?|Đưa thông tin ra|Nhập thông tin vào|Tạo điện|Lưu mật khẩu
Khi em nhấn phím để đưa chữ vào máy, bàn phím đóng vai trò gì?|Đưa thông tin vào|Đưa âm thanh ra|In thông tin|Kết nối điện
Thông tin đầu vào của việc chọn áo mưa có thể là gì?|Dự báo trời mưa|Màu bàn học|Tên ổ đĩa|Số phím
Quyết định nào hợp lí khi nghe cô nhắc giờ vào lớp?|Đi vào lớp|Tiếp tục chơi xa trường|Tắt đèn lớp|Giấu sách
Máy tính có thể xử lí các số để tạo kết quả nào?|Kết quả phép tính|Mùi hoa|Vị thức ăn|Độ ấm tay
Khi nghe một câu hỏi, em cần làm gì trước khi trả lời?|Hiểu và suy nghĩ về câu hỏi|Nói ngẫu nhiên|Bịt tai|Xóa vở
Thông tin từ mắt và tai có thể giúp em làm gì?|Đưa ra quyết định phù hợp|Tự tạo máy tính|Tự thay loa|Tự in sách
Nếu thông tin nhận được chưa rõ, em nên làm gì?|Hỏi lại hoặc quan sát thêm|Đoán chắc chắn|Bỏ qua mọi thứ|Trả lời ngay bất kì
Sơ đồ 'nhận thông tin → xử lí → quyết định' mô tả điều gì?|Cách con người dùng thông tin|Cách sơn máy tính|Cách thay dây mạng|Cách in giấy
"""),
"3": rows("""
Trong máy tính để bàn, thiết bị nào thường đặt trên bàn và hiển thị bài học?|Màn hình|Thân máy|Chuột|Bàn phím
Em muốn nghe bài hát trên máy, thiết bị đầu ra nào cần hoạt động?|Loa hoặc tai nghe|Bàn phím|Chuột|Máy quét
Muốn nhập một câu bằng chữ, em thường sử dụng gì?|Bàn phím|Máy in|Loa|Màn hình thường
Máy tính bảng thường nhận thao tác của em qua đâu?|Màn hình cảm ứng|Máy in|Ổ cắm|Loa
Để chọn nút trên màn hình máy tính để bàn, em thường điều khiển gì?|Con trỏ chuột|Dây nguồn|Loa|Máy in
Nếu màn hình tắt còn thân máy bật, em có nhìn thấy hình ảnh máy tạo ra không?|Không|Có luôn|Chỉ cần loa|Chỉ cần bàn phím
Thiết bị nào có thể in bài viết em đã lưu?|Máy in|Micro|Chuột|Bàn phím
Thân máy của máy tính để bàn có vai trò gì?|Chứa bộ phận xử lí và lưu trữ chính|Chỉ phát tiếng|Chỉ nhập chữ|Chỉ in ảnh
Tai nghe đưa thông tin dạng nào tới em?|Âm thanh|Hình ảnh|Mùi hương|Vị ngọt
Máy quét giúp đưa loại thông tin nào từ giấy vào máy?|Hình ảnh tài liệu|Âm thanh loa|Nhiệt độ phòng|Mùi giấy
"""),
"4": rows("""
Khi mắt cách màn hình quá gần, em nên làm gì?|Ngồi lùi ra khoảng cách phù hợp|Cúi sát hơn|Tăng sáng|Nhắm một mắt
Nếu chân không chạm sàn khi ngồi học máy, em nên làm gì?|Điều chỉnh ghế hoặc dùng chỗ kê chân phù hợp|Vắt chân lên bàn|Quỳ trên ghế|Đứng sát màn hình
Tư thế nào giúp giữ cổ và vai thoải mái?|Đầu thẳng, vai thả lỏng|Cúi gập cổ|Nghiêng hẳn một bên|Gồng vai liên tục
Khi cần tắt máy sau giờ học, em chọn gì?|Lệnh tắt máy đúng quy trình|Rút phích điện ngay|Đóng nắp màn hình bằng lực|Xóa tệp hệ thống
Vì sao không để nước gần bàn phím và ổ điện?|Có thể làm hỏng thiết bị và gây nguy hiểm điện|Làm chữ nhỏ hơn|Làm chuột chậm hơn|Làm trang web mất màu
Nếu ánh sáng chiếu thẳng gây chói màn hình, em nên làm gì?|Điều chỉnh vị trí màn hình hoặc ánh sáng|Nhìn sát hơn|Tăng sáng tối đa|Bỏ qua
Sau một thời gian sử dụng, em nên nhìn đâu để mắt nghỉ?|Nhìn xa khỏi màn hình|Nhìn sát vào chữ nhỏ|Nhìn đèn sáng|Nhìn liên tục màn hình
Khi tay đang ướt, em có nên chạm ổ cắm máy tính không?|Không|Có|Chỉ khi vội|Chỉ lúc chơi
Nếu giáo viên đang bảo trì máy, em nên làm gì?|Chờ hướng dẫn trước khi dùng|Tự mở nắp máy|Bật tất cả công tắc|Rút mọi dây
Ngồi đúng tư thế có lợi ích nào?|Giảm mỏi mắt và cơ thể|Làm mạng nhanh hơn|Tăng dung lượng máy|Thay được phần mềm
"""),
"5": rows("""
Trên bàn phím, phím có gờ F giúp đặt ngón nào?|Ngón trỏ trái|Ngón cái trái|Ngón út phải|Ngón giữa phải
Phím có gờ J giúp đặt ngón nào?|Ngón trỏ phải|Ngón cái phải|Ngón út trái|Ngón giữa trái
Hàng phím số nằm ở đâu trên bàn phím thông thường?|Phía trên hàng phím chữ|Dưới phím cách|Bên trong chuột|Trên màn hình
Phím Enter có thể dùng để làm gì khi soạn văn bản?|Bắt đầu dòng hoặc đoạn mới|Tăng âm lượng|Tắt máy|Xóa toàn bộ tệp
Khi gõ sai kí tự vừa nhập, phím nào thường hữu ích?|Backspace|Caps Lock|Shift|Space
Để có một dấu cách giữa hai từ, em nhấn phím nào?|Space|Enter|Backspace|Esc
Khi dùng hai tay gõ, các ngón nên di chuyển thế nào?|Từ vị trí cơ sở đến phím cần gõ rồi trở lại|Một ngón làm tất cả|Tất cả cùng bấm một phím|Chỉ dùng tay trái
Nếu muốn gõ chữ hoa tạm thời, em giữ phím nào cùng phím chữ?|Shift|Enter|Space|Tab
Phím Caps Lock đang bật ảnh hưởng chủ yếu gì khi gõ chữ cái?|Chữ cái được viết hoa|Tất cả dấu cách biến mất|Máy tự tắt|Con trỏ dừng
Khi luyện gõ, vì sao không nên đập phím thật mạnh?|Dễ mỏi tay và hại bàn phím|Gõ sai thành đúng|Máy tự học|Chữ đổi màu
"""),
"6": rows("""
Muốn xem một trang web học tập, máy thường cần kết nối gì?|Internet|Máy in|Thẻ nhớ trống|Loa ngoài
Khi trình duyệt mở, em nhập địa chỉ website vào đâu?|Thanh địa chỉ|Ô âm lượng|Thùng rác|Tên tệp
Liên kết trên trang web có thể đưa em tới đâu?|Trang hoặc nội dung khác|Ổ điện|Bàn phím khác|Máy in khác
Nếu video học tập phát quá nhanh, em nên làm gì?|Tạm dừng hoặc xem lại|Xóa trình duyệt|Rút mạng|Tắt loa luôn
Khi gặp trang hỏi địa chỉ nhà, em nên làm gì?|Hỏi người lớn trước, không tự cung cấp|Nhập ngay|Đăng lên nhóm|Gửi cho người lạ
Nội dung Internet nào có thể hỗ trợ bài học?|Hình ảnh và video phù hợp|Mọi quảng cáo lạ|Mật khẩu người khác|Tệp không rõ nguồn
Nếu thấy thông tin kỳ lạ trên web, cách nào hợp lí?|Kiểm tra với thầy cô hoặc nguồn đáng tin|Tin ngay|Chia sẻ khắp nơi|Xóa mọi dữ liệu máy
Trình duyệt web có chức năng nào?|Hiển thị và điều hướng trang web|Tạo điện|Thay chuột hỏng|In giấy không cần máy in
Để trở lại trang trước, em thường chọn gì?|Nút Quay lại|Nút Xóa tệp|Nút Nguồn|Nút In
Vì sao cần dùng Internet có hướng dẫn ở lứa tuổi tiểu học?|Để chọn nội dung phù hợp và tránh rủi ro|Vì mọi trang đều giống nhau|Vì không có gì cần kiểm tra|Vì máy luôn tự bảo vệ
"""),
"7": rows("""
Trong tủ sách, em muốn tìm truyện nhanh thì nên làm gì?|Xếp truyện cùng một khu vực có nhãn|Rải truyện nhiều nơi|Để lẫn đồ chơi|Đổi chỗ mỗi ngày
Nếu ảnh ngày hội trường nằm lẫn với bài tập, em nên làm gì?|Chuyển vào thư mục ảnh phù hợp|Xóa mọi ảnh|Đổi tên tất cả là 'a'|Để nguyên không nhớ
Tiêu chí sắp xếp nào giúp tìm đồ học tập?|Theo môn hoặc loại đồ|Theo ý ngẫu nhiên mỗi lần|Theo tiếng loa|Theo màu màn hình
Nhãn trên hộp đồ dùng có tác dụng gì?|Giúp nhận biết đồ bên trong|Làm hộp tự mở|Tạo thêm đồ dùng|Thay khóa hộp
Tên thư mục 'Bài vẽ tháng 9' cho biết gì?|Loại nội dung và thời điểm|Mật khẩu|Tên thiết bị|Tốc độ mạng
Vì sao không nên đặt nhiều tệp cùng tên khó hiểu?|Khó phân biệt và tìm lại|Tăng số phím|Loa nhỏ đi|Màn hình tối đi
Khi sắp xếp bài học theo lớp, thư mục nào hợp lí?|Lớp 3 / Toán|Tệp / Tệp / Tệp|Mới / Mới|Ngẫu nhiên / abc
Nếu đồ vật đã có nhóm riêng, khi dùng xong em nên làm gì?|Đặt lại đúng nhóm|Để ở nơi bất kì|Vứt đi|Đổi tên nhóm
Sắp xếp trước khi tìm có lợi ích nào?|Tiết kiệm thời gian tìm kiếm|Thay dung lượng máy|Tạo mật khẩu|Đổi giao diện
Một cách kiểm tra hệ thống sắp xếp có tốt không là gì?|Thử tìm một món cần dùng|Chỉ đếm số ngăn|Chỉ nhìn màu hộp|Tắt máy
"""),
"8": rows("""
Trong sơ đồ cây, đường nối giữa hai ô thể hiện gì?|Quan hệ giữa nhóm lớn và nhóm con|Dây điện thật|Tốc độ mạng|Âm thanh
Nếu thư mục Học tập có Toán và Tiếng Việt, hai thư mục đó là gì?|Hai thư mục con của Học tập|Hai màn hình|Hai phím|Hai máy in
Một tệp ảnh có thể nằm trong thư mục nào hợp lí?|Ảnh gia đình|Phần mềm hệ thống bắt buộc|Ổ điện|Loa
Muốn xem tệp trong nhánh Toán, em cần làm gì?|Mở nhánh hoặc thư mục Toán|Mở loa|Đổi chuột|In sơ đồ
Nếu nhánh 2026 nằm trong nhánh Ảnh, thứ tự từ ngoài vào là gì?|Ảnh rồi 2026|2026 rồi Ảnh luôn|Loa rồi Ảnh|Bàn phím rồi 2026
Sơ đồ cây giúp thấy một nhóm có thể chia tiếp thành gì?|Các nhóm nhỏ hơn|Chỉ số trang|Chỉ màu sắc|Chỉ âm thanh
Trong máy tính, tệp thường được lưu ở đâu?|Trong một thư mục hoặc vị trí lưu trữ|Trong nút nguồn|Trên loa|Trên vỏ chuột
Tên nhánh nào rõ nhất để chứa hình chụp lớp?|Ảnh lớp 3A|Mới|Tệp|Không tên
Thư mục mẹ của Toán nếu Toán nằm trong Học tập là gì?|Học tập|Toán|Máy tính|Bàn phím
Vì sao cây thư mục hữu ích khi có nhiều tệp?|Giúp quản lí tệp theo cấp bậc|Giúp tệp tự đúng|Thay ổ cứng|Tăng âm lượng
"""),
"9": rows("""
Muốn tạo thư mục chứa bài tập, bước đầu tiên là gì?|Mở nơi muốn tạo thư mục|Xóa ổ đĩa|Tắt máy|Đổi bàn phím
Khi đặt tên tệp bài văn, tên nào dễ nhận biết?|Bài văn tả trường em|Mới|123|a
Trước khi di chuyển tệp, em nên xác định gì?|Tệp cần chuyển và thư mục đích|Màu màn hình|Âm lượng|Giá chuột
Nếu tệp không xuất hiện trong thư mục đang mở, em nên làm gì?|Kiểm tra lại đường dẫn hoặc thư mục lưu|Xóa mọi thư mục|Rút điện|Đổi màn hình
Đổi tên một thư mục có xóa các tệp bên trong không?|Không, nếu chỉ đổi tên đúng cách|Có luôn|Chỉ khi tên dài|Chỉ khi có ảnh
Nếu một thư mục đã có tên Toán, em có thể tạo thư mục con nào?|Bài tập tuần 1|Loa|Bàn phím|Ổ điện
Muốn xem nội dung của tệp, em thường làm gì?|Mở tệp bằng ứng dụng phù hợp|Chỉ đổi tên tệp|Rút chuột|Tắt máy
Khi xóa nhầm tệp, em nên báo ai trong giờ học?|Giáo viên|Người lạ trên mạng|Không ai|Máy in
Tệp có phần mở rộng .png thường là loại nào?|Tệp hình ảnh|Tệp âm thanh|Thư mục|Dây mạng
Vì sao cần lưu tệp vào nơi nhớ được?|Để dễ mở lại khi cần|Để máy không cần điện|Để tăng số phím|Để loa to
"""),
"10": rows("""
Khi tạo một tệp bài tập mới, thao tác nào giúp giữ nó để hôm sau mở lại?|Lưu tệp|Chỉ đóng cửa sổ|Tắt màn hình|Xóa thư mục
Nếu mật khẩu quá dễ đoán, điều gì có thể xảy ra?|Người khác dễ vào tài khoản|Máy tự sáng hơn|Loa tự to|Bàn phím đổi màu
Khi dùng máy công cộng, đăng xuất giúp gì?|Ngăn người sau dùng tài khoản của em|Xóa Internet|Tăng dung lượng|Tắt điện
Bản sao lưu của bài quan trọng có tác dụng gì?|Giúp khôi phục nếu bản chính bị mất|Làm bài tự đúng|Thay màn hình|Thay mật khẩu
Em có nên đưa mật khẩu cho người tự nhận là bạn trên mạng không?|Không|Có luôn|Chỉ khi họ hứa quà|Chỉ khi họ gửi ảnh
Nếu có thông báo tệp lạ cần cài gấp, em nên làm gì?|Hỏi người lớn đáng tin trước khi mở|Cài ngay|Tắt phần mềm bảo vệ|Chia sẻ cho bạn
Khi sao chép một tệp sang USB, tệp gốc còn ở máy không?|Có, nếu thao tác là sao chép|Không bao giờ|Chỉ khi máy in bật|Chỉ khi loa bật
Thông tin cá nhân nào cần giữ kín?|Mật khẩu tài khoản|Tên môn học|Tên bài Tin học|Tên loài cây
Để không mất nội dung đang làm, em nên lưu khi nào?|Định kì trong quá trình làm|Chỉ khi mất điện|Không cần lưu|Sau khi xóa tệp
Nếu thấy bạn định xóa bài của người khác, em nên làm gì?|Nhắc bạn dừng và báo giáo viên|Cùng xóa|Giấu việc đó|Đổi tên máy
"""),
"11": rows("""
Một bài trình chiếu dùng để làm gì?|Trình bày thông tin theo các trang|Thay dây mạng|Tạo điện|Sửa chuột hỏng
Trang chiếu có tiêu đề 'Các loài cây' nên chứa gì?|Thông tin và hình ảnh về cây|Mật khẩu|Tệp hệ thống|Giá bàn phím
Muốn người xem đọc chữ dễ hơn, em chọn cỡ chữ thế nào?|Đủ lớn và rõ|Càng nhỏ càng tốt|Trùng màu nền|Không cần chữ
Một hình minh họa nên đặt thế nào?|Không che nội dung quan trọng|Che hết chữ|Nằm ngoài trang|Luôn phủ kín nền
Để thêm ảnh vào trang chiếu, em chọn chức năng nào?|Chèn hình ảnh|Xóa bài|Tắt trình chiếu|Đổi mật khẩu
Trước khi trình chiếu, em nên kiểm tra gì?|Thứ tự trang và lỗi nội dung|Giá máy|Số phím|Màu dây điện
Nếu trang có quá nhiều chữ, em nên làm gì?|Rút gọn ý chính hoặc chia trang|Thu nhỏ chữ tối đa|Che chữ bằng ảnh|Bỏ tiêu đề
Trang cuối có thể dùng để làm gì?|Kết thúc hoặc cảm ơn người xem|Cất chuột|Đổi nguồn điện|Xóa bài
Khi lưu tệp trình chiếu, tên nào hợp lí?|Bài giới thiệu quê em|Mới|a|123
Khi nói trước lớp, trang chiếu giúp em điều gì?|Nhắc các ý và minh họa|Thay hoàn toàn lời nói|Tự trả lời mọi câu hỏi|Tự in bài
"""),
"12": rows("""
Trong mô phỏng Hệ Mặt Trời, Mặt Trời là gì?|Một ngôi sao|Một hành tinh|Một vệ tinh của Trái Đất|Một chiếc máy
Trái Đất thuộc nhóm nào trong Hệ Mặt Trời?|Hành tinh|Ngôi sao|Dây cáp|Vệ tinh nhân tạo duy nhất
Mặt Trăng là vệ tinh tự nhiên của thiên thể nào?|Trái Đất|Mặt Trời|Sao Hỏa|Sao Mộc
Khi phần mềm cho xoay góc nhìn, em có thể làm gì?|Quan sát mô hình từ hướng khác|Đổi hành tinh thật|Tắt Internet toàn cầu|Xóa ngôi sao
Hình mô phỏng quỹ đạo giúp em thấy điều gì?|Đường chuyển động biểu diễn của thiên thể|Mật khẩu phần mềm|Tốc độ gõ phím|Giá máy
Nếu phần mềm hiện tên hành tinh khi nháy vào, thao tác nào giúp biết tên?|Nháy chọn hành tinh|Tắt màn hình|Rút chuột|Đóng ứng dụng
Khi mô phỏng chạy nhanh, em có thể làm gì để quan sát kĩ?|Tạm dừng hoặc giảm tốc nếu có chức năng|Xóa mô hình|Đổi tên máy|Tăng âm lượng
Vì sao cần phân biệt mô phỏng và vật thật?|Mô phỏng giúp học nhưng không phải vật thật|Mô phỏng luôn giống kích thước thật|Mô phỏng tạo ra thiên thể|Không có khác biệt nào
Muốn kể lại điều vừa học từ phần mềm, em nên dựa vào gì?|Điều đã quan sát và thông tin đi kèm|Màu bàn phím|Tên tệp bất kì|Mật khẩu
Khi chưa hiểu một chi tiết trong mô phỏng, em nên làm gì?|Xem hướng dẫn hoặc hỏi giáo viên|Đoán chắc chắn|Xóa phần mềm|Bỏ qua mọi thông tin
"""),
"13": rows("""
Nháy chuột trái một lần khác nháy đúp ở điểm nào?|Số lần nhấn thả nhanh|Màu chuột|Kích thước màn hình|Nguồn điện
Trong bài luyện chuột, muốn nhắm đúng mục tiêu, em cần điều khiển gì?|Con trỏ chuột|Loa|Ổ đĩa|Máy in
Khi kéo thả một hình, em thả nút chuột lúc nào?|Khi hình đến vị trí mong muốn|Ngay trước khi kéo|Sau khi tắt máy|Khi con trỏ biến mất
Nút chuột phải thường mở bảng gì?|Bảng chọn ngữ cảnh|Bảng điểm giấy|Bảng tính tự động|Bảng điện
Để cuộn xuống phần cuối trang, em có thể dùng gì?|Bánh xe chuột|Phím nguồn|Máy in|Micro
Phần mềm luyện chuột báo trượt mục tiêu, em nên làm gì?|Di chuyển chính xác hơn rồi thử lại|Đập chuột|Bỏ qua mãi|Tắt bàn phím
Khi con trỏ ra khỏi mục tiêu trước khi nháy, điều gì dễ xảy ra?|Chọn sai vị trí|Máy tự tắt|Tệp tự lưu|Loa ngừng
Muốn mở một thư mục bằng chuột, thao tác thường dùng là gì?|Nháy đúp vào biểu tượng|Lăn bánh xe liên tục|Chỉ cầm chuột|Nhấn nút nguồn
Khi luyện nháy đúp, hai lần nhấn nên thế nào?|Liên tiếp tương đối nhanh|Cách nhau nhiều phút|Giữ nút luôn|Dùng hai chuột
Cầm chuột nhẹ và đặt trên mặt phẳng giúp gì?|Điều khiển con trỏ chính xác hơn|Tăng dung lượng máy|Đổi hình nền|Thay bàn phím
"""),
"14": rows("""
Nếu vẽ ngôi nhà, bước nào nên làm trước khi tô màu?|Vẽ các nét chính|Cất bút|Xé giấy|Tắt đèn
Một công việc theo trình tự được mô tả bằng gì?|Các bước có thứ tự rõ ràng|Chỉ mục tiêu cuối|Các bước ngẫu nhiên|Chỉ tên dụng cụ
Nếu bước 2 cần kết quả của bước 1, em có thể đảo hai bước không?|Không nên|Luôn được|Chỉ khi nhanh|Chỉ khi có máy
Khi hướng dẫn bạn gấp giấy, em nên làm gì?|Nêu từng thao tác theo thứ tự|Chỉ đưa tờ giấy|Nói bước cuối trước|Bỏ bước gấp đầu
Để kiểm tra mô tả đã đủ chưa, em có thể làm gì?|Thử làm theo từng bước|Chỉ đếm chữ|Đổi tên bài|Xóa bước giữa
Một bước trong kế hoạch nên rõ đến mức nào?|Người thực hiện biết phải làm gì|Càng mơ hồ càng tốt|Không liên quan mục tiêu|Chỉ có một chữ bất kì
Trong việc tưới cây, bước nào nên sau khi chuẩn bị bình nước?|Mang bình đến cây và tưới|Cất bình trước|Uống hết nước|Xóa lịch
Nếu thiếu một bước cần thiết, em nên làm gì?|Bổ sung bước đúng chỗ|Bỏ luôn công việc|Đảo ngẫu nhiên|Chỉ đổi tên
Máy tính thực hiện chuỗi lệnh theo gì?|Thứ tự lệnh đã được chỉ dẫn|Màu vỏ|Giá thiết bị|Số loa
Vì sao việc lên kế hoạch từng bước hữu ích?|Giúp thực hiện công việc dễ và ít bỏ sót|Làm máy tự chạy|Thay mọi dụng cụ|Tạo điện
"""),
"15": rows("""
Trong câu 'Nếu hết giờ thì nộp bài', điều kiện là gì?|Hết giờ|Nộp bài|Quyển vở|Bàn học
Trong câu 'Nếu bút hết mực thì thay bút', hành động khi điều kiện đúng là gì?|Thay bút|Bút hết mực|Viết tiếp bằng bút hỏng|Đóng sách
Khi điều kiện sai, hành động gắn sau 'thì' có bắt buộc làm không?|Không|Có luôn|Chỉ khi mạng yếu|Chỉ khi có máy
Muốn biết có cần mang ô theo chỉ dẫn 'Nếu trời mưa thì mang ô', em cần kiểm tra gì?|Trời có mưa không|Ô màu gì|Tên lớp|Số phím
Chỉ dẫn nào là theo điều kiện?|Nếu vở đầy thì dùng vở mới|Mở sách rồi đọc|Đếm 1 đến 5|Gấp giấy theo ba bước
Nếu đèn tín hiệu đỏ, theo quy tắc giao thông em làm gì?|Dừng lại trước vạch dừng|Đi thật nhanh|Băng qua ngay|Đổi màu đèn
Nếu đất chưa khô, trong chỉ dẫn 'Nếu đất khô thì tưới' em làm gì?|Chưa tưới theo chỉ dẫn đó|Tưới bắt buộc|Thay cây ngay|Tắt đèn
Khi điều kiện thay đổi từ sai sang đúng, hành động có thể thế nào?|Được thực hiện theo chỉ dẫn|Luôn bị xóa|Không thay đổi trong mọi trường hợp|Tự in giấy
Một câu điều kiện gồm những phần cơ bản nào?|Điều kiện và việc cần làm khi điều kiện đúng|Chỉ tên người|Chỉ màu vật|Chỉ thời gian
Vì sao cần kiểm tra điều kiện trước khi hành động?|Để làm việc phù hợp tình huống|Để máy sáng hơn|Để tăng số bước|Để bỏ qua mọi chỉ dẫn
"""),
"16": rows("""
Trong kế hoạch làm bài trình chiếu, bước nào nên trước khi mở phần mềm?|Xác định chủ đề và nội dung|Xóa bài|In trang trắng|Đổi tên máy
Nếu nhóm muốn giới thiệu trường, ảnh nào phù hợp?|Ảnh sân trường được phép sử dụng|Ảnh không liên quan|Ảnh che toàn bộ chữ|Ảnh mờ không rõ
Một trang chiếu có thể chứa gì để minh họa ý?|Chữ và hình ảnh phù hợp|Chỉ dây điện|Chỉ tên chuột|Chỉ phím nguồn
Khi các bạn làm việc nhóm, vì sao cần phân công?|Để mỗi bạn biết nhiệm vụ và phối hợp|Để không ai làm|Để xóa phần của nhau|Để bỏ kế hoạch
Nếu chữ trên trang chiếu quá nhỏ, nhóm nên làm gì?|Tăng cỡ chữ phù hợp|Thu nhỏ thêm|Che bằng ảnh|Đổi loa
Trước khi trình bày, nhóm nên kiểm tra gì?|Các trang theo đúng thứ tự và nội dung rõ|Giá bàn phím|Màu dây nguồn|Tên ổ cắm
Nếu hình ảnh chưa liên quan chủ đề, nhóm nên làm gì?|Đổi sang hình phù hợp|Giữ nguyên|Thêm ảnh ngẫu nhiên|Xóa mọi chữ
Máy tính giúp nhóm sửa bài trình chiếu bằng cách nào?|Chỉnh chữ, hình và thứ tự trang|Tự quyết định mục tiêu|Tự thay lời nói|Tự nộp bài không cần người
Sau khi các bạn góp ý, nhóm nên làm gì?|Chỉnh sửa sản phẩm rồi xem lại|Bỏ qua mọi góp ý|Xóa tệp|Tắt máy
Muốn giữ sản phẩm để dùng sau, nhóm cần gì?|Lưu tệp ở nơi dễ tìm|Chỉ đóng phần mềm|Đổi chuột|In giấy trắng
"""),
}

GRADE4 = {
"1": rows("""
Màn hình là phần cứng vì sao?|Là thiết bị có thể nhìn và chạm được|Là một chương trình|Là trang web|Là tệp dữ liệu
Phần mềm nào giúp em trình bày các trang chiếu?|Phần mềm trình chiếu|Chuột|Màn hình|Máy in
Khi muốn nghe âm thanh từ chương trình, thiết bị phần cứng nào cần có?|Loa hoặc tai nghe|Máy in|Bàn phím|Máy quét
Nếu không có chương trình vẽ, máy có tự mở công cụ vẽ theo ý em không?|Không|Có luôn|Chỉ cần máy in|Chỉ cần loa
Phần mềm hệ điều hành có vai trò nào?|Giúp quản lí hoạt động máy tính|Thay dây nguồn|In ảnh không cần máy in|Tạo màn hình mới
Tệp văn bản em tạo có phải là phần cứng không?|Không, đó là dữ liệu|Có, vì có tên|Có, vì nằm trên màn hình|Có, vì mở được
Bàn phím và chuột giống nhau ở điểm nào?|Đều là thiết bị phần cứng đưa thao tác vào máy|Đều là phần mềm|Đều in ra giấy|Đều chỉ phát âm thanh
Khi máy tính bật nhưng ứng dụng chưa mở, em muốn soạn bài thì làm gì?|Mở phần mềm soạn thảo phù hợp|Chỉ tăng âm lượng|Chỉ cắm máy in|Chỉ đổi chuột
Trình duyệt web thuộc loại gì?|Phần mềm|Phần cứng|Dây cáp|Thiết bị lưu trữ giấy
Phần cứng và phần mềm phối hợp để làm gì?|Giúp máy tính thực hiện công việc|Tạo điện từ không khí|Thay con người mọi việc|Đảm bảo mọi thông tin đúng
"""),
"2": rows("""
Khi ngón trỏ trái đặt ở F, ngón trỏ phải nên đặt ở đâu?|J|A|Q|Z
Gõ văn bản ngắn đúng cách giúp rèn gì?|Sử dụng ngón tay đúng vị trí|Đập phím thật mạnh|Nhìn sát bàn phím|Chỉ dùng một ngón
Khi gõ một phím ở hàng dưới, ngón tay sau đó về đâu?|Hàng phím cơ sở|Trên chuột|Trên màn hình|Ngoài bàn
Vì sao nên giữ vai thả lỏng khi gõ?|Giảm mỏi và giữ tư thế thoải mái|Tăng âm lượng|Tự sửa lỗi gõ|Làm phím to hơn
Nếu chữ xuất hiện sai nhiều, em nên ưu tiên gì?|Độ chính xác trước khi tăng tốc|Gõ nhanh hơn|Bỏ qua lỗi|Đổi màu bàn phím
Phím Space được gõ bằng ngón nào khi gõ đúng cách?|Ngón cái|Ngón trỏ|Ngón út|Ngón giữa
Nếu phải gõ dấu tiếng Việt, em nên làm gì?|Sử dụng kiểu gõ đã được hướng dẫn|Nhấn ngẫu nhiên|Chỉ dùng phím số|Tắt phần mềm gõ
Khi mắt chỉ nhìn phím và không nhìn kết quả, dễ xảy ra gì?|Khó phát hiện lỗi trong văn bản|Máy tự sửa hết|Loa ngừng|Tệp tự xóa
Luyện gõ đều đặn có lợi ích nào?|Tăng tốc và độ chính xác theo thời gian|Không cần hiểu chữ|Tăng dung lượng máy|Tạo thêm phím
Khi tay bị mỏi, em nên làm gì?|Nghỉ ngắn và chỉnh tư thế|Gõ mạnh hơn|Gồng tay|Tiếp tục liên tục
"""),
"3": rows("""
Trang web nào thường có liên kết tới các mục khác?|Trang chủ của một website|Ổ cắm điện|Bàn phím|Loa
Khi chữ màu xanh có gạch chân và hoạt động khi nháy, đó có thể là gì?|Liên kết|Dây cáp|Tên máy in|Phím nguồn
Thông tin dạng video trên web kết hợp gì?|Hình chuyển động và có thể có âm thanh|Chỉ chữ in giấy|Chỉ mùi|Chỉ vị
Muốn xem phần đầu của trang dài, em có thể làm gì?|Cuộn lên|Rút mạng|Xóa trình duyệt|Đổi tên máy
Nếu nháy liên kết dẫn tới trang khác, em có thể quay về bằng gì?|Nút Quay lại của trình duyệt|Phím nguồn|Máy in|Ổ điện
Địa chỉ web thường xuất hiện ở đâu?|Thanh địa chỉ của trình duyệt|Trên loa|Trên bàn phím giấy|Trong nút nguồn
Hình minh họa trên trang web có vai trò gì?|Giúp hiểu nội dung khi phù hợp|Luôn chứng minh mọi chữ đúng|Thay địa chỉ web|Tạo mật khẩu
Khi trang web hiển thị quảng cáo lạ, em nên làm gì?|Không bấm tùy tiện|Bấm mọi quảng cáo|Nhập thông tin cá nhân|Tải mọi tệp
Vì sao cần xem cả chữ và hình trên trang?|Để hiểu đầy đủ nội dung được trình bày|Vì hình luôn đủ|Vì chữ luôn sai|Để tăng dung lượng
Một website có thể có bao nhiêu trang web?|Nhiều trang liên kết với nhau|Chỉ một trang bắt buộc|Không có trang nào|Đúng hai trang luôn
"""),
"4": rows("""
Nếu muốn tìm thông tin về lịch học của trường, từ khóa nào cụ thể?|lịch học Trường Tiểu học Quỳnh Lộc|lịch|trường|học
Kết quả tìm kiếm thường gồm gì?|Tiêu đề, đoạn mô tả và liên kết|Chỉ mật khẩu|Chỉ dây cáp|Chỉ tên bàn phím
Khi từ khóa gõ sai chính tả, kết quả có thể thế nào?|Kém phù hợp hoặc khó tìm|Luôn đúng nhất|Máy tự tắt|Không ảnh hưởng bao giờ
Nếu tìm 'cây' ra quá nhiều kết quả, em nên thêm gì?|Đặc điểm hoặc tên cây cụ thể|Mật khẩu|Tên chuột|Số phím
Sau khi mở một kết quả, em nên kiểm tra gì?|Nội dung và nguồn có phù hợp không|Màu máy in|Âm lượng loa|Giá màn hình
Thông tin trên trang chính thức của bảo tàng về giờ mở cửa thường đáng tin hơn gì?|Bình luận không rõ người viết|Thông báo chính thức khác|Bảng giờ trong sảnh bảo tàng|Hướng dẫn của nhân viên
Khi hai kết quả mâu thuẫn, em nên làm gì?|Đối chiếu thêm nguồn đáng tin|Chọn ngẫu nhiên|Chia sẻ cả hai như đúng|Chỉ xem hình
Vì sao không nên nhập thông tin cá nhân vào kết quả tìm kiếm lạ?|Có thể bị thu thập và sử dụng sai|Làm màn hình sáng|Làm chuột nặng|Làm loa nhỏ
Từ khóa tốt có đặc điểm gì?|Ngắn gọn nhưng đủ ý cần tìm|Càng mơ hồ càng tốt|Chỉ một chữ bất kì|Luôn là mật khẩu
Khi tìm được câu trả lời, em nên làm gì?|Ghi lại ý chính và nguồn tham khảo|Chép không đọc|Xóa trình duyệt|Đổi tên máy
"""),
"5": rows("""
Để tạo thư mục Bài tập trong Học tập, em nên mở đâu trước?|Thư mục Học tập|Thùng rác|Loa|Máy in
Nếu sao chép tệp ảnh sang thư mục khác, bản ở chỗ cũ thế nào?|Vẫn còn|Luôn bị xóa|Trở thành thư mục|Đổi thành âm thanh
Nếu cắt rồi dán tệp sang thư mục mới, mục đích là gì?|Di chuyển tệp|Tạo thêm bản sao ở hai nơi|In tệp|Đổi nội dung
Muốn chọn đúng tệp để xóa, em cần xem gì?|Tên và vị trí tệp|Chỉ màu nền|Số phím|Tên loa
Tệp có tên dễ hiểu giúp em điều gì?|Tìm và phân biệt nhanh|Máy tự sửa lỗi|Tăng dung lượng|Đổi kiểu chuột
Sau khi đổi tên một thư mục, tệp trong đó có tự biến thành tệp mới không?|Không|Có luôn|Chỉ khi tên dài|Chỉ khi có ảnh
Khi xóa thư mục chứa nhiều tệp, nguy cơ gì?|Mất cả các tệp bên trong|Chỉ đổi màu|Tăng âm lượng|Tạo bản sao
Nếu muốn giữ bản gốc và gửi bản khác cho bạn, thao tác nào phù hợp?|Sao chép|Di chuyển|Xóa|Đổi tên máy
Thư mục con khác tệp ở điểm nào?|Thư mục con có thể chứa tệp và thư mục khác|Thư mục con luôn là ảnh|Tệp luôn là dây cáp|Không có khác biệt
Khi dán tệp, em cần kiểm tra gì?|Đã mở đúng thư mục đích|Loa đang to|Màn hình sáng nhất|Chuột có màu gì
"""),
"7": rows("""
Muốn giới thiệu một chủ đề bằng các ý nối tiếp, em nên dùng gì?|Nhiều trang chiếu theo trình tự|Một trang đầy kín chữ|Chỉ ảnh nền|Chỉ âm thanh
Trang đầu của bài trình chiếu thường chứa gì?|Tên chủ đề và người trình bày|Mật khẩu|Đường dẫn hệ thống|Tên dây cáp
Nếu một trang chỉ có ảnh không liên quan, em nên làm gì?|Thay ảnh phù hợp|Giữ nguyên|Thêm hiệu ứng|Xóa tiêu đề
Muốn thêm trang để nói ý tiếp theo, em chọn gì?|Trang chiếu mới|Xóa bài|Tắt máy|Đổi tên tệp
Vì sao cần lưu bài trong khi làm?|Tránh mất nội dung đã tạo|Làm máy tự in|Tăng âm lượng|Đổi chuột
Khi bài có nhiều trang, thứ tự cần thế nào?|Phù hợp mạch trình bày|Ngẫu nhiên|Chỉ trang cuối trước|Không quan trọng
Muốn xem bài như lúc giới thiệu trước lớp, em chọn gì?|Trình chiếu|Xóa trang|Đổi nền máy|Đóng ứng dụng
Một tiêu đề tốt trên trang chiếu nên thế nào?|Nêu rõ ý chính của trang|Thật dài và khó đọc|Không liên quan|Trùng với mật khẩu
Nếu chữ quá nhỏ, em nên làm gì?|Tăng cỡ chữ hoặc giảm bớt nội dung|Thêm chữ nữa|Che bằng hình|Tắt màn hình
Khi lưu bài về lớp học, tên nào rõ nhất?|Giới thiệu lớp em|Mới|abc|1
"""),
"8": rows("""
Văn bản trên trang chiếu muốn nổi bật, em có thể đổi gì?|Màu, cỡ hoặc kiểu chữ|Dây nguồn|Tên chuột|Ổ điện
Khi chọn một đoạn và nhấn in đậm, điều gì đổi?|Kiểu hiển thị của đoạn chữ|Nội dung tự biến mất|Tên tệp|Số trang
Tiêu đề nên có cỡ chữ thế nào so với phần giải thích?|Thường lớn hơn|Luôn nhỏ hơn|Bằng 0|Không cần chữ
Chữ đen trên nền trắng có đặc điểm gì?|Tương phản rõ, dễ đọc|Luôn vô hình|Luôn sai chính tả|Tự tạo hiệu ứng
Để liệt kê ba ý ngắn, em có thể dùng gì?|Danh sách dấu đầu dòng|Chỉ một ảnh lớn|Chỉ lệnh tắt|Chỉ hiệu ứng
Nếu toàn bộ chữ đều in đậm, việc nhấn mạnh từng ý có thể thế nào?|Kém rõ hơn|Luôn rõ hơn|Máy tự sửa|Tệp bị xóa
Muốn đổi màu riêng tiêu đề, em cần chọn gì trước?|Phần chữ tiêu đề|Toàn bộ máy tính|Dây cáp|Loa
Vì sao không nên dùng quá nhiều màu chữ trong một trang?|Dễ rối mắt và khó tập trung|Làm Internet chậm|Làm máy hết pin ngay|Làm chuột hỏng
Khi chữ bị hình che, em nên làm gì?|Sắp lại vị trí chữ hoặc hình|Để nguyên|Thu nhỏ chữ hơn|Tắt loa
Sau khi định dạng, bước kiểm tra hữu ích là gì?|Trình chiếu thử để xem có dễ đọc không|Chỉ nhìn tên tệp|Rút điện|Xóa trang
"""),
"9": rows("""
Hiệu ứng chuyển trang dùng vào lúc nào?|Đổi từ trang chiếu này sang trang khác|Gõ một phím|Lưu tệp|Mở chuột
Nếu trang đổi quá nhanh khiến người xem chưa kịp đọc, em nên làm gì?|Điều chỉnh cách hoặc thời gian chuyển trang|Xóa toàn bộ nội dung|Tăng nhạc nền|Đổi bàn phím
Một bài trình chiếu nghiêm túc nên chọn hiệu ứng thế nào?|Đơn giản và phù hợp|Càng rối càng tốt|Mỗi chữ một hiệu ứng|Chỉ chọn dài nhất
Hiệu ứng có làm thay nội dung chữ trên trang không?|Không, nó điều khiển cách chuyển trang|Có, luôn sửa chữ|Có, luôn xóa chữ|Có, luôn in giấy
Để biết hiệu ứng nhìn ra sao, em làm gì?|Xem trước hoặc trình chiếu thử|Chỉ xem tên tệp|Rút chuột|Đổi ổ điện
Nếu một hiệu ứng không phù hợp, em có thể làm gì?|Chọn hiệu ứng khác hoặc bỏ hiệu ứng|Xóa máy|Đổi tên bạn|In trang trắng
Chuyển trang mượt giúp người xem điều gì?|Theo dõi mạch trình bày|Đọc chữ tự động|Tăng tốc máy|Bỏ qua nội dung
Vì sao không lạm dụng hiệu ứng?|Có thể làm người xem mất tập trung|Vì mọi hiệu ứng đều lỗi|Vì hiệu ứng xóa máy|Vì không lưu được
Nếu muốn cùng một kiểu chuyển cho các trang, em nên làm gì?|Áp dụng nhất quán cho các trang phù hợp|Chọn ngẫu nhiên từng trang|Xóa bớt nội dung|Đổi màn hình
Khi trang cần dừng để giải thích, em nên điều khiển gì?|Thời điểm chuyển sang trang tiếp theo|Tên tệp|Số phím|Màu chuột
"""),
"10": rows("""
Ứng dụng nào phù hợp để viết một lá thư bằng máy?|Phần mềm soạn thảo văn bản|Phần mềm chỉ phát nhạc|Trình chơi game|Máy tính bỏ túi
Khi mở trang soạn thảo trắng, chữ em gõ xuất hiện ở đâu?|Vị trí con trỏ soạn thảo|Trong loa|Trên vỏ máy|Trong máy in ngay
Phím Space giúp gì khi viết câu?|Tạo khoảng trắng giữa các từ|Xóa câu|Đổi phông chữ|Tắt máy
Nhấn Enter trong văn bản thường làm gì?|Xuống dòng hoặc bắt đầu đoạn mới|In trang|Đổi màu màn hình|Xóa tệp
Vì sao cần đặt tên tệp khi lưu?|Dễ nhận biết và mở lại|Máy tự viết nội dung|Tăng số phím|Đổi chuột
Nếu chưa lưu mà mất điện, điều gì có thể xảy ra?|Mất nội dung chưa được lưu|Tệp luôn tự đầy đủ|Máy tự in|Bàn phím đổi màu
Muốn mở lại văn bản hôm qua, em cần tìm gì?|Tệp đã lưu|Dây cáp|Nút âm lượng|Ổ cắm
Để viết tiếng Việt có dấu, em cần gì?|Công cụ gõ tiếng Việt được thiết lập phù hợp|Chỉ phím số|Chỉ chuột|Chỉ máy in
Một văn bản gửi cô giáo nên được kiểm tra gì trước khi nộp?|Nội dung và chính tả|Màu chuột|Tên ổ điện|Giá máy
Sau khi chỉnh sửa, em cần làm gì để giữ bản mới?|Lưu lại|Rút mạng|Đóng không lưu|Xóa tệp
"""),
"11": rows("""
Muốn chọn một đoạn văn, em có thể dùng gì?|Kéo chuột qua đoạn cần chọn|Chỉ tăng âm lượng|Chỉ đổi nền|Chỉ nhấn phím nguồn
Sao chép và dán làm gì với đoạn gốc?|Giữ đoạn gốc và tạo bản ở chỗ khác|Xóa đoạn gốc|Đổi nội dung gốc|Tắt ứng dụng
Cắt rồi dán làm gì với đoạn văn?|Chuyển đoạn tới vị trí mới|Tạo bản sao tại chỗ cũ|In văn bản|Đổi tên tệp
Nếu dán sai vị trí, em nên làm gì?|Hoàn tác rồi chọn đúng vị trí|Xóa cả máy|Giữ nguyên|Đổi bàn phím
Muốn chèn hình ảnh vào bài viết, em chọn chức năng nào?|Chèn hình ảnh|Tắt máy|Xóa văn bản|Đổi mật khẩu
Sau khi thêm ảnh, em cần kiểm tra gì?|Ảnh không che chữ và phù hợp nội dung|Màu dây nguồn|Tên bàn phím|Âm lượng loa
Khi muốn thay một từ sai, em cần xác định gì?|Vị trí từ đó|Giá máy|Số tệp|Tên loa
Nếu vừa xóa nhầm, chức năng nào giúp quay lại bước trước?|Hoàn tác|Lưu đè|Đóng máy|In ngay
Vì sao nên lưu sau khi chỉnh sửa?|Giữ nội dung mới|Xóa nội dung cũ bắt buộc|Tăng số trang|Đổi kiểu chuột
Trước khi đưa văn bản cho bạn, em nên làm gì?|Đọc lại và sửa lỗi còn sót|Xóa hết ảnh|Rút điện|Đổi tên ứng dụng
"""),
"12A": rows("""
Video về lễ hội có thể giúp em biết thêm gì?|Hình ảnh, âm thanh và hoạt động văn hóa|Mật khẩu người xem|Tên bàn phím|Giá dây điện
Muốn quan sát lại một phong tục vừa xuất hiện trong video, em làm gì?|Tua lại hoặc phát lại đoạn đó|Xóa tệp|Tắt màn hình|Đổi máy in
Nếu nghe lời thuyết minh chưa rõ, em có thể làm gì?|Tạm dừng, nghe lại với âm lượng phù hợp|Tăng tối đa không cần thiết|Xóa video|Đóng ứng dụng
Một sản phẩm đa phương tiện có thể kết hợp gì?|Chữ, hình, âm thanh và video|Chỉ dây cáp|Chỉ giấy in|Chỉ ổ điện
Sau khi xem video lịch sử, em nên kể lại gì?|Những thông tin mới quan sát và hiểu được|Chỉ màu giao diện|Chỉ tên tệp|Chỉ số phím
Vì sao video hữu ích khi tìm hiểu văn hóa?|Cho thấy hình và âm thanh sinh động|Luôn đúng trong mọi trường hợp|Thay mọi nguồn khác|Tự tạo hiện vật thật
Nếu video quá dài, em có thể dùng thanh thời gian để làm gì?|Chuyển đến đoạn muốn xem|Đổi tên máy|Tăng dung lượng|Xóa hình
Trước khi xem video thầy cô cung cấp, em nên xác định gì?|Chủ đề và điều muốn tìm hiểu|Mật khẩu lớp|Giá tai nghe|Tên ổ cắm
Khi video có phụ đề, phụ đề giúp gì?|Hỗ trợ hiểu lời nói và nội dung|Tự sửa hình ảnh|Thay âm thanh hoàn toàn luôn|Tạo điện
Nếu kể lại điều học được, em nên dựa vào gì?|Nội dung thực sự đã xem và ghi nhớ|Ảnh bìa ngẫu nhiên|Quảng cáo bên cạnh|Màu nút phát
"""),
"12B": rows("""
Phần mềm luyện gõ giúp theo dõi gì?|Tốc độ và độ chính xác|Độ cao ghế tự động|Giá bàn phím|Số trang web
Khi bài luyện yêu cầu phím A, em nên dùng ngón nào theo hàng cơ sở?|Ngón út trái|Ngón trỏ phải|Ngón cái|Ngón giữa phải
Khi bài luyện yêu cầu phím L, em nên dùng ngón nào theo hàng cơ sở?|Ngón áp út phải|Ngón trỏ trái|Ngón cái|Ngón út trái
Nếu phần mềm báo sai nhiều ở một hàng phím, em nên làm gì?|Luyện lại hàng phím đó chậm và đúng|Bỏ qua mọi lỗi|Gõ nhanh hơn|Đập phím
Tư thế nào phù hợp khi luyện gõ lâu?|Ngồi thẳng và nghỉ ngắn khi cần|Cúi sát|Gồng vai|Nằm gõ
Vì sao không nên nhìn bàn phím liên tục?|Khó rèn thói quen gõ bằng vị trí ngón|Máy tự tắt|Loa ngừng|Tệp mất
Phím F và J có gờ giúp gì?|Định vị ngón trỏ|Tăng âm lượng|Đổi màn hình|Mở máy in
Khi tốc độ tăng nhưng lỗi nhiều, em nên ưu tiên gì?|Độ chính xác|Tốc độ bằng mọi giá|Màu phím|Âm lượng
Nếu muốn tập bài dễ trước, em chọn gì trong phần mềm?|Bài tập phù hợp trình độ hiện tại|Bài bất kì khó nhất|Nút xóa|Nút thoát ngay
Sau buổi luyện, em có thể nhìn kết quả để làm gì?|Biết điểm cần cải thiện|Đổi tên máy|Tăng dung lượng|Xóa bài
"""),
"13": rows("""
Trong Scratch, lệnh 'di chuyển 10 bước' làm gì?|Cho nhân vật tiến theo hướng hiện tại|Đổi tên nhân vật|Tắt loa|Xóa dự án
Trong trò chơi rô-bốt, 'quay phải 90 độ' thay đổi điều gì?|Hướng của rô-bốt|Màu sân|Tên bạn chơi|Số người xem
Khi có nhiều chỉ dẫn, rô-bốt thực hiện thế nào?|Theo thứ tự đã cho|Ngẫu nhiên|Chỉ lệnh cuối|Chỉ lệnh dài nhất
Muốn chạy dự án Scratch, em thường nháy biểu tượng nào?|Cờ xanh|Thùng rác|Máy in|Loa
Muốn dừng dự án đang chạy, em nháy gì?|Nút dừng|Cờ xanh lần nữa bắt buộc|Phím cách luôn|Nút in
Sân khấu Scratch có vai trò gì?|Hiển thị hoạt động của nhân vật|Lưu mật khẩu|Cắm điện|Gõ văn bản ngoài máy
Nhân vật Scratch được điều khiển bằng gì?|Các câu lệnh trong chương trình|Màu vỏ máy|Tên ổ đĩa|Giá bàn phím
Muốn mở dự án đã lưu, em tìm chức năng gì?|Mở tệp hoặc dự án|Xóa mọi tệp|Tắt máy|Đổi phông nền máy
Vì sao trò chơi máy tính cần chương trình?|Chương trình quy định cách trò chơi hoạt động|Để thay dây nguồn|Để tự in giấy|Để mọi kết quả đúng
Nếu nhân vật không đi đúng đường, em nên xem lại gì?|Thứ tự và nội dung lệnh|Tên loa|Màu bàn|Giá chuột
"""),
"14": rows("""
Trong Scratch, các khối lệnh được sắp ở đâu để tạo chương trình?|Vùng tạo chương trình|Trên ổ điện|Trong máy in|Trên vỏ chuột
Nhóm lệnh Chuyển động thường điều khiển gì?|Vị trí và hướng nhân vật|Mật khẩu|Tệp âm thanh giấy|Nguồn điện
Khối lệnh bắt đầu 'khi bấm cờ xanh' thuộc vai trò gì?|Xác định sự kiện chạy chương trình|Tô màu màn hình|In văn bản|Xóa tệp
Để nhân vật nói một câu, em tìm khối lệnh ở nhóm nào phù hợp?|Hiển thị|Ổ điện|Bàn phím|Máy in
Vì sao cần ghép các khối lệnh đúng chỗ?|Để chương trình thực hiện theo ý tưởng|Để màn hình lớn hơn|Để loa sáng|Để tăng dung lượng
Muốn quan sát nhân vật chạy, em nhìn ở đâu?|Sân khấu|Thùng rác|Ổ điện|Tên tệp
Nếu khối lệnh nằm rời không nối vào chuỗi chạy, nó thường thế nào?|Không được thực hiện trong chuỗi đó|Luôn chạy trước|Tự in giấy|Tự xóa
Khi đổi một giá trị trong khối lệnh di chuyển, điều gì có thể đổi?|Quãng đường di chuyển|Tên máy tính|Giá chuột|Màu dây điện
Muốn biết một nhóm lệnh dùng làm gì, em nên làm gì?|Xem tên nhóm và thử khối phù hợp|Chọn ngẫu nhiên|Xóa mọi khối|Tắt phần mềm
Để tìm lỗi chương trình đơn giản, em có thể làm gì?|Chạy thử và đối chiếu từng bước|Chỉ đổi hình nền|Đóng máy|Rút chuột
"""),
"15": rows("""
Muốn kể chuyện bằng Scratch, em cần xác định gì trước?|Nhân vật, bối cảnh và các hành động|Màu dây nguồn|Tên ổ cắm|Giá máy
Nếu câu chuyện cần hai nhân vật, em nên làm gì?|Thêm nhân vật phù hợp|Chỉ đổi loa|Xóa sân khấu|Chỉ đổi tên máy
Phông nền sân khấu có tác dụng gì?|Tạo bối cảnh cho câu chuyện|Lưu mật khẩu|Tăng tốc mạng|Thay bàn phím
Khi nhân vật cần nói lời chào, em dùng loại lệnh nào?|Lệnh hiển thị lời nói|Lệnh tắt máy|Lệnh in giấy|Lệnh đổi mật khẩu
Muốn nhân vật đi từ đầu đến cuối cảnh, em cần gì?|Các lệnh chuyển động phù hợp|Chỉ ảnh nền|Chỉ âm thanh|Chỉ tên tệp
Vì sao cần xác định trình tự sự kiện trong câu chuyện?|Để chương trình diễn ra đúng ý|Để màn hình sáng|Để chuột nhanh|Để tệp tự lưu
Nếu bối cảnh không hợp câu chuyện, em nên làm gì?|Đổi phông nền phù hợp|Giữ nguyên luôn|Xóa nhân vật|Tắt loa
Sau khi ghép các lệnh, em nên làm gì?|Chạy thử câu chuyện|Chỉ nhìn tên dự án|Xóa lệnh|Đóng không lưu
Khi lời thoại xuất hiện quá nhanh, em có thể chỉnh gì?|Thời gian hiển thị lời nói|Tên bàn phím|Số loa|Màu dây điện
Trước khi chia sẻ chương trình, em nên kiểm tra gì?|Nhân vật, lời thoại và hành động có đúng ý|Giá máy|Tên ổ cắm|Loa có sáng
"""),
"16": rows("""
Chương trình Scratch muốn chạy cần có gì?|Khối lệnh bắt đầu phù hợp|Chỉ ảnh nhân vật|Chỉ tên tệp|Chỉ màu nền
Nếu nhân vật phải làm hai việc liên tiếp, em nên làm gì?|Ghép hai lệnh theo đúng thứ tự|Chỉ ghép một lệnh|Để lệnh rời rạc|Xóa sân khấu
Một khối lệnh sai có thể làm gì?|Kết quả khác điều mong muốn|Máy tự sửa hết|Chuột đổi màu|Tệp tự đúng
Vì sao nên lưu chương trình thường xuyên?|Giữ công việc đã làm|Tạo điện|Đổi phím|Tự kiểm tra mọi lỗi
Nếu bạn không hiểu mục đích dự án, em có thể làm gì?|Giới thiệu ý tưởng và cách chạy|Chỉ gửi tên tệp|Xóa lệnh|Đổi chuột
Khi chương trình kết thúc quá sớm, em nên kiểm tra gì?|Các lệnh và điều kiện dừng|Màu ổ điện|Giá màn hình|Tên máy in
Một chương trình có thể điều khiển bao nhiêu nhân vật?|Một hoặc nhiều nhân vật tùy dự án|Đúng một luôn|Không nhân vật nào|Chỉ hai luôn
Khi chạy thử phát hiện lỗi, em nên sửa thế nào?|Sửa lệnh liên quan rồi thử lại|Xóa mọi tệp|Bỏ qua lỗi|Tắt máy
Sau khi hoàn thành, em nên đặt tên dự án thế nào?|Rõ nghĩa, dễ tìm lại|Mới|abc|Không tên
Để bạn khác chạy chương trình, em cần chia sẻ gì?|Tệp dự án hoặc cách mở dự án phù hợp|Mật khẩu riêng|Dây điện|Máy in
"""),
}

GRADE5 = {
"1": rows("""
Máy tính có thể giúp em tạo bài giới thiệu bằng gì?|Phần mềm trình chiếu|Dây cáp|Ổ cắm|Chuột hỏng
Khi học qua video, em vẫn cần làm gì?|Tự suy nghĩ và ghi nhớ ý chính|Tin mọi thông tin|Bỏ qua câu hỏi|Chỉ xem hình nền
Muốn tìm thông tin về một chủ đề, em có thể dùng gì?|Công cụ tìm kiếm phù hợp|Máy in giấy trắng|Nút âm lượng|Ổ điện
Máy tính giúp lưu bài vẽ để làm gì?|Mở lại và chỉnh sửa sau|Tự đổi điểm|Tự in không cần máy in|Tự tạo tranh thật
Để trao đổi bài học trực tuyến, em cần chú ý gì?|Giao tiếp phù hợp và bảo vệ thông tin cá nhân|Gửi mật khẩu|Nói chuyện với người lạ bất kì|Chia sẻ địa chỉ nhà
Khi giải trí trên máy tính, điều gì quan trọng?|Chọn nội dung phù hợp và thời gian hợp lí|Chơi liên tục|Bấm liên kết lạ|Bỏ qua nghỉ mắt
Nếu phần mềm đưa ra kết quả không hợp lí, em nên làm gì?|Kiểm tra lại dữ liệu và cách làm|Tin ngay|Xóa máy|Đổi chuột
Sản phẩm số nào có thể được tạo bằng máy tính?|Văn bản, tranh số hoặc bài trình chiếu|Cây thật|Bàn gỗ thật|Một bữa ăn thật
Máy tính có thể giúp em luyện tập kiến thức bằng gì?|Bài tập tương tác phù hợp|Dây điện|Máy in tắt|Tấm lót chuột
Ai quyết định mục tiêu dùng máy tính để học?|Con người sử dụng máy|Loa|Bàn phím|Dây cáp
"""),
"2": rows("""
Trên website có ô tìm kiếm riêng, từ khóa được nhập vào đâu?|Ô tìm kiếm của website|Tên tệp|Ổ điện|Nút âm lượng
Nếu website có mục 'Động vật', muốn tìm bài về voi em nên làm gì?|Mở mục Động vật rồi tìm bài liên quan|Bấm quảng cáo|Tắt trang|Xóa trình duyệt
Khi từ khóa không có kết quả, em có thể làm gì?|Thử từ khóa khác gần nghĩa hoặc cụ thể hơn|Nhập mật khẩu|Xóa website|Tắt máy
Kết quả tìm trong website giúp em đến đâu?|Trang hoặc nội dung liên quan trong website|Bàn phím mới|Máy in|Ổ điện
Muốn tìm một nhân vật lịch sử, từ khóa nào phù hợp?|Tên nhân vật lịch sử đó|Lịch sử bất kì|Máy tính|Trò chơi
Vì sao nên xem danh mục của website?|Giúp xác định khu vực thông tin cần tìm|Để thay mật khẩu|Để máy sáng|Để xóa tệp
Nếu tiêu đề kết quả phù hợp, em vẫn cần làm gì?|Mở và đọc nội dung|Sao chép tiêu đề làm đáp án|Tin ngay không đọc|Đóng trang
Khi thông tin tìm được ghi ngày quá cũ, em nên làm gì?|Kiểm tra còn phù hợp hay không|Dùng luôn cho mọi việc|Xóa trang|Đổi tên máy
Nếu website có nhiều trang kết quả, em nên làm gì?|Xem thêm trang khi cần|Chỉ trang đầu luôn đủ|Tắt Internet|Xóa từ khóa
Sau khi tìm được bài hữu ích, em có thể lưu gì?|Địa chỉ hoặc tên trang để tìm lại|Mật khẩu người khác|Tên loa|Số phím
"""),
"3": rows("""
Để giải quyết việc trồng cây nơi ít nắng, em cần thông tin nào?|Loại cây chịu bóng và cách chăm sóc|Giá chuột|Màu bàn phím|Tên phần mềm nhạc
Trước khi gõ từ khóa, em nên xác định gì?|Câu hỏi cụ thể cần trả lời|Màu nền web|Âm lượng|Số phím
Nguồn nào phù hợp để tìm hướng dẫn sức khỏe học đường?|Nguồn chính thức hoặc thầy cô đáng tin|Bình luận lạ|Quảng cáo không rõ nguồn|Tin nhắn ngẫu nhiên
Khi hai nguồn nói khác nhau, em nên làm gì?|Đối chiếu thêm và hỏi người có hiểu biết|Chọn ngẫu nhiên|Tin nguồn dài hơn|Chia sẻ ngay
Thông tin chỉ hữu ích cho giải pháp khi nào?|Liên quan đến vấn đề và điều kiện thực tế|Có ảnh đẹp|Có nhiều quảng cáo|Có tiêu đề dài
Nếu cần chọn đường đi đến bảo tàng, em cần biết gì?|Địa chỉ, phương tiện và thời gian phù hợp|Màu chuột|Số loa|Tên tệp nhạc
Sau khi tìm được nhiều ý, em nên làm gì?|Chọn và sắp xếp ý liên quan|Chép tất cả|Xóa nguồn|Bỏ câu hỏi ban đầu
Vì sao cần kiểm tra ngày cập nhật khi tìm lịch sự kiện?|Lịch có thể thay đổi|Màu web đổi|Máy tự tắt|Phím Enter hỏng
Khi trình bày cách giải quyết, em nên nêu gì?|Lí do chọn thông tin và nguồn tham khảo|Mật khẩu|Tên ổ điện|Giá bàn phím
Nếu áp dụng giải pháp mà chưa hiệu quả, em nên làm gì?|Xem lại thông tin và điều chỉnh|Khẳng định luôn đúng|Xóa mọi tài liệu|Đổi tên máy
"""),
"4": rows("""
Thư mục gốc trong một cây thư mục là gì?|Thư mục ở đầu hệ thống phân cấp đang xét|Tệp cuối cùng|Bàn phím|Ổ điện
Nếu Học tập chứa Toán, Toán chứa Bài 1, thứ tự đường dẫn là gì?|Học tập → Toán → Bài 1|Bài 1 → Học tập → Toán|Toán → Bài 1 → Học tập|Loa → Toán
Thư mục cha của thư mục Bài 1 trong ví dụ trên là gì?|Toán|Học tập luôn|Bài 1|Màn hình
Muốn tìm tệp khi không nhớ thư mục, em dùng gì?|Công cụ tìm kiếm tệp trên máy|Nút âm lượng|Ổ cắm|Máy in
Nếu hai tệp cùng tên ở hai thư mục khác nhau, điều gì giúp phân biệt?|Đường dẫn đầy đủ|Tên phím Space|Màu chuột|Giá máy
Khi tìm kiếm tệp, từ khóa nào hữu ích?|Một phần tên tệp dễ nhớ|Mật khẩu|Màu dây điện|Tên loa
Vì sao cây thư mục giúp quản lí tệp?|Tệp được phân nhóm theo cấp bậc|Tệp tự đúng nội dung|Máy không cần điện|Chuột nhanh hơn
Muốn mở tệp nằm trong ba thư mục lồng nhau, em nên làm gì?|Mở lần lượt các thư mục trên đường dẫn|Chỉ nháy loa|Đổi tên máy|Xóa thư mục đầu
Nếu kết quả tìm kiếm có nhiều tệp, em cần kiểm tra gì?|Tên và vị trí để chọn đúng tệp|Chỉ màu biểu tượng|Chỉ âm lượng|Chỉ số trang web
Khi tạo cây thư mục cho bài học, tên nhánh nào rõ ràng?|Lớp 5 / Tin học / Bài tập|Mới / Mới / Mới|a / b / c bất kì|Không tên
"""),
"5": rows("""
Một bài hát trên mạng có thể có quyền của ai?|Tác giả hoặc chủ sở hữu hợp pháp|Người nghe đầu tiên|Người tải đầu tiên|Người đổi tên tệp
Khi lấy ảnh cho bài trình bày, bước nào đúng?|Kiểm tra quyền sử dụng và ghi nguồn phù hợp|Xóa tên người chụp|Nhận là mình chụp|Đăng lại tùy ý
Nội dung được chia sẻ miễn phí có nghĩa là gì?|Có thể dùng theo điều kiện được công bố|Không có tác giả|Được bán lại luôn|Được xóa nguồn luôn
Nếu tác giả ghi 'không được sửa đổi', em nên làm gì?|Tuân thủ điều kiện hoặc chọn tư liệu khác|Sửa rồi nhận là của mình|Xóa điều kiện|Chia sẻ bản sửa
Vì sao cần dẫn nguồn khi dùng thông tin?|Tôn trọng người tạo và giúp kiểm tra|Làm máy nhanh|Tạo mật khẩu|Thay trang web
Nếu muốn dùng toàn bộ video của người khác, em nên làm gì?|Xem điều kiện sử dụng hoặc xin phép|Đăng lại ngay|Xóa tên tác giả|Đổi màu video
Bản quyền áp dụng cho nội dung nào?|Nhiều loại tác phẩm như ảnh, chữ, nhạc và video|Chỉ phần mềm có phí|Chỉ tệp giấy|Chỉ ảnh đen trắng
Việc sao chép bài bạn và nộp như bài mình là gì?|Không trung thực và không tôn trọng công sức bạn|Cách ghi nguồn|Cách xin phép|Cách học đúng
Khi không rõ một ảnh có được dùng không, em nên gì?|Tìm điều kiện hoặc chọn ảnh có quyền dùng rõ ràng|Dùng ngay|Che tên tác giả|Đổi đuôi tệp
Tác giả cho phép dùng một ảnh với yêu cầu ghi tên, em cần gì?|Ghi tên tác giả theo yêu cầu|Bỏ tên|Nhận là ảnh của mình|Xóa ảnh
"""),
"6": rows("""
Muốn nhấn mạnh tiêu đề trong văn bản, em có thể làm gì?|Tăng cỡ và in đậm phù hợp|Thu nhỏ hết mức|Che bằng ảnh|Đổi dây cáp
Trước khi đổi màu một cụm từ, em cần làm gì?|Chọn cụm từ đó|Xóa cả tệp|Đổi chuột|Tắt ứng dụng
Nếu chữ đỏ trên nền đỏ, kết quả thế nào?|Khó đọc|Rõ hơn luôn|Tự in đậm|Tự lưu
Ảnh minh họa nên liên quan gì?|Nội dung đoạn văn|Tên máy|Giá bàn phím|Âm lượng loa
Khi bố trí ảnh bên cạnh chữ, em cần chú ý gì?|Không làm chữ bị che hoặc ngắt khó đọc|Để ảnh che chữ|Luôn phóng ảnh hết trang|Không xem lại
Một văn bản có quá nhiều kiểu chữ sẽ thế nào?|Rối và thiếu thống nhất|Tự chính xác hơn|Tăng tốc mạng|Giảm lỗi gõ
Muốn thay kiểu chữ của toàn bộ tiêu đề, em chọn gì?|Toàn bộ phần tiêu đề|Chỉ một dấu chấm|Ổ điện|Máy in
Nếu ảnh lớn làm văn bản sang trang khác, em nên làm gì?|Điều chỉnh kích thước và vị trí ảnh|Để nguyên mọi lỗi|Xóa nội dung|Đổi loa
Vì sao cần xem bản trình bày sau khi định dạng?|Phát hiện chữ khó đọc hoặc ảnh đặt chưa phù hợp|Đổi tên máy|Tăng dung lượng|Tắt mạng
Cỡ chữ phù hợp là cỡ thế nào?|Người đọc dễ đọc trong ngữ cảnh sử dụng|Nhỏ nhất có thể|To nhất luôn|Không cần xem
"""),
"7": rows("""
Khi soạn văn bản nhiều đoạn, các ý nên thế nào?|Theo trình tự rõ ràng|Ngẫu nhiên|Chỉ một từ|Không liên quan nhau
Muốn giữ đoạn gốc và có thêm ở vị trí khác, em dùng gì?|Sao chép rồi dán|Cắt rồi dán|Xóa rồi dán|Đóng tệp
Muốn chuyển đoạn văn đi nơi khác, em dùng gì?|Cắt rồi dán|Chỉ sao chép|Chỉ in|Chỉ đổi tên
Nếu dán đoạn sai chỗ, thao tác nào có thể giúp?|Hoàn tác rồi dán đúng vị trí|Xóa máy|Rút điện|Đổi bàn phím
Ảnh chèn vào bài viết nên thế nào?|Phù hợp và không che chữ|Luôn phủ kín trang|Không cần nguồn|Chỉ làm nền rối
Vì sao phải đọc lại bài trước khi nộp?|Phát hiện lỗi nội dung và chính tả|Tăng tốc máy|Đổi màu phím|Tạo dung lượng
Khi lưu bài nhiều lần, thao tác nào giữ nội dung mới nhất?|Lưu sau khi chỉnh sửa|Chỉ đóng cửa sổ|Xóa bản cũ trước|Tắt nguồn
Tên tệp 'Bài giới thiệu gia đình' có ưu điểm gì?|Dễ nhận biết nội dung|Tự sửa lỗi|Tăng số trang|Tạo mật khẩu
Nếu muốn thêm một câu vào giữa đoạn, em đặt con trỏ ở đâu?|Đúng vị trí cần chèn|Chỉ cuối tệp|Trên loa|Trong tên tệp
Sau khi soạn xong, kiểm tra bố cục giúp gì?|Văn bản dễ đọc và cân đối|Làm máy tự in|Thay màn hình|Đổi chuột
"""),
"8A": rows("""
Phần mềm đồ họa dùng để tạo gì?|Tranh và hình ảnh số|Bàn gỗ|Cây thật|Dây nguồn
Muốn tạo nét vẽ tự do, em dùng công cụ nào?|Bút vẽ|Máy in|Nút tắt|Công cụ âm lượng
Muốn hình có màu xanh, em chọn gì trước khi tô?|Màu xanh trong bảng màu|Tên tệp|Loa|Dây cáp
Nếu vừa vẽ sai một nét, thao tác nào hữu ích?|Hoàn tác hoặc tẩy|Lưu lỗi ngay|Xóa máy|Đổi bàn phím
Vùng làm việc nơi em vẽ được gọi là gì?|Vùng vẽ|Ổ điện|Loa|Thùng rác
Khi chọn công cụ hình chữ nhật, em có thể tạo gì?|Một hình chữ nhật|Một bài hát|Một mật khẩu|Một trang web
Nếu tô màu tràn ra ngoài, em nên kiểm tra gì?|Vùng cần tô có khép kín hoặc chọn đúng không|Âm lượng|Tên máy|Giá chuột
Muốn tiếp tục sửa tranh sau, em nên lưu thế nào?|Lưu tệp ở định dạng và vị trí phù hợp|Chỉ chụp bằng mắt|Xóa bản vẽ|Đóng không lưu
Sản phẩm tạo trong phần mềm đồ họa là gì?|Sản phẩm số|Vật bằng gỗ thật|Đồ ăn thật|Cây trồng thật
Vì sao cần đặt tên tệp tranh rõ ràng?|Dễ tìm và mở lại|Loa lớn hơn|Màn hình sáng hơn|Chuột nhẹ hơn
"""),
"9A": rows("""
Trước khi làm thiệp số, em nên chọn gì?|Chủ đề, lời chúc và hình phù hợp|Màu ngẫu nhiên|Mật khẩu|Tên ổ điện
Để lời chúc dễ đọc, em cần gì?|Chữ tương phản với nền|Chữ trùng màu nền|Chữ thật nhỏ|Ảnh che chữ
Nếu hai hình chồng lên nhau không đẹp, em làm gì?|Sắp xếp lại vị trí hoặc kích thước|Xóa máy|Đổi chuột|Tăng âm lượng
Muốn thêm họa tiết vào thiệp, em có thể dùng gì?|Công cụ vẽ và hình phù hợp|Máy in tắt|Ổ cắm|Dây mạng
Vì sao cần xem toàn bộ sản phẩm trước khi lưu?|Để phát hiện lỗi bố cục và nội dung|Để thay máy|Để tăng mạng|Để xóa màu
Ảnh của người khác dùng trong thiệp cần gì?|Quyền sử dụng phù hợp|Chỉ đổi tên tệp|Chỉ cắt ảnh|Chỉ tăng sáng
Nếu lời chúc bị sai chính tả, em nên làm gì?|Sửa chữ trước khi chia sẻ|Giữ nguyên|Che bằng hình|Xóa phần mềm
Khi cần in sản phẩm số, em nên kiểm tra gì?|Kích thước và bố cục phù hợp trang in|Tên loa|Mật khẩu bạn|Giá chuột
Muốn tấm thiệp có chủ đề mùa xuân, hình nào hợp hơn?|Hoa và cảnh mùa xuân|Hình ngẫu nhiên không liên quan|Ảnh che hết lời chúc|Ảnh rất mờ
Sản phẩm số hoàn thiện nên được làm gì?|Lưu lại và chia sẻ theo cách phù hợp|Đóng không lưu|Xóa ngay|Đổi bàn phím
"""),
"8B": rows("""
Trước khi theo video làm đồ thủ công, em cần chuẩn bị gì?|Vật liệu và dụng cụ được hướng dẫn|Chỉ bật loa|Chỉ đổi nền máy|Không chuẩn bị
Nếu video chạy nhanh, em có thể làm gì?|Tạm dừng ở mỗi bước|Làm bừa|Xóa video|Bỏ qua bước
Khi video dùng kéo, em nên nhớ gì?|Cầm và sử dụng an toàn, nhờ người lớn khi cần|Đùa nghịch|Đưa kéo sát mặt|Chạy quanh phòng
Nếu vật liệu không phù hợp, em nên làm gì?|Hỏi về vật liệu thay thế an toàn|Dùng thứ nguy hiểm|Bỏ mọi bước|Xóa hướng dẫn
Vì sao cần xem kết quả sau từng bước?|Phát hiện sai trước khi làm tiếp|Để máy nhanh|Để đổi màu giao diện|Để tắt loa
Khi chưa hiểu một thao tác, em nên gì?|Xem lại đoạn và hỏi người lớn|Đoán rồi làm ngay|Bỏ bước|Dùng lực mạnh hơn
Video hướng dẫn thường gồm gì?|Các thao tác theo thứ tự|Chỉ ảnh bìa|Chỉ nhạc nền|Chỉ quảng cáo
Sau khi hoàn thành, em nên so sánh gì?|Sản phẩm với yêu cầu và cách dùng|Màu bàn phím|Tên tệp nhạc|Giá máy
Nếu sản phẩm cần dùng hằng ngày, điều gì quan trọng?|Độ bền và an toàn|Chỉ màu thật chói|Chỉ giống ảnh bìa|Chỉ làm nhanh
Khi chia sẻ video gốc, em nên làm gì?|Nêu nguồn và tôn trọng quyền sử dụng|Nhận là của mình|Xóa tên người tạo|Đăng lại tùy ý
"""),
"9B": rows("""
Đồ dùng gia đình nào có thể làm từ vật liệu tái sử dụng an toàn?|Hộp đựng bút từ hộp sạch phù hợp|Đồ điện tự chế nguy hiểm|Vật sắc nhọn không bảo vệ|Chai hóa chất chưa rửa
Trước khi chọn video, em cần xem gì?|Độ phù hợp của vật liệu và mức an toàn|Chỉ nhạc nền|Chỉ lượt thích|Chỉ ảnh bìa
Nếu cần cắt vật liệu cứng, em nên làm gì?|Nhờ người lớn giúp|Tự dùng lực quá mạnh|Dùng dao tùy ý|Bỏ qua an toàn
Sau khi xem video, em có thể lập gì?|Danh sách vật liệu và các bước|Mật khẩu|Tên máy|Màu chuột
Nếu sản phẩm không dùng được, em nên làm gì?|Tìm nguyên nhân và chỉnh sửa an toàn|Vẫn sử dụng|Giấu lỗi|Xóa video
Tại sao cần làm từng bước theo hướng dẫn?|Giảm sai sót và giữ an toàn|Để video tự làm|Để máy nhanh|Để không cần vật liệu
Khi dùng keo, em nên chú ý gì?|Sử dụng đúng cách và giữ khu vực sạch|Bôi lên tay tùy ý|Để gần mắt|Dùng càng nhiều càng tốt
Nếu sản phẩm có cạnh sắc, em nên làm gì?|Xử lí cạnh hoặc nhờ người lớn trước khi dùng|Dùng ngay|Đưa cho em nhỏ|Bỏ qua
Sau khi làm đồ dùng, em cần đánh giá gì?|Có đáp ứng nhu cầu và an toàn không|Có giống màu màn hình không|Nhạc video có to không|Chuột có sạch không
Khi giới thiệu sản phẩm, em có thể nói gì?|Vật liệu, các bước và điều đã điều chỉnh|Chỉ tên video|Chỉ màu phông|Chỉ giá máy
"""),
"10": rows("""
Trong chuỗi lệnh A rồi B rồi C, lệnh nào chạy đầu?|A|B|C|Không lệnh nào
Nếu lệnh 'nói Xin chào' đứng trước 'di chuyển', người xem thấy gì trước?|Lời chào|Di chuyển|Kết thúc|Đổi nền
Vì sao thứ tự lệnh trong cấu trúc tuần tự quan trọng?|Ảnh hưởng thứ tự hành động và kết quả|Chỉ làm đẹp mã|Thay phần cứng|Tạo điện
Khi bước sau cần kết quả bước trước, em nên đặt thế nào?|Bước trước chạy trước|Bước sau chạy trước|Ngẫu nhiên|Chỉ bước cuối
Chương trình tuần tự có bắt buộc chứa vòng lặp không?|Không|Có luôn|Chỉ khi có loa|Chỉ khi mở mạng
Muốn vẽ đường rồi đổi màu sau, em đặt lệnh nào trước?|Lệnh vẽ đường|Lệnh đổi màu sau|Lệnh dừng|Lệnh xóa
Nếu nhân vật đứng sai vị trí trước khi bắt đầu, em nên thêm gì đầu chương trình?|Lệnh đặt vị trí ban đầu|Chỉ lệnh nói|Chỉ lệnh dừng|Chỉ đổi tên
Sau khi chạy thử thấy hành động đảo ngược, em cần gì?|Kiểm tra thứ tự các lệnh|Đổi máy in|Tắt loa|Xóa mạng
Ba bước 'mở tệp → chỉnh sửa → lưu' là ví dụ của gì?|Cấu trúc tuần tự|Cấu trúc lặp vô hạn|Chỉ rẽ nhánh|Không có trình tự
Khi chương trình có nhiều lệnh liên tiếp, em nên đọc thế nào?|Theo thứ tự thực hiện|Từ lệnh cuối ngẫu nhiên|Chỉ tên khối|Chỉ màu khối
"""),
"11": rows("""
Khối lặp 6 lần làm nhóm lệnh bên trong chạy mấy lần?|6 lần|1 lần|5 lần|12 lần
Nếu lệnh di chuyển 10 bước lặp 3 lần, tổng quãng đường theo cùng hướng là bao nhiêu?|30 bước|10 bước|13 bước|3 bước
Vì sao khối lặp làm chương trình gọn hơn?|Không cần viết lại cùng nhóm lệnh nhiều lần|Xóa mọi hành động|Tự sửa lỗi|Thay máy
Lệnh ở ngoài khối lặp có chạy theo số lần của khối đó không?|Không|Có luôn|Chỉ khi cờ xanh|Chỉ khi có nhạc
Muốn nhân vật nói ba lần, số lần lặp đặt bao nhiêu?|3|1|2|4
Nếu khối lặp 0 lần được chương trình cho phép, lệnh bên trong chạy mấy lần?|0 lần|1 lần|2 lần|Vô hạn
Khi lặp nhiều quá, nhân vật có thể thế nào?|Làm hành động quá nhiều so với ý muốn|Tự dừng đúng ý luôn|Tự đổi tên|Không chạy
Trước khi dùng lặp, em nên xác định gì?|Nhóm lệnh và số lần cần lặp|Màu vỏ máy|Giá chuột|Tên loa
Nếu mỗi vòng lặp gồm nói rồi chờ, hai lệnh được làm thế nào?|Theo thứ tự đó ở mỗi vòng|Chỉ một lần tất cả|Ngẫu nhiên|Chỉ chờ
Sau khi đổi số lần lặp, em nên làm gì?|Chạy thử và xem kết quả|Chỉ lưu|Xóa khối|Tắt máy
"""),
"12": rows("""
Để vẽ hình vuông, nhân vật cần vẽ mấy cạnh?|4 cạnh|3 cạnh|5 cạnh|1 cạnh
Góc quay ngoài ở mỗi đỉnh hình vuông khi đi quanh viền là bao nhiêu?|90 độ|45 độ|180 độ|360 độ
Để vẽ tam giác đều theo cạnh, số lần lặp thường là mấy?|3 lần|4 lần|2 lần|6 lần
Nếu cạnh vuông dài 50 bước và lặp bốn lần, tổng quãng đường là bao nhiêu?|200 bước|50 bước|100 bước|400 bước
Nếu chỉ lặp ba lần thao tác vẽ cạnh rồi quay 90 độ, điều gì thiếu?|Một cạnh của hình vuông|Tự thành hình tròn|Đủ bốn cạnh|Máy tắt
Khối lặp vẽ hình nên chứa gì?|Lệnh đi và lệnh quay|Chỉ lệnh dừng|Chỉ đổi nền|Chỉ lời nói
Khi hình không khép kín, em kiểm tra gì?|Số vòng, góc quay và độ dài cạnh|Tên loa|Màu dây điện|Giá máy
Muốn hình vuông lớn hơn, em đổi gì?|Số bước đi cho mỗi cạnh|Số nhân vật|Tên chương trình|Nút cờ xanh
Nếu mỗi vòng quay 180 độ thay vì 90 độ, kết quả có còn là hình vuông không?|Không|Có luôn|Chỉ khi màu đỏ|Chỉ khi loa bật
Sau khi chỉnh lệnh lặp, bước nào xác nhận kết quả?|Chạy thử và quan sát hình|Chỉ lưu tên|Đổi bàn phím|Tắt màn hình
"""),
"13": rows("""
Trong câu 'nếu chạm cạnh thì quay lại', điều kiện là gì?|Chạm cạnh|Quay lại|Nhân vật|Sân khấu
Nếu điều kiện sai trong lệnh 'nếu ... thì', lệnh bên trong chạy không?|Không|Có luôn|Chỉ khi mạng nhanh|Chỉ khi có loa
Nhánh 'nếu không thì' chạy lúc nào?|Khi điều kiện không đúng|Khi điều kiện đúng|Luôn trước điều kiện|Không bao giờ
Nếu điểm bằng 7, điều kiện 'điểm > 5' có đúng không?|Đúng|Sai|Không có kết quả|Chỉ đúng khi điểm = 5
Muốn nói 'Thắng' khi đủ điểm và 'Thử lại' khi chưa đủ, dùng gì?|Rẽ nhánh hai trường hợp|Chỉ lệnh nói một câu|Chỉ lệnh di chuyển|Chỉ đổi nền
Vì sao cần chạy thử cả hai trường hợp của rẽ nhánh?|Để kiểm tra mỗi nhánh hoạt động đúng|Để tăng dung lượng|Để đổi loa|Để tạo ảnh
Nếu điều kiện kiểm tra sai dấu so sánh, điều gì có thể xảy ra?|Chương trình chọn nhánh không đúng ý|Máy tự sửa hết|Bàn phím đổi màu|Loa tắt
Khi đèn xanh, theo quy tắc 'nếu đèn đỏ thì dừng', lệnh dừng có chạy do quy tắc đó không?|Không|Có luôn|Chỉ khi trời mưa|Chỉ khi có nhân vật
Cấu trúc rẽ nhánh khác tuần tự ở đâu?|Có lựa chọn hành động theo điều kiện|Không có lệnh nào|Chỉ phát nhạc|Chỉ đổi tên
Một biểu thức điều kiện thường cho biết gì?|Đúng hoặc sai|Chỉ một hình ảnh|Chỉ âm thanh|Chỉ tên tệp
"""),
"14": rows("""
Trong Scratch, biến 'trả lời' lưu gì sau lệnh hỏi và đợi?|Nội dung người dùng nhập|Tên máy in|Màu nền|Số phím
Khi người dùng gõ 'An' rồi Enter, biến trả lời có giá trị gì?|An|Enter|0 luôn|Tên nhân vật
Muốn tạo biến tự đặt tên, em chọn gì?|Tạo một biến|Tạo phông nền|Xóa sân khấu|Đổi loa
Muốn biến điểm ban đầu bằng 0, em dùng lệnh nào?|Đặt điểm thành 0|Thay đổi điểm một lượng 1|Xóa nhân vật|Đổi tên dự án
Nếu điểm đang 4 và tăng một lượng 3, điểm mới là gì?|7|1|4|12
Nếu muốn thấy giá trị biến trên sân khấu, em có thể làm gì?|Bật hiển thị biến|Tắt màn hình|Xóa biến|Đổi chuột
Biến lưu giá trị có thể thay đổi khi nào?|Khi chương trình cập nhật|Chỉ khi in giấy|Không bao giờ|Chỉ khi tắt máy
Vì sao đặt tên biến 'số điểm' hữu ích?|Cho biết biến dùng để lưu gì|Làm máy nhanh|Tạo điện|Đổi giao diện
Nếu chương trình hỏi tên rồi nói lời chào có tên, cần dùng gì?|Giá trị biến trả lời|Chỉ hình nền|Chỉ nút dừng|Chỉ âm lượng
Nếu biến tuổi bằng 9 rồi tăng 1, giá trị mới là bao nhiêu?|10|8|9|1
"""),
"15": rows("""
Nếu biến Cạnh bằng 5, biểu thức 4 × Cạnh cho kết quả gì?|20|9|1|25
Biểu thức 10 / 2 cho giá trị nào?|5|8|12|20
Nếu a = 3 và b = 4, a + b bằng gì?|7|12|1|34
Nếu a = 3 và b = 4, a × b bằng gì?|12|7|1|34
Biểu thức 'điểm > 10' với điểm = 8 là gì?|Sai|Đúng|10|8
Biểu thức so sánh dùng khi nào?|Khi cần kiểm tra điều kiện|Khi đổi dây nguồn|Khi in giấy|Khi mở loa
Muốn tính diện tích hình vuông cạnh Cạnh, biểu thức nào đúng?|Cạnh × Cạnh|4 × Cạnh|Cạnh + 4|Cạnh / 4
Nếu x = 6, biểu thức x - 2 bằng bao nhiêu?|4|8|12|2
Trong Scratch, các khối phép toán dùng để gì?|Tạo biểu thức tính và so sánh|Thay bàn phím|Đổi máy in|Xóa dự án
Sau khi đặt biểu thức vào chương trình, em nên làm gì?|Chạy thử với giá trị cụ thể|Tin luôn|Xóa biến|Tắt phần mềm
"""),
"16": rows("""
Kịch bản giúp người lập trình xác định gì?|Nhân vật, hành động và thứ tự|Giá chuột|Màu dây điện|Tên máy in
Khi hai nhân vật có việc khác nhau, em nên làm gì?|Lập trình lệnh cho từng nhân vật|Chỉ viết cho một rồi mặc định giống|Xóa một nhân vật|Đổi tên máy
Nếu kịch bản có hành động lặp bốn lần, em dùng gì?|Khối lặp 4 lần|Chỉ lệnh dừng|Chỉ đổi nền|Chỉ âm thanh
Nếu kịch bản yêu cầu phản ứng khi chạm vật, em cần gì?|Điều kiện rẽ nhánh phù hợp|Chỉ lệnh nói liên tục|Chỉ đổi tên|Chỉ phông nền
Nhóm khối lệnh nào thường bắt đầu hoạt động khi bấm cờ xanh?|Nhóm Sự kiện|Nhóm chỉ đổi màu|Nhóm in giấy|Nhóm tệp hệ thống
Nếu thứ tự hành động sai kịch bản, em nên làm gì?|Sắp xếp lại các lệnh|Đổi loa|Tắt mạng|Xóa mọi tệp
Để biết chương trình đúng ý chưa, em cần gì?|Chạy thử và đối chiếu kịch bản|Chỉ nhìn tên dự án|Tin luôn|Chỉ xem màu khối
Nếu kết quả sai ở một bước, em nên làm gì?|Tìm lệnh liên quan và sửa|Xóa toàn bộ máy|Giữ nguyên lỗi|Đổi chuột
Sau khi hoàn thành, em nên lưu gì?|Tệp dự án có thể mở lại để chỉnh sửa|Chỉ ảnh chụp mờ|Chỉ tên tệp trên giấy|Chỉ âm lượng
Khi giới thiệu dự án, em nên trình bày gì?|Ý tưởng, cách chạy và kết quả|Mật khẩu cá nhân|Giá máy|Tên ổ điện
"""),
}

LEGACY = {
"lop-3-thong-tin-va-quyet-dinh": rows("""
Khi thấy mây đen kéo đến, em nên cân nhắc mang gì?|Áo mưa hoặc ô|Kính bơi|Đồ chơi điện|Máy in
Tiếng trống báo vào lớp là loại thông tin nào?|Âm thanh|Mùi hương|Vị giác|Hình vẽ
Chữ trên biển 'Đi chậm' được em tiếp nhận chủ yếu qua đâu?|Mắt|Tai|Mũi|Lưỡi
Khi nghe lời nhắc phải xếp hàng, hành động nào phù hợp?|Xếp hàng theo hướng dẫn|Chạy chen lên|Bỏ đi|Hét to
Thông tin giúp em làm gì trong tình huống cần chọn lựa?|Đưa ra quyết định|Tạo máy tính mới|Thay nguồn điện|In giấy
Nếu trời nắng gắt, quyết định nào có thể phù hợp?|Đội mũ khi ra ngoài|Mặc áo mưa kín trong nhà|Để sách ngoài nắng|Không uống nước
Khi nhìn đèn tín hiệu đỏ, em nên làm gì?|Dừng lại trước vạch dừng|Đi nhanh hơn|Băng qua ngay|Đổi màu đèn
Mùi khét từ thiết bị điện là thông tin em nhận qua đâu?|Mũi|Tai|Mắt|Lưỡi
Nếu chưa hiểu biển chỉ dẫn, em nên làm gì?|Hỏi người lớn hoặc đọc lại|Đoán rồi làm liều|Bỏ qua mọi cảnh báo|Đổi biển
Quyết định tốt thường dựa trên điều gì?|Thông tin phù hợp với tình huống|Suy đoán ngẫu nhiên|Màu bàn phím|Tên máy in
"""),
"lop-4-tim-kiem-thong-tin-internet": rows("""
Từ khóa nào phù hợp để tìm vòng đời của bướm?|vòng đời của bướm|động vật|màu sắc|máy tính
Nếu kết quả tìm kiếm quá nhiều, em nên làm gì?|Dùng từ khóa cụ thể hơn|Xóa trình duyệt|Tắt màn hình|Nhập mật khẩu
Trước khi tin một kết quả, em cần kiểm tra gì?|Nội dung và nguồn đăng|Màu chuột|Giá máy|Số phím
Tìm giờ mở cửa bảo tàng, nguồn nào đáng tin hơn?|Website chính thức của bảo tàng|Bình luận không rõ người viết|Quảng cáo bất kì|Tin nhắn lạ
Nếu gõ sai chính tả từ khóa, em nên làm gì?|Sửa lại từ khóa|Xóa máy|Đổi loa|Tắt Internet luôn
Liên kết trong kết quả tìm kiếm dẫn tới gì?|Trang chứa thông tin liên quan|Ổ điện|Bàn phím|Máy in
Khi hai trang đưa thông tin khác nhau, em nên làm gì?|Đối chiếu thêm nguồn đáng tin|Chọn ngẫu nhiên|Chia sẻ cả hai như đúng|Chỉ xem ảnh
Vì sao nên xem ngày đăng khi tìm lịch sự kiện?|Lịch có thể đã thay đổi|Để đổi phông chữ|Để tăng mạng|Để xóa tệp
Khi tìm thấy bài phù hợp, em có thể ghi lại gì?|Ý chính và nguồn|Mật khẩu người khác|Tên dây điện|Số phím
Từ khóa tốt nên thế nào?|Nêu đủ ý cần tìm và không quá mơ hồ|Luôn là một chữ bất kì|Càng dài vô nghĩa càng tốt|Luôn là mật khẩu
"""),
"lop-4-on-tap-may-tinh": rows("""
Khi ngồi trước máy, mắt nên cách màn hình thế nào?|Một khoảng cách phù hợp|Áp sát màn hình|Càng gần càng tốt|Không cần nhìn
Nếu dây điện bị hở, em nên làm gì?|Tránh chạm và báo người lớn|Tự nối tay không|Đổ nước|Tiếp tục dùng
Khi rời máy dùng chung, em nên làm gì?|Lưu bài và đăng xuất|Để tài khoản mở|Cho mọi người mật khẩu|Xóa tệp người khác
Vì sao cần nghỉ mắt khi dùng máy lâu?|Giảm mỏi mắt|Tăng số phím|Tạo mạng|Thay phần mềm
Nếu có lời mời tải tệp lạ, em nên làm gì?|Hỏi người lớn trước khi tải|Tải ngay|Chia sẻ cho cả lớp|Tắt bảo vệ máy
Mật khẩu tài khoản nên được xử lí thế nào?|Giữ kín|Đăng công khai|Dán lên màn hình|Gửi cho người lạ
Nếu máy có dấu hiệu hỏng, em nên làm gì?|Báo giáo viên hoặc người lớn|Tự tháo máy|Đập máy|Tiếp tục dùng bất chấp
Nước uống nên đặt thế nào khi học máy?|Xa thiết bị và ổ điện|Trên bàn phím|Sát ổ cắm|Trên thân máy
Tư thế ngồi phù hợp là gì?|Lưng thẳng và thoải mái|Cúi sát màn hình|Vẹo hẳn sang bên|Nằm trên bàn
Khi tắt máy sau giờ học, em nên làm gì?|Dùng lệnh tắt máy đúng cách|Rút điện ngay|Đập nút nguồn|Xóa ổ đĩa
"""),
"lop-5-lap-trinh-scratch-co-ban": rows("""
Trong Scratch, nút cờ xanh thường dùng để gì?|Bắt đầu chạy chương trình|Xóa dự án|Tắt máy|Đổi ngôn ngữ
Sân khấu Scratch là nơi nào?|Nơi nhân vật thể hiện hành động|Nơi cắm điện|Nơi in giấy|Nơi lưu mật khẩu
Muốn nhân vật di chuyển, em dùng nhóm lệnh nào?|Chuyển động|Âm lượng máy|Ổ điện|Tệp văn bản
Khối lệnh 'nói' giúp nhân vật làm gì?|Hiển thị lời thoại|Tạo dây điện|In ảnh|Xóa máy
Nếu khối lệnh không nối vào chuỗi bắt đầu, điều gì có thể xảy ra?|Nó không chạy cùng chuỗi đó|Nó luôn chạy trước|Máy tự xóa|Loa tự tắt
Muốn lưu dự án để sửa sau, em cần làm gì?|Lưu tệp dự án|Chỉ đóng cửa sổ|Đổi chuột|Xóa nhân vật
Khi nhân vật đi sai hướng, em nên kiểm tra gì?|Lệnh di chuyển và hướng|Màu bàn phím|Tên loa|Giá màn hình
Nếu cần lặp hành động, em có thể dùng gì?|Khối lặp|Chỉ lệnh dừng|Chỉ phông nền|Chỉ tệp ảnh
Sau khi ghép lệnh, em nên làm gì?|Chạy thử và quan sát|Xóa mọi lệnh|Tắt máy|Đổi tên ổ đĩa
Muốn thay cảnh cho câu chuyện Scratch, em dùng gì?|Phông nền sân khấu|Dây cáp|Nút nguồn|Máy in
"""),
}


# One applied-reasoning question replaces a recall question in selected lessons.
# The sixth field explains the reasoning, not just the correct option.
DEEP = {
    (3, "2"): ("Lan nghe cô dặn 'nếu trời mưa thì chuyển buổi tập vào phòng'. Trời bắt đầu mưa. Chuỗi nào mô tả đúng việc Lan làm?", "Nghe thông tin, nhận ra trời mưa, rồi vào phòng tập", "Vào phòng trước khi nghe và quan sát", "Chỉ nghe dặn nhưng không kiểm tra thời tiết", "Thấy mưa nhưng vẫn tập ngoài trời", "Lan tiếp nhận lời dặn và tình trạng thời tiết, xử lí điều kiện rồi mới quyết định chuyển vào phòng."),
    (3, "7"): ("Thư mục Ảnh có 60 ảnh của ba chuyến đi. Cách nào giúp tìm ảnh chuyến đi tháng 9 nhanh nhất?", "Tạo ba thư mục theo từng chuyến đi và đặt tên rõ ràng", "Đổi mọi ảnh thành cùng một tên", "Để 60 ảnh lẫn nhau và mở từng ảnh", "Xóa hết ảnh cũ", "Chia ảnh theo chuyến đi và đặt tên thư mục rõ ràng giúp thu hẹp nơi cần tìm."),
    (3, "8"): ("Trong thư mục Học tập có thư mục Toán; trong Toán có tệp Bài 1. Muốn mở Bài 1 từ Học tập, em đi theo thứ tự nào?", "Mở Toán rồi mở Bài 1", "Mở Bài 1 rồi mới mở Toán", "Mở thư mục khác bất kì", "Xóa Toán để thấy Bài 1", "Tệp Bài 1 nằm trong nhánh Toán, nên phải mở thư mục Toán trước."),
    (3, "10"): ("Mai sắp sửa bài trình chiếu quan trọng trên máy dùng chung. Việc nào giúp tránh mất bản cũ nếu sửa nhầm?", "Tạo một bản sao trước khi chỉnh sửa", "Chỉ đổi màu tên tệp", "Xóa bản cũ rồi mới sửa", "Đăng mật khẩu lên bảng", "Bản sao là bản dự phòng để khôi phục khi việc chỉnh sửa không như ý."),
    (3, "12"): ("Một mô phỏng cho thấy các hành tinh quay quanh Mặt Trời nhưng kích thước được vẽ lớn để dễ nhìn. Em nên hiểu hình đó thế nào?", "Dùng mô phỏng để học chuyển động, không coi kích thước vẽ là kích thước thật", "Mọi hành tinh ngoài đời lớn đúng bằng hình", "Mô phỏng tạo ra các hành tinh thật", "Không thể học gì từ mô phỏng", "Mô phỏng giúp quan sát hiện tượng; hình vẽ có thể thay đổi tỉ lệ để dễ học."),
    (3, "15"): ("Cô dặn 'Nếu trời mưa thì mang áo mưa; nếu không mưa thì đội mũ'. Hôm nay trời nắng. Em làm gì theo chỉ dẫn?", "Đội mũ", "Mang áo mưa", "Mang cả hai vì có hai câu", "Không làm gì dù có nhánh nếu không", "Điều kiện trời mưa sai nên thực hiện nhánh còn lại: đội mũ."),
    (3, "16"): ("Nhóm đã làm 5 trang chiếu nhưng trang kết luận nằm trước phần giới thiệu. Cách sửa nào hợp lí?", "Sắp lại thứ tự các trang rồi trình chiếu thử", "Chỉ đổi màu kết luận", "Xóa toàn bộ bài", "Giữ nguyên vì thứ tự không quan trọng", "Bài trình chiếu cần mạch giới thiệu, nội dung, kết luận rõ ràng; trình chiếu thử giúp kiểm tra."),
    (4, "3"): ("Nam nháy vào liên kết có tên 'Sơ đồ trường' nhưng trang mới yêu cầu mật khẩu tài khoản. Nam nên làm gì?", "Dừng lại, kiểm tra địa chỉ trang và hỏi giáo viên", "Nhập mật khẩu để xem tiếp", "Gửi liên kết cho cả lớp trước", "Tắt phần mềm bảo vệ", "Liên kết có thể dẫn sang trang khác; yêu cầu mật khẩu bất thường cần được kiểm tra trước."),
    (4, "4"): ("Em cần tìm giờ mở cửa hiện nay của một bảo tàng. Kết quả đầu là bài viết từ nhiều năm trước, kết quả sau là trang chính thức mới cập nhật. Nên dùng kết quả nào?", "Trang chính thức mới cập nhật", "Bài cũ vì xuất hiện đầu tiên", "Chọn ngẫu nhiên một kết quả", "Không cần xem ngày đăng", "Giờ mở cửa có thể thay đổi, nên ưu tiên thông tin mới trên nguồn chính thức."),
    (4, "5"): ("An muốn đưa bài tập từ thư mục A sang B nhưng vẫn giữ bài trong A. An cần dùng thao tác nào?", "Sao chép rồi dán vào B", "Cắt rồi dán vào B", "Xóa bài trong A rồi tạo tệp trống ở B", "Chỉ đổi tên A thành B", "Sao chép tạo thêm bản ở B và giữ nguyên bản gốc trong A."),
    (4, "6"): ("Một phần mềm được cho dùng miễn phí ở nhà nhưng điều khoản không cho cài trên máy của trường. Em nên làm gì khi muốn dùng ở phòng Tin học?", "Hỏi giáo viên và chỉ cài khi điều khoản cho phép", "Tự cài vì phần mềm miễn phí", "Sao chép từ máy nhà sang mọi máy ở trường", "Xóa tên tác giả rồi cài", "Miễn phí không đồng nghĩa được dùng ở mọi nơi; phải tuân thủ điều khoản sử dụng và quy định phòng máy."),
    (4, "11"): ("Một đoạn văn đang ở cuối bài nhưng cần chuyển lên đầu mà không để lại bản trùng. Thao tác nào đúng?", "Chọn đoạn, cắt, đặt con trỏ ở đầu rồi dán", "Chọn đoạn, sao chép rồi dán ở đầu", "Chỉ đổi màu đoạn", "Xóa đoạn và không dán lại", "Cắt rồi dán di chuyển đoạn; sao chép rồi dán sẽ để lại thêm một bản ở cuối."),
    (4, "13"): ("Rô-bốt cần đi theo hình vuông. Bạn lập trình lặp bốn lần 'đi 100 bước, quay 90 độ' nhưng đặt lệnh quay trước lệnh đi. Điều gì thay đổi?", "Rô-bốt bắt đầu đi theo hướng đã quay, dù vẫn có bốn cạnh", "Rô-bốt chắc chắn đứng yên", "Chương trình tự xóa lệnh quay", "Thứ tự lệnh không ảnh hưởng đường đi", "Thay thứ tự lệnh làm thay đổi hướng của bước đi đầu tiên và vị trí đường vẽ."),
    (4, "15"): ("Kịch bản cần mèo nói lời chào ở sân trường rồi chuyển sang lớp học. Em nên tổ chức chương trình thế nào?", "Chọn nền sân trường, cho mèo nói, rồi đổi sang nền lớp học", "Đổi nền lớp học trước rồi mới cho mèo nói ở sân trường", "Chỉ thêm hai nền mà không có lệnh", "Chỉ đổi tên nhân vật", "Thứ tự lệnh cần bám kịch bản: bối cảnh sân trường và lời chào trước, chuyển cảnh sau."),
    (5, "3"): ("Hai trang đưa cách chăm một cây khác nhau. Trang thứ nhất không ghi nguồn, trang thứ hai là hướng dẫn của đơn vị chuyên môn và hợp điều kiện nhà em. Em nên làm gì?", "Ưu tiên kiểm tra và vận dụng hướng dẫn từ nguồn chuyên môn phù hợp", "Tin trang không ghi nguồn vì ngắn hơn", "Chép cả hai mà không đối chiếu", "Bỏ qua điều kiện thực tế của nhà", "Giải pháp cần dựa trên nguồn đáng tin và phù hợp điều kiện áp dụng."),
    (5, "4"): ("Có hai tệp cùng tên Bài 1 trong Toán và Tiếng Việt. Em muốn mở bài Toán. Cách nào chắc chắn hơn?", "Kiểm tra đường dẫn và chọn tệp trong thư mục Toán", "Chọn tệp hiện đầu tiên bất kể vị trí", "Đổi tên cả hai tệp giống nhau", "Xóa thư mục Tiếng Việt", "Đường dẫn phân biệt các tệp cùng tên nằm ở những thư mục khác nhau."),
    (5, "5"): ("Lan muốn đưa ảnh của một tác giả vào bài trình chiếu. Trang ảnh cho phép dùng khi ghi tên tác giả. Lan nên làm gì?", "Dùng ảnh và ghi tên tác giả theo điều kiện", "Dùng ảnh rồi xóa tên tác giả", "Nói mình chụp ảnh", "Không cần đọc điều kiện vì ảnh xem được", "Quyền sử dụng do tác giả nêu cần được tuân thủ, kể cả khi ảnh được dùng miễn phí."),
    (5, "7"): ("Em cần đưa đoạn mở đầu xuống cuối văn bản và không để bản sao ở đầu. Em chọn cách nào?", "Cắt đoạn rồi dán ở cuối", "Sao chép đoạn rồi dán ở cuối", "Chỉ in văn bản", "Chỉ thay phông chữ", "Cắt rồi dán di chuyển đoạn; sao chép sẽ giữ bản cũ và tạo bản mới."),
    (5, "10"): ("Chương trình đặt điểm về 0 rồi cộng 1. Nếu đổi thứ tự hai lệnh, điểm cuối là bao nhiêu khi bắt đầu từ 5?", "0", "1", "5", "6", "Cộng 1 trước đưa điểm từ 5 lên 6, sau đó lệnh đặt về 0 ghi đè kết quả."),
    (5, "11"): ("Trong khối lặp 4 lần có lệnh tăng điểm thêm 2. Điểm bắt đầu là 1. Điểm cuối là bao nhiêu?", "9", "8", "3", "5", "Mỗi vòng tăng 2 điểm; bốn vòng tăng 8, cộng điểm ban đầu 1 được 9."),
    (5, "12"): ("Chương trình vẽ hình vuông lặp bốn lần 'đi 50 bước, quay 90 độ'. Nếu chỉ đổi 50 thành 80, điều gì xảy ra?", "Hình vuông lớn hơn, số cạnh không đổi", "Hình thành tam giác", "Số cạnh tăng thành tám", "Hình biến mất", "Độ dài cạnh tăng lên 80 bước; bốn vòng và góc quay 90 độ vẫn tạo bốn cạnh."),
    (5, "13"): ("Chương trình: nếu điểm ≥ 10 thì nói 'Thắng', nếu không thì nói 'Thử lại'. Điểm đang là 9. Nhân vật nói gì?", "Thử lại", "Thắng", "Cả hai câu cùng lúc", "Không câu nào dù có nhánh nếu không", "Vì 9 chưa đạt 10, chương trình chạy nhánh 'nếu không'."),
    (5, "14"): ("Chương trình đặt biến điểm thành 0, rồi thay đổi điểm một lượng 3 hai lần. Giá trị cuối là gì?", "6", "3", "0", "9", "Biến bắt đầu ở 0; mỗi lần tăng 3 nên sau hai lần có giá trị 6."),
    (5, "15"): ("Biến Cạnh bằng 6. Muốn chương trình tính chu vi hình vuông, biểu thức nào đúng và cho kết quả bao nhiêu?", "4 × Cạnh, kết quả 24", "Cạnh × Cạnh, kết quả 36", "Cạnh + 4, kết quả 10", "Cạnh / 4, kết quả 1,5", "Chu vi hình vuông bằng bốn lần độ dài cạnh: 4 × 6 = 24."),
    (5, "16"): ("Kịch bản yêu cầu mèo hỏi tên bạn, chào đúng tên, rồi lặp lời chào hai lần. Chương trình nên dùng thành phần nào?", "Lệnh hỏi và biến trả lời, kết hợp lời chào trong khối lặp 2 lần", "Chỉ lệnh nói một câu cố định", "Chỉ đổi phông nền", "Chỉ đặt biến điểm về 0", "Tên nhập được lưu ở biến trả lời; dùng giá trị đó trong lời chào và lặp hai lần theo kịch bản."),
}
