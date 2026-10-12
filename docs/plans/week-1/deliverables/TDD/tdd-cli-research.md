
## 1. Áp Dụng Cho Node JS

Một CLI thường gồm các lớp có thể kiểm thử khác nhau:

+ Parser tham số: chuyển process.argv.slice(2) thành cấu trúc dữ liệu như { command, options, positionals }.

+ Logic lệnh: ví dụ addTask(), listTasks(), completeTask()—nên là hàm thuần hoặc phụ thuộc được tiêm vào.

+ Hiệu ứng bên ngoài: đọc/ghi file, gọi API, in ra console. Đây là phần nên mock hoặc inject dependency khi test.

+ Lớp CLI mỏng: nhận argv, gọi parser và logic, sau đó in kết quả hoặc trả exit code.

## 2.Ví dụ đơn giản: lệnh greet

Giả định: CLI tên mycli, chạy node mycli.js greet --name Lan sẽ in Hello, Lan!. Ta chưa viết toàn bộ CLI; chỉ test-drive hàm tạo thông điệp và parser tối thiểu.

  +  <h4>Red: viết test thất bại</h4> 

      ```javascript
      // Tạo file `test/greet.test.js`:
      const assert = require("node:assert/strict");
      const { test } = require("node:test");
      const { buildGreeting } = require("../src/greet");

      test("buildGreeting uses the provided name", () => {
      assert.equal(buildGreeting({ name: "Lan" }), "Hello, Lan!");
      });
      ```

      Chạy:
      ```javascript 
       node --test
      ```
      Output : Test này sẽ thất bại vì src/greet.js chưa tồn tại. 
  + <h4> Green: viết đủ để pass</h4>
     
      ```javascript
      // Tạo file `src/greet.js`:
      function buildGreeting({ name }) {
      return `Hello, ${name}!`;
      }

      module.exports = { buildGreeting };
      ```
      Chạy lại node --test; test giờ xanh.

  + <h4> Refactor: thêm hành vi kế tiếp</h4>
       Bây giờ chọn một hành vi nhỏ tiếp theo: khi không có --name, dùng world.

      
      ```javascript
      // Tạo file `test/greet.test.js`:
     
      test("buildGreeting defaults to world when name is missing", () => {
      assert.equal(buildGreeting({}), "Hello, world!");
      });
      ```
      Sau đó viết đủ mã:
       
      ```javascript
      function buildGreeting({ name = "world" } = {}) {
          return `Hello, ${name}!`;
          }
      ```
      Khi hai test đều xanh, bạn có thể refactor—ví dụ đổi tên biến, thêm JSDoc, hoặc chuyển sang ESM—mà không thay đổi hành vi đã được kiểm chứng.
    * Kết nối với CLI thực tế  <br>
   Phần gọi CLI có thể giữ rất mỏng:
   
    ```javascript
        // src/cli.js
    const { buildGreeting } = require("./greet");

    function parseArgs(argv) {
    const [command, ...rest] = argv;
    const nameIndex = rest.indexOf("--name");
    const name = nameIndex !== -1 ? rest[nameIndex + 1] : undefined;

    return { command, name };
    }

    function run(argv, { log = console.log } = {}) {
    const { command, name } = parseArgs(argv);

    if (command === "greet") {
        log(buildGreeting({ name }));
        return 0;
    }

    log("Unknown command");
    return 1;
    }

    module.exports = { run };
      ```
## 3.Lợi ích
+ Yêu cầu rõ ràng hơn: viết test trước buộc bạn xác định đầu vào, đầu ra và lỗi trước khi code.
+ Phản hồi nhanh: với unit test, bạn biết ngay parser hay logic lệnh có đúng không mà không phải gõ lệnh CLI thủ công nhiều lần.

+ Refactor an toàn hơn: bộ test xanh là mạng lưới bảo vệ khi tách module, đổi tên hàm, hoặc chuyển CommonJS sang ESM.

+ Thiết kế tốt hơn: CLI dễ test thường tách được parser, business logic và I/O—một kiến trúc có lợi ngay cả ngoài mục đích kiểm thử.

+ Giảm test “false positive”: bước Red xác nhận test thực sự có khả năng thất bại khi hành vi chưa có.

## 4.Giới hạn
+ Không thay thế kiểm thử tích hợp/E2E: unit test parseArgs và buildGreeting không chứng minh node mycli.js greet --name Lan hoạt động đúng trên shell thực tế, bao gồm PATH, shebang, exit code và encoding.

+ Có thể quá tập trung vào unit: nếu chỉ test hàm nhỏ, bạn có thể bỏ sót lỗi ghép nối giữa parser, command handler và file system.

+ Chi phí ban đầu cao hơn: với script CLI rất ngắn, vài lệnh dùng một lần, hoặc prototype cần khám phá yêu cầu, TDD có thể cảm thấy cồng kềnh.

+ Test có thể sai hướng thiết kế: test quá gắn với chi tiết triển khai—ví dụ kiểm tra thứ tự thuộc tính object hay private function—sẽ khiến refactor khó khăn.

+ I/O và side effects vẫn cần chiến lược riêng: đọc/ghi file, network, environment variable và signal xử lý cần mock cẩn thận hoặc test integration riêng.

## 5.Giả định và điểm cần kiểm chứng
Những giả định trong ví dụ trên cần xác nhận trước khi mở rộng:

+ Runtime và module system: ví dụ dùng CommonJS với node --test; nếu dự án dùng ESM, cần đổi require/module.exports thành import/export và kiểm tra "type": "module" trong package.json.

+ Cú pháp test runner: node:test và node:assert/strict phù hợp với Node hiện đại; cần kiểm tra phiên bản Node tối thiểu của dự án.

+ Hành vi tham số: ví dụ giả định --name luôn có giá trị ngay sau nó. Cần quyết định và test các trường hợp --name thiếu giá trị, --name=Lan, tham số trùng, hoặc giá trị có khoảng trắng.

+ Output stream: giả định thông điệp bình thường đi ra stdout; lỗi, cảnh báo và progress có thể nên đi ra stderr.

+ Exit code: ví dụ trả 0 cho thành công và 1 cho lệnh không hợp lệ; cần kiểm chứng quy ước exit code mà người dùng hoặc CI của bạn kỳ vọng.

+ Cross-platform: đường dẫn, quyền file, shebang và cách gọi binary khác nhau giữa Windows, macOS và Linux; cần test trên môi trường mục tiêu.

+  Phạm vi TDD: nên dùng TDD mạnh cho parser và logic thuần; với phần khởi động CLI, file I/O và tương tác terminal, kết hợp integration test thường thực tế hơn.


