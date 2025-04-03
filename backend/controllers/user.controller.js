const User = require('../models/user.model');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private
 */
exports.getUsers = async (req, res) => {
  try {
    // Exclude the current user from results and filter by username/email if search term provided
    const searchTerm = req.query.search 
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ],
          _id: { $ne: req.user._id }
        } 
      : { _id: { $ne: req.user._id } };

    const users = await User.find(searchTerm)
      .select('-password')
      .sort({ username: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Lỗi khi tìm kiếm người dùng', error: error.message });
  }
};

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'username email avatar status');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(500).json({ message: 'Lỗi khi tải thông tin người dùng', error: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    // Check if username is already taken
    if (username) {
      const userWithUsername = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (userWithUsername) {
        return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { username, avatar } },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error: error.message });
  }
};

/**
 * @desc    Send friend request
 * @route   POST /api/users/friends/request/:id
 * @access  Private
 */
exports.sendFriendRequest = async (req, res) => {
  try {
    const receiverId = req.params.id;
    
    // Can't send request to self
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Không thể gửi lời mời kết bạn cho chính bạn' });
    }
    
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Check if already friends
    if (receiver.friends.includes(req.user._id)) {
      return res.status(400).json({ message: 'Đã là bạn bè' });
    }
    
    // Check if request already sent
    if (receiver.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Đã gửi lời mời kết bạn trước đó' });
    }
    
    // Add to friend requests
    receiver.friendRequests.push(req.user._id);
    await receiver.save();
    
    res.status(200).json({ message: 'Đã gửi lời mời kết bạn' });
  } catch (error) {
    console.error('Send friend request error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(500).json({ message: 'Lỗi khi gửi lời mời kết bạn', error: error.message });
  }
};

/**
 * @desc    Accept friend request
 * @route   PUT /api/users/friends/accept/:id
 * @access  Private
 */
exports.acceptFriendRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    
    // Check if sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Check if request exists
    const user = await User.findById(req.user._id);
    if (!user.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: 'Không tìm thấy lời mời kết bạn' });
    }
    
    // Add to friends for both users
    user.friends.push(senderId);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
    await user.save();
    
    sender.friends.push(req.user._id);
    await sender.save();
    
    res.status(200).json({ message: 'Đã chấp nhận lời mời kết bạn' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(500).json({ message: 'Lỗi khi chấp nhận lời mời kết bạn', error: error.message });
  }
};

/**
 * @desc    Reject friend request
 * @route   PUT /api/users/friends/reject/:id
 * @access  Private
 */
exports.rejectFriendRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    
    // Remove from friend requests
    const user = await User.findById(req.user._id);
    if (!user.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: 'Không tìm thấy lời mời kết bạn' });
    }
    
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);
    await user.save();
    
    res.status(200).json({ message: 'Đã từ chối lời mời kết bạn' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ message: 'Lỗi khi từ chối lời mời kết bạn', error: error.message });
  }
};

/**
 * @desc    Remove friend
 * @route   DELETE /api/users/friends/:id
 * @access  Private
 */
exports.removeFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    
    // Remove from both users' friend lists
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { friends: friendId } }
    );
    
    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: req.user._id } }
    );
    
    res.status(200).json({ message: 'Đã xóa khỏi danh sách bạn bè' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Lỗi khi xóa bạn bè', error: error.message });
  }
};

/**
 * @desc    Get friend requests
 * @route   GET /api/users/friends/requests
 * @access  Private
 */
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests', 'username email avatar status');
    
    res.status(200).json(user.friendRequests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách lời mời kết bạn', error: error.message });
  }
};

/**
 * @desc    Get friends list
 * @route   GET /api/users/friends
 * @access  Private
 */
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username email avatar status');
    
    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách bạn bè', error: error.message });
  }
};