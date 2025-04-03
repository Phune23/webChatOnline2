module.exports = (io) => {
  // Lưu trữ trạng thái người dùng online
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Xử lý khi user kết nối vào
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
      onlineUsers.set(userData._id, socket.id);
      
      // Thông báo cho tất cả user biết danh sách online đã thay đổi
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });
    
    // Tham gia vào phòng chat
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });
    
    // Xử lý khi gửi tin nhắn mới
    socket.on('new-message', (newMessage) => {
      let chat = newMessage.chat;
      
      if (!chat.participants) return;
      
      // Gửi tin nhắn đến tất cả người tham gia trò chuyện
      chat.participants.forEach((participant) => {
        if (participant._id === newMessage.sender._id) return;
        
        socket.in(participant._id).emit('message-received', newMessage);
      });
    });
    
    // Xử lý khi người dùng đang nhập
    socket.on('typing', (chatId) => {
      socket.in(chatId).emit('typing', chatId);
    });
    
    socket.on('stop-typing', (chatId) => {
      socket.in(chatId).emit('stop-typing', chatId);
    });
    
    // Xử lý khi ngắt kết nối
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      
      // Tìm và xóa user khỏi danh sách online
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          // Thông báo cho tất cả user biết danh sách online đã thay đổi
          io.emit('online-users', Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });
};