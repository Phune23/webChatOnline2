const { APIError } = require('../utils/error.utils');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Lỗi ID không hợp lệ từ Mongoose
  if (err.name === 'CastError') {
    const message = 'Không tìm thấy tài nguyên';
    error = new APIError(message, 404);
  }

  // Lỗi trùng lặp key từ Mongoose
  if (err.code === 11000) {
    let message = 'Dữ liệu đã tồn tại';
    const field = Object.keys(err.keyPattern)[0];
    
    if (field === 'email') {
      message = 'Email đã được đăng ký';
    } else if (field === 'username') {
      message = 'Tên người dùng đã được sử dụng';
    }
    
    error = new APIError(message, 400);
  }

  // Lỗi validation từ Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new APIError(message, 400);
  }

  // Lỗi validation từ Joi
  if (err.isJoi) {
    error = new APIError(err.details[0].message, 400);
  }

  // Lỗi JWT
  if (err.name === 'JsonWebTokenError') {
    error = new APIError('Token không hợp lệ. Vui lòng đăng nhập lại.', 401);
  }

  // Lỗi JWT hết hạn
  if (err.name === 'TokenExpiredError') {
    error = new APIError('Token đã hết hạn. Vui lòng đăng nhập lại.', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Lỗi server',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;