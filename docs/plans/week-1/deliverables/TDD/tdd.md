# I. Bối cảnh dự án
Tuần 2 yêu cầu một CLI cục bộ quản lý các ticket được lưu trữ trong JSON. Các lệnh dự kiến là:

```javascript 
 tickets create
 tickets list
 tickets show <id>
 tickets update <id>
``` 
Mục tiêu của nghiên cứu này là quyết định những gì cần kiểm thử và tại sao trước khi bắt đầu triển khai.
## 1. Phát triển hướng kiểm thử (TDD) là gì?
Phát triển hướng kiểm thử (Test-Driven Development - TDD) là một kỹ thuật phát triển viết một bài kiểm thử nhỏ cho một hành vi mong muốn trước khi triển khai hành vi đó. Bài kiểm thử cung cấp phản hồi nhanh về việc liệu việc triển khai có đáp ứng được hợp đồng (contract) kỳ vọng hay không.

### 1.1. Chu kỳ tiêu chuẩn là Red Green Refactor 

| Giai đoạn | Việc cần làm                                                                            | Trong ngữ cảnh CLI Node.js                                                                      |
| --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Red       | Viết một test nhỏ cho hành vi chưa tồn tại, chạy và xác nhận nó thất bại đúng cách.     | Ví dụ: test hàm parseArgs() nhận ["add", "note"] và mong đợi { command: "add", value: "note" }. |
| Green     | Viết lượng mã tối thiểu để toàn bộ test vượt qua.                                       | Tạo parseArgs() trả về đúng kết quả trên; chưa cần xử lý mọi lệnh hay lỗi phức tạp.             |
| Refactor  | Cải thiện cấu trúc, loại bỏ trùng lặp, đặt tên rõ hơn—mà không làm test chuyển sang đỏ. | Tách parser khỏi hàm main(), thêm kiểu JSDoc/TypeScript, đơn giản hóa nhánh xử lý.              |

+ Điểm mấu chốt là mỗi vòng chỉ xử lý một hành vi: test phải thất bại trước, rồi mã mới được thêm để làm nó vượt qua, sau đó mới refactor khi mọi test vẫn xanh.

