# webChatOnline2

## Giới thiệu
`webChatOnline2` là một ứng dụng chat trực tuyến sử dụng công nghệ **MERN Stack** (MongoDB, Express, React, Node.js) và **Socket.IO** để giao tiếp theo thời gian thực.

## Cấu trúc thư mục

```
webChatOnline2/
├── backend/              # Mã nguồn Node.js/Express
│   ├── config/           # Cấu hình MongoDB và các biến môi trường
│   ├── controllers/      # Xử lý logic
│   ├── middleware/       # Middleware xác thực
│   ├── models/           # Schema Mongoose
│   ├── routes/           # API routes
│   ├── socket/           # Cấu hình Socket.IO
│   ├── utils/            # Các hàm tiện ích
│   ├── uploads/          # Thư mục lưu file upload
│   ├── .env              # File biến môi trường
│   ├── package.json      # Dependencies backend
│   └── server.js         # Entry point
└── frontend/             # Mã nguồn React
    ├── public/           # Assets tĩnh
    ├── src/
    │   ├── assets/       # Hình ảnh, styles
    │   ├── components/   # React components
    │   ├── context/      # Context API
    │   ├── hooks/        # Custom hooks
    │   ├── pages/        # Các trang chính
    │   ├── services/     # API services
    │   ├── utils/        # Các hàm tiện ích
    │   ├── App.jsx       # Component gốc
    │   └── main.jsx      # Entry point
    ├── package.json      # Dependencies frontend
    └── tailwind.config.js # Cấu hình Tailwind
```

## Hướng dẫn cài đặt

### Backend
1. Cài đặt các dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Cấu hình file `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
3. Chạy server:
   ```sh
   npm start
   ```

### Frontend
1. Cài đặt dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Chạy ứng dụng React:
   ```sh
   npm run dev
   ```

## Công nghệ sử dụng
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.IO, JSON Web Token (JWT)
- **Frontend**: React.js, Vite, Tailwind CSS, React Context API

## Liên hệ
Nếu có bất kỳ câu hỏi hoặc vấn đề nào, vui lòng liên hệ qua email hoặc mở issue trên GitHub.
