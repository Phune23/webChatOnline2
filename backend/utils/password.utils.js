const bcrypt = require('bcryptjs');

/**
 * Hash mật khẩu
 * @param {string} password - Mật khẩu cần hash
 * @returns {Promise<string>} - Mật khẩu đã hash
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * So sánh mật khẩu
 * @param {string} enteredPassword - Mật khẩu nhập vào
 * @param {string} hashedPassword - Mật khẩu đã hash
 * @returns {Promise<boolean>} - True nếu khớp, false nếu không khớp
 */
const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};