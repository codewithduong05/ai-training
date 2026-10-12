# Kiến trúc Tuần 1: Nghiên cứu và Xác minh có Hỗ trợ của AI

## Mục đích
Tuần 1 là một quy trình học tập và thu thập bằng chứng, không phải là kiến trúc runtime của phần mềm. Tài liệu này mô tả cách tài liệu nguồn, sự cộng tác với AI, xác minh độc lập và các sản phẩm bàn giao kết hợp với nhau.

## Luồng học tập
```text
┌────────────────────────────┐
 │ Tài liệu nguồn             │
 │ slides-ai-training.md      │
 │ Yêu cầu CLI Tuần 2         │
 └─────────────┬──────────────┘
               │
               ▼
 ┌────────────────────────────┐
 │ Xác định câu hỏi nghiên cứu│
 │ TDD cho CLI lưu trữ JSON   │
 └─────────────┬──────────────┘
               │
               ▼
 ┌────────────────────────────┐
 │ Quy trình cộng tác với AI  │
 │ 1. Đặt câu hỏi phân tầng   │
 │ 2. Khám phá giải pháp      │
 │ 3. Tinh chỉnh lặp          │
 └─────────────┬──────────────┘
               │
               ▼
 ┌────────────────────────────┐
 │ Con người review & xác minh│
 │ Có khớp yêu cầu không?     │
 │ Giả định đã rõ ràng chưa?  │
 │ Tuyên bố có căn cứ không?  │
 │ Ví dụ có mạch lạc không?   │
 └─────────────┬──────────────┘
               │
               ▼
 ┌────────────────────────────┐
 │ Sản phẩm bàn giao Tuần 1   │
 │ tdd-cli-research.md        │
 │ ai-workflow-evidence.md    │
 │ self-assessment.md         │
 └─────────────┬──────────────┘
               │
               ▼
 ┌────────────────────────────┐
 │ Sẵn sàng cho Tuần 2        │
 │ Ma trận test + Tư duy TDD  │
 └────────────────────────────┘