# Hệ Thống Quản Lý Form - Form Management System

Đây là một ứng dụng quản lý form cho phép Admin tạo, sửa, xóa các form với nhiều loại trường dữ liệu (Text, Number, Date, Color, Select) và cấu hình validation. Nhân viên có thể xem danh sách các form đang active và tiến hành điền thông tin, hệ thống sẽ thực hiện validate tự động ở client và server, lưu lại vào database.

## Công Nghệ Sử Dụng

- **Frontend**: React.js (Vite), CSS thuần (thiết kế theo phong cách dark theme, glassmorphism hiện đại).
- **Backend**: Express.js, Node.js.
- **Cơ sở dữ liệu**: MongoDB (dùng Mongoose).
- **Module Test**: Jest, Supertest (dùng cho backend validation logic).

## Cấu Trúc Dự Án

Dự án bao gồm 2 phần chính:
- Thư mục `server/`: Chứa mã nguồn backend Node.js (REST API, validation module, mongoose schema).
- Thư mục `client/`: Chứa mã nguồn frontend React.js.

## Hướng Dẫn Cài Đặt và Chạy Ứng Dụng

### 1. Yêu cầu hệ thống
- Cài đặt Node.js (phiên bản >= 18).
- Cài đặt MongoDB và đảm bảo MongoDB đang chạy ở cổng mặc định `27017`.

### 2. Thiết lập Backend (Server)

Mở terminal ở thư mục root của dự án, di chuyển vào thư mục `server`:

```bash
cd server
npm install
```

Kiểm tra nội dung file `.env` trong thư mục `server` (mặc định đã được tạo):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/form_management
NODE_ENV=development
```

Chạy server backend:
```bash
npm run dev
```
(Server sẽ chạy ở địa chỉ: `http://localhost:5000`)

### 3. Thiết lập Frontend (Client)

Mở một terminal mới, di chuyển vào thư mục `client`:

```bash
cd client
npm install
```

Chạy frontend app:
```bash
npm run dev
```
(Frontend sẽ tự động mở hoặc chạy ở địa chỉ: `http://localhost:5173`)

### 4. Chạy bằng Docker Compose (Khuyên dùng cho Test)

Dự án đã được đóng gói sẵn Docker. Nếu bạn có Docker cài đặt, chỉ cần đứng ở thư mục gốc của dự án (chứa file `docker-compose.yml`) và chạy:

```bash
docker-compose up -d --build
```

- **Frontend** sẽ chạy ở: `http://localhost:5173`
- **Backend API** sẽ chạy ở: `http://localhost:5000`
- **MongoDB** sẽ chạy nội bộ qua port `27017`

*Lưu ý: Bạn có thể chạy lệnh `node server/seed.js` để đẩy data mẫu nếu cần thiết sau khi container backend và mongo đã lên.*

## Chạy Unit Test Backend

Module validate dữ liệu (`fieldValidator.js`) đã được viết riêng để tái sử dụng và đảm bảo không bị lỗi, dễ test.

Mở terminal ở thư mục `server` và chạy lệnh:
```bash
npm test
```

## Tính Năng Đã Triển Khai

**Giao diện Admin (Quản trị):**
- Quản lý danh sách Form (Tạo mới, sửa tên, đổi mô tả, đổi thứ tự, bật tắt trạng thái Active/Draft, xóa Form).
- Thêm các trường dữ liệu (Field) cho từng Form (Hỗ trợ 5 loại: text, number, date, color, select).
- Tùy biến Validation của field (max length, min, max range, options của select).

**Giao diện Nhân viên SW:**
- Xem các Form đang mở (Active), được sắp xếp theo thứ tự `order` quy định.
- Điền dữ liệu vào form, chọn màu (Color picker), chọn ngày (Date picker),...
- Xem lại lịch sử các form đã submit cùng với chi tiết trả lời.

## Điểm Nổi Bật

- **UI/UX**: Áp dụng triệt để Dark Theme và Glassmorphism (Kính mờ) tạo cảm giác ứng dụng rất premium, hiện đại.
- **Kiến trúc code rõ ràng**: Backend phân chia theo Controller, Routes, Validator, Middleware (Error handler xử lý thống nhất).
- **Validation đồng nhất**: Logic validation được tách riêng ra module (như đề bài gợi ý), sử dụng cho cả validation của Request (lúc submit form) và dùng trong Unit Test.
