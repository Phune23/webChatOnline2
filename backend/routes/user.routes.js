const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// User search and profile
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/profile', userController.updateProfile);

// Friend requests
router.get('/friends/requests', userController.getFriendRequests);
router.post('/friends/request/:id', userController.sendFriendRequest);
router.put('/friends/accept/:id', userController.acceptFriendRequest);
router.put('/friends/reject/:id', userController.rejectFriendRequest);

// Friends management
router.get('/friends', userController.getFriends);
router.delete('/friends/:id', userController.removeFriend);

module.exports = router;