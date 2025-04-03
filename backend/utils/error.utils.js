/**
 * Custom Error class để xử lý các lỗi API
 */
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Factory function để tạo new APIError
 * @param {string} message - Thông báo lỗi
 * @param {number} statusCode - HTTP status code
 * @returns {APIError} - New APIError instance
 */
const createError = (message, statusCode) => {
  return new APIError(message, statusCode);
};

module.exports = {
  APIError,
  createError,
};