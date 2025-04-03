require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const messageRoutes = require('./routes/message.routes');

// Middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Thêm route handler cho đường dẫn gốc
app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng đến với API WebChat Online' });
});

// Phục vụ frontend trong môi trường production
if (process.env.NODE_ENV === 'production') {
  // Phục vụ các file tĩnh từ thư mục build của frontend
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Mọi route không được xử lý sẽ trả về index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Lỗi:', err);
  res.status(500).json({ message: 'Lỗi server', error: err.message });
});

// Route không tìm thấy
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy đường dẫn yêu cầu' });
});

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Socket.io connection
require('./socket/socket')(io);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });