# 📝 Yêu Cầu Dự Án: **Web Chat Online**

## 1. 📌 Tổng Quan Dự Án
- **Tên dự án:** `webchatonline2`
- **Mô tả:**  
  Ứng dụng web chat trực tuyến hỗ trợ nhắn tin theo thời gian thực, cho phép người dùng đăng ký, đăng nhập, tìm kiếm bạn bè, kết bạn, và trò chuyện.

---

## 2. ⚙️ Công Nghệ Sử Dụng

### **🔹 Backend**
- **Node.js + Express** → Xây dựng API & xử lý logic backend.
- **MongoDB + Mongoose** → Lưu trữ dữ liệu trên MongoDB Atlas.
- **Socket.io** → Hỗ trợ giao tiếp real-time.
- **JWT & Cookie-Parser** → Xác thực người dùng bằng JWT.
- **Multer** → Hỗ trợ upload hình ảnh và file.
- **Bcrypt.js** → Mã hóa mật khẩu.
- **Dotenv** → Quản lý biến môi trường.

### **🔹 Frontend**
- **React.js** → Xây dựng giao diện người dùng.
- **Tailwind CSS + ShadCN UI** → Thiết kế UI đẹp, hiện đại.
- **DaisyUI** *(tùy chọn)* → Hỗ trợ giao diện chat.
- **Emoji Mart** → Hỗ trợ chèn emoji vào tin nhắn.
- **Axios** → Gửi request API.

### **🔹 Công Cụ Phát Triển & Triển Khai**
- **Nodemon** → Hỗ trợ phát triển backend.
- **PostCSS & Autoprefixer** → Tối ưu CSS.
- **Render** → Deploy ứng dụng.

---

## 3. 🚀 Chức Năng Chính

### **🔹 Xác Thực & Quản Lý Người Dùng**
- Đăng ký, đăng nhập bằng JWT & Cookie.
- Đăng xuất, bảo vệ API với middleware xác thực.

### **🔹 Tính Năng Chat**
- Tìm kiếm và kết bạn.
- Danh sách chat với bạn bè.
- Gửi & nhận tin nhắn real-time.
- Hỗ trợ gửi emoji trong tin nhắn.
- Hiển thị trạng thái online/offline của bạn bè.

### **🔹 Giao Diện Người Dùng (UI/UX)**
- Navigation gồm:
  - 📌 **Tài khoản cá nhân**
  - 🔍 **Tìm kiếm bạn bè**
  - 👥 **Danh sách bạn bè**
  - 💬 **Danh sách chat**
  - 🚪 **Đăng xuất**
- Xử lý lỗi với `try-catch`, hiển thị thông báo lỗi rõ ràng.

### **🔹 Lưu Trữ Dữ Liệu**
- Dữ liệu người dùng & tin nhắn được lưu trên **MongoDB Atlas**.

### **🔹 Triển Khai**
- Ứng dụng sẽ được **deploy trên Render**.

---

## 4. 📦 Danh Sách Thư Viện Cần Sử Dụng

```json
{
  "@emoji-mart/data": "^1.2.1",
  "@emoji-mart/react": "^1.1.1",
  "axios": "^1.8.1",
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.6",
  "dotenv": "^16.4.5",
  "emoji-mart": "^5.6.0",
  "express": "^4.19.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.3.2",
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.5",
  "autoprefixer": "^10.4.19",
  "nodemon": "^3.1.0",
  "postcss": "^8.4.38",
  "tailwindcss": "^3.4.3"
}
