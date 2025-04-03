/**
 * Validate email format
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - true nếu hợp lệ, false nếu không hợp lệ
 */
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password cần kiểm tra
 * @returns {boolean} - true nếu mạnh, false nếu yếu
 */
const isStrongPassword = (password) => {
  // Ít nhất 6 ký tự, có ký tự in hoa, in thường, số
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Validate username format
 * @param {string} username - Username cần kiểm tra
 * @returns {boolean} - true nếu hợp lệ, false nếu không hợp lệ
 */
const isValidUsername = (username) => {
  // Ít nhất 3 ký tự, chỉ chấp nhận chữ, số, dấu gạch dưới và dấu gạch ngang
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
};