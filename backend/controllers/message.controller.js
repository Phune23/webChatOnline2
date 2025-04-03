const Message = require('../models/message.model');
const User = require('../models/user.model');
const Chat = require('../models/chat.model');

/**
 * @desc    Send a new message
 * @route   POST /api/messages
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({ message: 'Nội dung tin nhắn và chatId là bắt buộc' });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat không tồn tại' });
    }

    // Check if user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Bạn không phải là thành viên của chat này' });
    }

    // Create new message
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId
    };

    let message = await Message.create(newMessage);

    // Populate message with sender information
    message = await Message.findById(message._id)
      .populate('sender', 'username avatar')
      .populate('chat');

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Lỗi khi gửi tin nhắn', error: error.message });
  }
};

/**
 * @desc    Get all messages for a chat
 * @route   GET /api/messages/:chatId
 * @access  Private
 */
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat không tồn tại' });
    }

    // Check if user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Bạn không phải là thành viên của chat này' });
    }

    // Get messages for the chat with pagination
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Message.countDocuments({ chat: chatId });

    res.status(200).json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat không tồn tại' });
    }
    
    res.status(500).json({ message: 'Lỗi khi tải tin nhắn', error: error.message });
  }
};

/**
 * @desc    Mark messages as read
 * @route   PUT /api/messages/read/:chatId
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat không tồn tại' });
    }

    // Check if user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Bạn không phải là thành viên của chat này' });
    }

    // Mark all unread messages in this chat as read by the current user
    await Message.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: req.user._id }, // Only mark messages not sent by the current user
        readBy: { $ne: req.user._id } // Only mark messages not already read by the user
      },
      { 
        $addToSet: { readBy: req.user._id } 
      }
    );

    res.status(200).json({ message: 'Đã đánh dấu tin nhắn đã đọc' });
  } catch (error) {
    console.error('Mark as read error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat không tồn tại' });
    }
    
    res.status(500).json({ message: 'Lỗi khi đánh dấu tin nhắn đã đọc', error: error.message });
  }
};

/**
 * @desc    Get unread message count
 * @route   GET /api/messages/unread
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  try {
    // Find all chats where the user is a participant
    const chats = await Chat.find({ participants: req.user._id });
    const chatIds = chats.map(chat => chat._id);

    // Count unread messages for each chat
    const unreadCounts = await Promise.all(
      chatIds.map(async (chatId) => {
        const count = await Message.countDocuments({
          chat: chatId,
          sender: { $ne: req.user._id },
          readBy: { $ne: req.user._id }
        });

        return {
          chatId,
          count
        };
      })
    );

    // Calculate total unread count
    const totalUnread = unreadCounts.reduce((total, current) => total + current.count, 0);

    res.status(200).json({
      totalUnread,
      chats: unreadCounts
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Lỗi khi tải số lượng tin nhắn chưa đọc', error: error.message });
  }
};

/**
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Tin nhắn không tồn tại' });
    }

    // Check if user is the sender of the message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn chỉ có thể xóa tin nhắn của mình' });
    }

    // Get the chat to check if this is the latest message
    const chat = await Chat.findById(message.chat);

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // If this was the latest message in the chat, update latestMessage
    if (chat.latestMessage && chat.latestMessage.toString() === messageId) {
      // Find the new latest message
      const newLatestMessage = await Message.findOne({ chat: chat._id })
        .sort({ createdAt: -1 });

      if (newLatestMessage) {
        await Chat.findByIdAndUpdate(chat._id, { latestMessage: newLatestMessage._id });
      } else {
        await Chat.findByIdAndUpdate(chat._id, { $unset: { latestMessage: 1 } });
      }
    }

    res.status(200).json({ message: 'Tin nhắn đã được xóa' });
  } catch (error) {
    console.error('Delete message error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tin nhắn không tồn tại' });
    }
    
    res.status(500).json({ message: 'Lỗi khi xóa tin nhắn', error: error.message });
  }
};