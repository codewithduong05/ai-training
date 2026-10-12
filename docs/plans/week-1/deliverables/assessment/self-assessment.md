# Tuần 1 — Tự đánh giá và Câu hỏi Ôn tập
Hoàn thành sau khi xem xét nghiên cứu và bằng chứng quy trình làm việc

## A. Checklist 


## B. Các câu hỏi cần trả lời bằng lời của chính bạn

### Business với AI
1. Tại sao AI là hỗ trợ chứ không phải là chủ sở hữu của quyết định kỹ thuật?
2. Năm câu hỏi bạn nên đặt ra trước khi chấp nhận đầu ra của AI là gì?
3. Sự khác biệt giữa Đặt câu hỏi phân tầng, Khám phá giải pháp và Tinh chỉnh lặp là gì?
4. Đưa ra một ví dụ về tuyên bố của AI mà bạn sẽ xác minh độc lập.

### TDD và Kiểm thử
5. Điều gì làm cho một bài kiểm thử ở trạng thái "Đỏ" trong chu kỳ Đỏ–Xanh–Tái cấu trúc? Tại sao bạn nên kiểm tra lý do thất bại?
6. Sự khác biệt giữa kiểm thử đơn vị (unit test) và kiểm thử tích hợp (integration test) cho lưu trữ JSON là gì?
7. Đưa ra một kiểm thử đầu cuối (E2E test) cho `tickets create` hoặc `tickets show <id>`.
8. Tại sao khẳng định "hàm đã không ném ra lỗi (did not throw)" thường là một khẳng định (assertion) yếu?
9. Bạn sẽ kiểm thử một file JSON bị hỏng như thế nào mà không có nguy cơ phá hủy dữ liệu gốc?
10. Điều gì vẫn có thể bị sai khi tất cả các bài kiểm thử hiện tại đều trôi qua (pass)?

### Mã do AI tạo ra
11. Bạn sẽ kiểm tra như thế nào để đảm bảo AI không bịa ra API của một package hoặc yêu cầu của CLI?
12. Bạn sẽ làm gì nếu AI tạo ra một triển khai lớn trước khi viết các bài kiểm thử?
13. Bạn sẽ inspect diff (phần chênh lệch mã) như thế nào và quyết định xem một đề xuất của AI có thuộc phạm vi hay không?

## C. Gợi ý đáp án (không sao chép nguyên văn)
Sử dụng các ý này để kiểm tra tính đầy đủ của câu trả lời, không phải để học thuộc lòng:
- **Vai trò AI:** AI đề xuất và giải thích; kỹ sư sở hữu bối cảnh, quyết định, xác minh và bảo trì.
- **Đỏ:** Một bài kiểm thử tập trung thất bại vì hành vi bắt buộc bị thiếu, không phải do bản thân bài test bị lỗi.
- **Xanh:** Phần triển khai nhỏ nhất làm cho bài kiểm thử trôi qua.
- **Tái cấu trúc:** Cải thiện cấu trúc mà không thay đổi hành vi mong đợi; chạy lại kiểm thử.
- **Unit:** Logic cô lập, chẳng hạn như xác thực một tiêu đề trống.
- **Integration:** Các thành phần phối hợp, chẳng hạn như ghi và đọc một file JSON tạm thời.
- **E2E:** Tiến trình CLI thực tế, đối số, đầu ra, mã thoát và tính bền vững.
- **Xác minh AI:** Truy vết yêu cầu, kiểm tra giả định, chạy kiểm thử, inspect diff, xác minh tuyên bố bên ngoài và tự giải thích mã cuối cùng.
- **Giới hạn:** Yêu cầu không chính xác, thiếu trường hợp kiểm thử, khẳng định yếu và hành vi nằm ngoài ranh giới kiểm thử có thể không bị phát hiện.

