const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error.utils');
const User = require('../models/user.model');
const jwtConfig = require('../config/jwt.config');

/**
 * Middleware bảo vệ route, yêu cầu user đã đăng nhập
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra token trong cookie hoặc header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createError('Vui lòng đăng nhập để truy cập', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError('Người dùng không tồn tại', 401));
    }

    // Đưa thông tin user vào request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};