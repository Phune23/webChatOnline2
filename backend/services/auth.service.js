const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createError } = require('../utils/error.utils');
const { comparePassword } = require('../utils/password.utils');
const jwtConfig = require('../config/jwt.config');

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @returns {Object} - Thông tin người dùng đã đăng ký
 */
const register = async (userData) => {
  // Kiểm tra email đã tồn tại
  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) {
    throw createError('Email đã được đăng ký', 400);
  }

  // Kiểm tra username đã tồn tại
  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) {
    throw createError('Tên người dùng đã được sử dụng', 400);
  }

  // Tạo người dùng mới
  const user = await User.create(userData);

  // Không trả về password trong response
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return {
    user: userWithoutPassword,
    token: generateToken(user._id),
  };
};

/**
 * Đăng nhập người dùng
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @returns {Object} - Thông tin người dùng và token
 */
const login = async (email, password) => {
  // Tìm user bằng email và lấy cả password để so sánh
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw createError('Email hoặc mật khẩu không chính xác', 401);
  }

  // So sánh password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw createError('Email hoặc mật khẩu không chính xác', 401);
  }

  // Cập nhật trạng thái online
  user.isOnline = true;
  user.lastActive = Date.now();
  await user.save();

  // Không trả về password trong response
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return {
    user: userWithoutPassword,
    token: generateToken(user._id),
  };
};

/**
 * Đăng xuất người dùng
 * @param {string} userId - Id người dùng
 */
const logout = async (userId) => {
  // Cập nhật trạng thái offline
  const user = await User.findById(userId);
  if (!user) {
    throw createError('Người dùng không tồn tại', 404);
  }
  
  user.isOnline = false;
  user.lastActive = Date.now();
  await user.save();
  
  return { success: true };
};

/**
 * Tạo JWT token
 * @param {string} id - Id người dùng
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

module.exports = {
  register,
  login,
  logout,
  generateToken,
};