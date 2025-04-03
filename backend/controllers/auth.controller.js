const authService = require('../services/auth.service');
const jwtConfig = require('../config/jwt.config');

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Gọi service để đăng ký
    const { user, token } = await authService.register({ username, email, password });
    
    // Lưu token vào cookie
    setTokenCookie(res, token);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Gọi service để đăng nhập
    const { user, token } = await authService.login(email, password);
    
    // Lưu token vào cookie
    setTokenCookie(res, token);
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Đăng xuất người dùng
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Gọi service để đăng xuất
    await authService.logout(req.user._id);
    
    // Xóa cookie
    res.clearCookie('token');
    
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy thông tin người dùng hiện tại
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * Helper function để set JWT cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 */
const setTokenCookie = (res, token) => {
  res.cookie('token', token, jwtConfig.cookieOptions);
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};