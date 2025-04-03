const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// Message routes
router.post('/', messageController.sendMessage);
router.get('/:chatId', messageController.getMessages);
router.put('/read/:chatId', messageController.markAsRead);
router.get('/unread', messageController.getUnreadCount);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;