### 1.2. Chu kỳ tiêu chuẩn là Red Green Refactor 
+ Các quy tắc xác thực (validation) ticket có thể được làm rõ ràng trước khi chúng bị phân tán khắp các trình xử lý CLI.
+ Tính bền vững của JSON và hành vi xử lý lỗi có thể được kiểm tra liên tục khi code thay đổi.
+ Các bài kiểm thử nhỏ cung cấp mục tiêu rõ ràng cho việc triển khai có sự hỗ trợ của AI và giảm rủi ro từ các thay đổi không liên quan.
+ Kiểm thử hồi quy **[(Regression testing)](https://www.testing.vn/regression-testing/)**  giúp xác nhận rằng việc tái cấu trúc không làm thay đổi hành vi mà người dùng phụ thuộc vào. 

## 2. Các mức độ kiểm thử

| Mức độ | Những gì nó xác minh | Ví dụ trong Ticket Manager | Ranh giới phụ thuộc điển hình |
| --- | --- | --- | --- |
| **Kiểm thử đơn vị (Unit test)** | Một đơn vị logic nhỏ trong môi trường cô lập | Từ chối một ticket có tiêu đề trống; lọc ticket theo trạng thái | Service/hàm với storage được thay thế bằng fake hoặc stub |
| **Kiểm thử tích hợp (Integration test)** | Nhiều thành phần thực tế hoạt động cùng nhau | Lưu một ticket vào file JSON tạm thời, tải lại và xác minh dữ liệu | Service + JSON storage; có thể kèm theo command wiring |
| **Kiểm thử đầu cuối (E2E test)** | Hành vi hiển thị với người dùng thông qua điểm đầu vào của chương trình | Spawn tiến trình CLI, chạy `tickets create`, sau đó chạy `tickets show <id>` và kiểm tra đầu ra cũng như dữ liệu đã lưu | Executable CLI thực tế, trình phân tích cú pháp đối số, service, hệ thống file |

## 3. Ma trận kiểm thử 

| Hạng mục | Kịch bản | Hành vi kỳ vọng | Mức độ đề xuất |
| --- | --- | --- | --- |
| **Create** | Các trường bắt buộc hợp lệ | Ticket được tạo với một ID duy nhất ổn định và được lưu | Unit + integration/E2E |
| **Create** | Tiêu đề trống hoặc chỉ có khoảng trắng | Đầu vào bị từ chối; không có ticket nào được lưu | Unit + E2E đại diện |
| **Create** | Thiếu đối số bắt buộc | CLI hiển thị lỗi hữu ích và trạng thái thoát không thành công | E2E |
| **Create** | Bỏ qua mô tả/thẻ tùy chọn | Sử dụng giá trị mặc định được tài liệu hóa hoặc từ chối đầu vào nhất quán | Unit; xác nhận spec trước |
| **List** | Không có bộ lọc | Trả về tất cả ticket theo thứ tự được tài liệu hóa | Unit + integration |
| **List** | Lọc theo trạng thái | Chỉ các ticket khớp mới được trả về | Unit |
| **List** | Lọc theo mức độ ưu tiên | Chỉ các ticket khớp mới được trả về | Unit |
| **List** | Lọc theo thẻ | Kết quả tuân theo quy tắc khớp thẻ được tài liệu hóa | Unit |
| **Show** | ID tồn tại | Hiển thị đúng chi tiết ticket | Unit/service + E2E đại diện |
| **Show** | ID không xác định | Hành vi "không tìm thấy" rõ ràng; file không bị hỏng | Unit + E2E đại diện |
| **Update** | ID tồn tại và trạng thái hợp lệ | Chỉ các trường dự định thay đổi được cập nhật và thay đổi được lưu | Unit + integration |
| **Update** | ID không xác định | Hành vi "không tìm thấy" rõ ràng; không có ticket nào vô tình được tạo | Unit |
| **Storage** | File không tồn tại | Tuân theo một chính sách lần chạy đầu tiên được tài liệu hóa (ví dụ: khởi tạo kho lưu trữ trống) | Integration |
| **Storage** | JSON bị lỗi cú pháp (malformed) | Lỗi rõ ràng, có thể hành động được; không âm thầm ghi đè file | Integration |
| **Storage** | Không thể đọc/ghi file | Báo cáo lỗi mà không tuyên bố thao tác đã thành công | Integration |
| **Data integrity** | Nhiều ticket tồn tại | Cập nhật một ticket không làm sửa đổi các ticket khác | Unit + integration |
| **Output** | Danh sách trống | Đầu ra dễ đọc giải thích rằng không có ticket nào khớp | E2E |
| **Exit behavior** | Lệnh thành công và thất bại | Trạng thái thoát phản ánh nhất quán thành công/thất bại | E2E |

### 4.Các sai lầm phổ biến và cách phòng tránh

| Sai lầm | Tại sao nó gây hại | Cách phòng tránh |
| --- | --- | --- |
| **Kiểm thử quá mức** | Bộ kiểm thử chậm và trùng lặp có thể làm cho việc thay đổi trở nên tốn kém mà không tăng thêm độ tin cậy. | Kiểm thử các rủi ro riêng biệt ở mức độ phù hợp; ưu tiên các trường hợp tập trung. |
| **Khẳng định (assertion) yếu** | Bài kiểm thử có thể trôi qua ngay cả khi hành vi bị sai. | Khẳng định chính xác các kết quả liên quan: dữ liệu trả về, trạng thái lưu trữ, đầu ra hoặc mã thoát. |
| **Kiểm thử chi tiết triển khai** | Việc tái cấu trúc làm hỏng bài kiểm thử mặc dù hành vi hiển thị với người dùng không đổi. | Khẳng định hợp đồng (contract), không phải tên hàm riêng tư hoặc thứ tự gọi nội bộ trừ khi thứ tự đó tự nó là một yêu cầu. |
| **Tin tưởng mù quáng vào AI** | AI có thể bịa ra hàm, bỏ qua yêu cầu hoặc thêm hành vi không an toàn. | Đọc diff, kiểm tra giả định, chạy kiểm thử và xác minh các tuyên bố bên ngoài. |
| **Chỉ kiểm thử các luồng suôn sẻ (happy paths)** | Các lỗi phổ biến sẽ đến tay người dùng. | Bao gồm đầu vào không hợp lệ, ID bị thiếu, dữ liệu lỗi cú pháp và lỗi I/O. |
| **Một bài kiểm thử khổng lồ** | Khó chẩn đoán lỗi và hành vi không rõ ràng. | Giữ các bài kiểm thử nhỏ và tập trung vào một hành vi. |
| **Bài kiểm thử trôi qua vì sai lý do** | Thiết lập bài test hoặc mock bị sai, nên hành vi kỳ vọng không bao giờ được thực thi. | Kiểm tra thông báo lỗi, tránh mock quá mức và bao gồm các kiểm tra integration/E2E khi hữu ích. |
| **Âm thầm sửa chữa JSON bị hỏng** | Có thể phá hủy dữ liệu người dùng có thể phục hồi. | Thất bại an toàn, bảo toàn file gốc và làm cho việc phục hồi trở nên rõ ràng. |
| **Bộ kiểm thử báo xanh nhưng lệnh bị lỗi** | Unit test có thể không thực thi điểm đầu vào hoặc phân tích cú pháp đối số. | Thêm các bài kiểm thử CLI cấp tiến trình đại diện và kiểm tra khói (smoke checks) thủ công. |