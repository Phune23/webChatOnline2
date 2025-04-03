const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Tạo token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Đăng ký người dùng
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra người dùng tồn tại
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        message: 'Email hoặc tên người dùng đã tồn tại'
      });
    }

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password
    });

    // Tạo token
    const token = generateToken(user._id);

    // Gửi token trong cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Trả về thông tin user (không gửi password)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      friends: user.friends,
      status: user.status
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      message: 'Đăng ký thất bại',
      error: error.message
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Cập nhật trạng thái online
    user.status = 'online';
    await user.save();

    // Tạo token
    const token = generateToken(user._id);

    // Gửi token trong cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Trả về thông tin user
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      friends: user.friends,
      status: user.status
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Đăng nhập thất bại',
      error: error.message
    });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  try {
    // Cập nhật trạng thái offline
    await User.findByIdAndUpdate(req.user._id, { status: 'offline' });
    
    // Xóa cookie token
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Đăng xuất thất bại',
      error: error.message
    });
  }
};