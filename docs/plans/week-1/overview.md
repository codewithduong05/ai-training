# Tuần 1: Đào tạo AI — Sử dụng hiệu quả và tư duy phản biện

## 1. Mục đích

Xây dựng năng lực phán đoán cần thiết để sử dụng AI hiệu quả trong các tuần làm việc kỹ thuật tiếp theo. AI chỉ là cộng tác viên, không phải thẩm quyền cuối cùng; kỹ sư vẫn là người quyết định, đánh giá và xác minh.

## 2. Mục tiêu

Kết thúc Tuần 1, ứng viên có thể:

- Giải thích tư duy cốt lõi: AI là công cụ cộng tác; kỹ sư vẫn là kiến trúc sư và người đánh giá (reviewer).
- Áp dụng các câu hỏi tư duy phản biện vào đầu ra của AI, bao gồm mức độ hiểu biết, sự phù hợp, các giả định, rủi ro và việc xác minh độc lập.
- Áp dụng ba quy trình làm việc với AI vào một nhiệm vụ nghiên cứu thực tế:
	- **Đặt câu hỏi phân tầng (Layered Questioning):** Nghiên cứu → Tóm tắt/bối cảnh → Ví dụ → Xác thực.
	- **Khám phá giải pháp (Solution Exploration):** Xác định vấn đề → Khám phá các lựa chọn thay thế → So sánh sự đánh đổi → Lựa chọn dựa trên bối cảnh.
	- **Tinh chỉnh lặp (Iterative Refinement):** Đánh giá → Xác định vấn đề → Tinh chỉnh → Yêu cầu phản hồi → Xác thực.
- Nhận biết các ảo giác (hallucinations), tuyên bố không có căn cứ, API do AI tự bịa ra và đề xuất không phù hợp với repository.
- Nghiên cứu TDD và xây dựng chiến lược kiểm thử cho CLI Ticket Manager ở Tuần 2.

## 3. Phạm vi

### Trong phạm vi

- Đọc và áp dụng `slides-ai-training.md`.
- Nghiên cứu TDD, chu kỳ Đỏ–Xanh–Tái cấu trúc (Red–Green–Refactor) và kiểm thử đơn vị/tích hợp/đầu cuối (unit/integration/end-to-end).
- Xác định các trường hợp kiểm thử CLI cho các lệnh, xác thực đầu vào, lưu trữ JSON và các luồng lỗi.
- Ghi lại bằng chứng thực tế cho cả ba quy trình làm việc với AI.
- Xem xét nghiên cứu, sửa các tuyên bố không có căn cứ và chuẩn bị giải thích các phát hiện.

### Ngoài phạm vi

- Triển khai CLI Ticket Manager (Tuần 2).
- Tích hợp API Knowledge Base (Tuần 3).
- Hoàn thiện các kịch bản hỗ trợ Odoo (Tuần 4).
- Xây dựng phân tích hoặc tự động hóa (Tuần 5).
- Thêm hạ tầng production, cơ sở dữ liệu, giao diện người dùng (UI) hoặc framework agent.

## 4. Tài liệu nguồn

- `slides-ai-training.md` — Tư duy cốt lõi, tư duy phản biện, quy trình làm việc, ảo giác AI và bài tập.
- `../week-2/overview.md` — Các yêu cầu CLI mà phần nghiên cứu cần chuẩn bị.
- `../week-3/architecture.md` — Xác nhận định hướng dự kiến về TypeScript, CLI, HTTP và kiểm thử. Không triển khai nội dung Tuần 3 trong Tuần 1.

## 5. Sản phẩm bàn giao (Deliverables)

Tạo và duy trì các tệp sau:

| Sản phẩm | Mục đích | Bằng chứng yêu cầu |
| --- | --- | --- |
| [`docs/plans/week-1/deliverables/TDD/tdd.md`](docs/plans/week-1/deliverables/TDD/tdd.md) | Giải thích TDD và xác định chiến lược kiểm thử cho CLI Ticket Manager. | Các nguyên tắc TDD, ma trận kiểm thử, và cách xác minh dữ liệu kiểm thử trước khi triển khai. |
| [`docs/plans/week-1/deliverables/workflow/ai-workflow-evidence.md`](docs/plans/week-1/deliverables/workflow/ai-workflow-evidence.md) | Thể hiện cách áp dụng ba quy trình làm việc với AI. | Prompt thực tế, tóm tắt ngắn gọn đầu ra, phản hồi và lý do lựa chọn quy trình. |
| [`docs/plans/week-1/deliverables/assessment/self-assessment.md`](docs/plans/week-1/deliverables/assessment/self-assessment.md) | Chuẩn bị cho buổi đánh giá hoặc các câu hỏi vấn đáp. | Danh sách kiểm tra, câu hỏi ôn tập và đánh giá tự phản biện. |
