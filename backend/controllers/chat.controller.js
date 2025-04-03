const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Message = require('../models/message.model');

/**
 * @desc    Create or access one-on-one chat
 * @route   POST /api/chats
 * @access  Private
 */
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId không được cung cấp' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [req.user._id, userId] }
    })
      .populate('participants', '-password')
      .populate('latestMessage')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'username avatar'
        }
      });

    // If chat exists, return it
    if (chat) {
      return res.status(200).json(chat);
    }

    // If not, create a new chat
    const chatData = {
      isGroupChat: false,
      participants: [req.user._id, userId]
    };

    const newChat = await Chat.create(chatData);
    
    // Get full chat with populated data
    const fullChat = await Chat.findById(newChat._id)
      .populate('participants', '-password');

    res.status(201).json(fullChat);
  } catch (error) {
    console.error('Access chat error:', error);
    res.status(500).json({ message: 'Lỗi khi tạo hoặc truy cập chat', error: error.message });
  }
};

/**
 * @desc    Get all chats for a user
 * @route   GET /api/chats
 * @access  Private
 */
exports.getChats = async (req, res) => {
  try {
    // Find all chats that the user is a participant in
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'username avatar'
        }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách chat', error: error.message });
  }
};

/**
 * @desc    Create new group chat
 * @route   POST /api/chats/group
 * @access  Private
 */
exports.createGroupChat = async (req, res) => {
  try {
    if (!req.body.participants || !req.body.groupName) {
      return res.status(400).json({ message: 'Vui lòng cung cấp tên nhóm và danh sách thành viên' });
    }

    let participants = JSON.parse(req.body.participants);

    // Add current user to the group
    if (!participants.includes(req.user._id.toString())) {
      participants.push(req.user._id.toString());
    }

    // Need at least 3 participants for a group chat
    if (participants.length < 3) {
      return res.status(400).json({ message: 'Chat nhóm cần ít nhất 3 thành viên' });
    }

    const groupData = {
      isGroupChat: true,
      groupName: req.body.groupName,
      participants: participants,
      groupAdmin: req.user._id
    };

    const newGroup = await Chat.create(groupData);

    const fullGroupChat = await Chat.findById(newGroup._id)
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ message: 'Lỗi khi tạo chat nhóm', error: error.message });
  }
};

/**
 * @desc    Update group chat name
 * @route   PUT /api/chats/group/:id
 * @access  Private
 */
exports.updateGroupChat = async (req, res) => {
  try {
    const { groupName } = req.body;
    const groupId = req.params.id;

    if (!groupName) {
      return res.status(400).json({ message: 'Vui lòng cung cấp tên nhóm mới' });
    }

    // Find and update the group
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { groupName },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm' });
    }

    // Check if user is admin
    if (updatedGroup.groupAdmin._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Chỉ quản trị viên nhóm mới có thể thay đổi tên nhóm' });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Update group chat error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm' });
    }
    
    res.status(500).json({ message: 'Lỗi khi cập nhật chat nhóm', error: error.message });
  }
};

/**
 * @desc    Add user to group
 * @route   PUT /api/chats/group/:id/add
 * @access  Private
 */
exports.addToGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    // Find the group
    const group = await Chat.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm' });
    }

    // Check if user is admin
    if (group.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Chỉ quản trị viên nhóm mới có thể thêm thành viên' });
    }

    // Check if user is already in the group
    if (group.participants.includes(userId)) {
      return res.status(400).json({ message: 'Người dùng đã là thành viên của nhóm' });
    }

    // Add user to group
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { participants: userId } },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Add to group error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm hoặc người dùng' });
    }
    
    res.status(500).json({ message: 'Lỗi khi thêm thành viên vào nhóm', error: error.message });
  }
};

/**
 * @desc    Remove user from group
 * @route   PUT /api/chats/group/:id/remove
 * @access  Private
 */
exports.removeFromGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    // Find the group
    const group = await Chat.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm' });
    }

    // Check if user is admin or removing themselves
    if (group.groupAdmin.toString() !== req.user._id.toString() && 
        userId !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Chỉ quản trị viên nhóm mới có thể xóa thành viên khác' 
      });
    }

    // Cannot remove the admin
    if (userId === group.groupAdmin.toString() && req.user._id.toString() === userId) {
      return res.status(400).json({ 
        message: 'Quản trị viên không thể rời nhóm, hãy chuyển quyền quản trị trước' 
      });
    }

    // Remove user from group
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { participants: userId } },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Remove from group error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm hoặc người dùng' });
    }
    
    res.status(500).json({ message: 'Lỗi khi xóa thành viên khỏi nhóm', error: error.message });
  }
};

/**
 * @desc    Make user an admin
 * @route   PUT /api/chats/group/:id/make-admin
 * @access  Private
 */
exports.makeGroupAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    // Find the group
    const group = await Chat.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm' });
    }

    // Check if current user is admin
    if (group.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Chỉ quản trị viên hiện tại mới có thể thay đổi quyền quản trị' });
    }

    // Check if user is in the group
    if (!group.participants.includes(userId)) {
      return res.status(400).json({ message: 'Người dùng không phải là thành viên của nhóm' });
    }

    // Make user an admin
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { groupAdmin: userId },
      { new: true }
    )
      .populate('participants', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Make group admin error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Không tìm thấy chat nhóm hoặc người dùng' });
    }
    
    res.status(500).json({ message: 'Lỗi khi thay đổi quyền quản trị', error: error.message });
  }
};