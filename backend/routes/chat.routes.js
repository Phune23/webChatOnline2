const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// One-on-one chats
router.post('/', chatController.accessChat);
router.get('/', chatController.getChats);

// Group chats
router.post('/group', chatController.createGroupChat);
router.put('/group/:id', chatController.updateGroupChat);
router.put('/group/:id/add', chatController.addToGroup);
router.put('/group/:id/remove', chatController.removeFromGroup);
router.put('/group/:id/make-admin', chatController.makeGroupAdmin);

module.exports = router;