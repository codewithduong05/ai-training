# 1. Red Green Refactor 

| Giai đoạn | Việc cần làm                                                                            | Trong ngữ cảnh CLI Node.js                                                                      |
| --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Red       | Viết một test nhỏ cho hành vi chưa tồn tại, chạy và xác nhận nó thất bại đúng cách.     | Ví dụ: test hàm parseArgs() nhận ["add", "note"] và mong đợi { command: "add", value: "note" }. |
| Green     | Viết lượng mã tối thiểu để toàn bộ test vượt qua.                                       | Tạo parseArgs() trả về đúng kết quả trên; chưa cần xử lý mọi lệnh hay lỗi phức tạp.             |
| Refactor  | Cải thiện cấu trúc, loại bỏ trùng lặp, đặt tên rõ hơn—mà không làm test chuyển sang đỏ. | Tách parser khỏi hàm main(), thêm kiểu JSDoc/TypeScript, đơn giản hóa nhánh xử lý.              |

+ Điểm mấu chốt là mỗi vòng chỉ xử lý một hành vi: test phải thất bại trước, rồi mã mới được thêm để làm nó vượt qua, sau đó mới refactor khi mọi test vẫn xanh.


## 2. Áp Dụng Cho Node JS

Một CLI thường gồm các lớp có thể kiểm thử khác nhau:

+ Parser tham số: chuyển process.argv.slice(2) thành cấu trúc dữ liệu như { command, options, positionals }.

+ Logic lệnh: ví dụ addTask(), listTasks(), completeTask()—nên là hàm thuần hoặc phụ thuộc được tiêm vào.

+ Hiệu ứng bên ngoài: đọc/ghi file, gọi API, in ra console. Đây là phần nên mock hoặc inject dependency khi test.

+ Lớp CLI mỏng: nhận argv, gọi parser và logic, sau đó in kết quả hoặc trả exit code.

## 3.Ví dụ đơn giản: lệnh greet

Giả định: CLI tên mycli, chạy node mycli.js greet --name Lan sẽ in Hello, Lan!. Ta chưa viết toàn bộ CLI; chỉ test-drive hàm tạo thông điệp và parser tối thiểu.

1. <h3>Red: viết test thất bại</h3> 

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
2. <h3> Green: viết đủ để pass</h3>
   
    ```javascript
    // Tạo file `src/greet.js`:
    function buildGreeting({ name }) {
    return `Hello, ${name}!`;
    }

    module.exports = { buildGreeting };
    ```
    Chạy lại node --test; test giờ xanh.

2. <h3> Refactor: thêm hành vi kế tiếp</h3>
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
