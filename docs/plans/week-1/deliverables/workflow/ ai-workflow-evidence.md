# Tuần 1 — Bằng chứng Quy trình làm việc với AI
Hãy điền vào đây các tương tác thực tế bạn đã thực hiện. Không bịa ra prompt, phản hồi của AI, tên model, dấu thời gian hoặc kết quả xác minh. Tóm tắt ngắn gọn là đủ; chỉ bao gồm toàn bộ transcript khi hữu ích và an toàn.

## Metadata phiên làm việc
- **Ngày:** [Điền vào]
- **Công cụ/model AI đã dùng:** [Điền vào, nếu biết]
- **Commit/branch của Repository (nếu có):** [Điền vào]
- **Nhiệm vụ nghiên cứu:** Chiến lược TDD và kiểm thử cho CLI Ticket Manager Tuần 2

## Nền tảng tư duy phản biện
- **Hiểu biết của tôi về vai trò của AI:** [Điền vào]
- **Ba rủi ro tôi sẽ tích cực kiểm tra:** [Điền vào]
- **Cách tôi sẽ xác minh đầu ra:** [Điền vào]

---

## Quy trình 1 — Đặt câu hỏi Phân tầng (Layered Questioning)
**Mục đích:** Học tiến bộ từ một khái niệm chưa quen đến kế hoạch cụ thể cho dự án và sau đó xác thực nó.

**Giai đoạn A — Nghiên cứu**
- Prompt thực tế đã dùng: [Dán prompt]
- Tóm tắt câu trả lời liên quan của AI: [Tóm tắt bằng lời của bạn]
- Những gì tôi đã học: [Điền vào]
- Các tuyên bố cần xác minh: [Điền vào]

**Giai đoạn B — Tóm tắt / Bối cảnh dự án**
- Bối cảnh được cung cấp: CLI Ticket Manager Tuần 2, lưu trữ JSON, các lệnh, bộ lọc, các trường hợp lỗi.
- Prompt thực tế đã dùng: [Dán prompt]
- Những gì thay đổi khi thêm bối cảnh dự án: [Điền vào]
- Các giả định AI đã đưa ra: [Điền vào]

**Giai đoạn C — Ví dụ**
- Prompt thực tế đã dùng: [Dán prompt]
- Ví dụ được yêu cầu: [Điền vào]
- Nó chỉ mang tính minh họa hay đã được chạy trong repository? [Nêu rõ ràng]
- Những gì tôi đã kiểm tra: [Điền vào]

**Giai đoạn D — Xác thực**
- Prompt thực tế đã dùng: [Dán prompt]
- Các trường hợp biên bị thiếu hoặc khẳng định (assertion) yếu được xác định: [Điền vào]
- Những gì tôi chấp nhận/từ chối: [Điền vào]
- Xác minh độc lập/nguồn: [Điền vào, hoặc nêu là chưa xác minh]

**Kết quả**
- **Hiểu biết cuối cùng:** [Điền vào]
- **Sự không chắc chắn còn lại:** [Điền vào]

---

## Quy trình 2 — Khám phá Giải pháp (Solution Exploration)
**Mục đích:** So sánh các lựa chọn thực tế và chọn lựa theo bối cảnh dự án thực tế.

**Vấn đề và ràng buộc**
- **Quyết định cần đưa ra:** Trình chạy test (test runner) nào sẽ sử dụng cho CLI TypeScript sắp tới, trừ khi yêu cầu của repository đã định đoạt điều đó.
- **Ràng buộc:** CLI nhỏ, lưu trữ JSON, thực hành TDD, thời gian có hạn, thiết lập đơn giản dễ bảo trì.
- **Ràng buộc tìm thấy trong repository:** [Ghi lại đường dẫn và sự thật]

**Khám phá**
- Prompt thực tế đã dùng: [Dán prompt]
- **Lựa chọn A:** [Tên, điểm mạnh, điểm yếu]
- **Lựa chọn B:** [Tên, điểm mạnh, điểm yếu]
- **Tiêu chí so sánh:** nỗ lực thiết lập, mức độ phù hợp với TypeScript, kiểm thử CLI, mock, bảo trì, khả năng tương thích với hướng đi của repository.
- Những gì AI bỏ sót hoặc giả định: [Điền vào]

**Quyết định**
- **Lựa chọn đã chọn:** [Điền vào]
- **Tại sao nó phù hợp với bối cảnh này:** [Điền vào]
- **Sự đánh đổi được chấp nhận:** [Điền vào]
- **Rủi ro chính hoặc điều kiện có thể thay đổi quyết định:** [Điền vào]
- Tôi đã cài đặt gói hoặc sửa đổi mã dự án chưa? [Có/Không; Tuần 1 thường chỉ là nghiên cứu]

---

## Quy trình 3 — Tinh chỉnh Lặp (Iterative Refinement)
**Mục đích:** Cải thiện một bản nháp dựa trên phản hồi cụ thể và xác thực các thay đổi.

**Bản nháp ban đầu**
- File/phiên bản đã review: `deliverables/tdd-cli-research.md`
- Prompt review thực tế: [Dán prompt]
- Các vấn đề chính AI xác định: [Liệt kê kèm mức độ nghiêm trọng]

**Review và thay đổi của tôi**
| Vấn đề | Quyết định của tôi | Thay đổi đã thực hiện / Lý do | Xác minh |
|---|---|---|---|
| [Vấn đề 1] | Chấp nhận / Từ chối / Trì hoãn | [Điền vào] | [Cách kiểm tra] |
| [Vấn đề 2] | Chấp nhận / Từ chối / Trì hoãn | [Điền vào] | [Cách kiểm tra] |
| [Vấn đề 3] | Chấp nhận / Từ chối / Trì hoãn | [Điền vào] | [Cách kiểm tra] |

**Review lần hai**
- Prompt theo dõi thực tế: [Dán prompt]
- Những gì đã cải thiện: [Điền vào]
- Những gì vẫn chưa giải quyết: [Điền vào]
- Phương pháp xác minh cuối cùng: [So sánh repository, tài liệu đáng tin cậy, lập luận, v.v.]

**Kết quả**
- **Cải thiện quan trọng nhất:** [Điền vào]
- **Đề xuất tôi đã từ chối và lý do:** [Điền vào]
- **Những gì tôi học được về giới hạn của việc review bằng AI:** [Điền vào]

---

## Checklist chất lượng bằng chứng
- [ ] Các prompt phản ánh tương tác thực tế.
- [ ] Tôi đã ghi lại các tóm tắt ngắn gọn thay vì tuyên bố mọi phát ngôn của AI đều đúng.
- [ ] Ít nhất một giả định, sự bỏ sót hoặc ảo giác tiềm ẩn được ghi lại.
- [ ] Tôi phân biệt được "AI đề xuất điều này" và "Tôi đã xác minh độc lập điều này".
- [ ] Ít nhất một lần sửa đổi sau khi review được ghi lại.
- [ ] Tôi không để lộ mật khẩu, token, dữ liệu người dùng riêng tư hoặc bí mật production.
- [ ] Tôi có thể giải thích các quyết định cuối cùng bằng lời của chính mình.