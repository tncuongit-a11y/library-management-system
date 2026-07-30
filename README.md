\# 📚 Library Management System



Hệ thống Quản lý Mượn Sách toàn diện được xây dựng theo kiến trúc \*\*Clean Architecture\*\* dành cho Backend và \*\*Component-Based\*\* dành cho Frontend. Dự án phục vụ việc quản lý thư viện cơ bản bao gồm: Sách, Độc giả, Nhà xuất bản, Nhân viên và Theo dõi quy trình Mượn/Trả sách.



\## 🚀 Công nghệ sử dụng



\### Backend (RESTful API)

\- \*\*Node.js \& Express.js\*\*: Nền tảng xây dựng Server.

\- \*\*MongoDB \& Mongoose\*\*: Cơ sở dữ liệu NoSQL và ODM.

\- \*\*JWT \& bcrypt\*\*: Xác thực và mã hóa mật khẩu an toàn.

\- \*\*express-validator\*\*: Validate dữ liệu đầu vào.

\- \*\*dotenv, cors\*\*: Quản lý biến môi trường và cấu hình resource sharing.



\### Frontend (Single Page Application)

\- \*\*Vue 3 (Composition API)\*\*: Framework UI chính.

\- \*\*Vite\*\*: Build tool siêu tốc.

\- \*\*Vue Router\*\*: Điều hướng trang (SPA).

\- \*\*Pinia\*\*: Quản lý State (Authentication).

\- \*\*Axios\*\*: HTTP Client gọi API (tích hợp Interceptors).

\- \*\*Bootstrap 5\*\*: Xây dựng giao diện Responsive nhanh chóng.



\---



\## 📂 Cấu trúc thư mục



```text

library-management-system/

│

├── backend/                  # Chứa mã nguồn Server Node.js

│   ├── app/

│   │   ├── config/           # Cấu hình hệ thống (DB, JWT, Port)

│   │   ├── controllers/      # Xử lý Request / Response

│   │   ├── middlewares/      # Authentication, Error Handler, Validation

│   │   ├── models/           # Mongoose Schemas

│   │   ├── routes/           # Định tuyến API

│   │   ├── services/         # Business Logic (Tương tác DB)

│   │   └── utils/            # Các tiện ích (ApiError)

│   ├── seed.js               # Script tạo dữ liệu mẫu

│   └── server.js             # Entry point khởi chạy Server

│

└── frontend/                 # Chứa mã nguồn Web Vue 3

&#x20;   ├── src/

&#x20;   │   ├── assets/           # CSS, hình ảnh

&#x20;   │   ├── components/       # Các component dùng chung (Pagination...)

&#x20;   │   ├── layouts/          # Giao diện khung (DefaultLayout)

&#x20;   │   ├── router/           # Định tuyến Frontend

&#x20;   │   ├── services/         # Gọi API qua Axios

&#x20;   │   ├── stores/           # Pinia store (quản lý đăng nhập)

&#x20;   │   └── views/            # Các trang giao diện (Sách, Độc giả...)

&#x20;   └── index.html

