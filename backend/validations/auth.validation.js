const Joi = require('joi');

/**
 * Validation schema cho đăng ký user mới
 */
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Tên người dùng phải là chuỗi',
      'string.empty': 'Tên người dùng không được để trống',
      'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên người dùng không được vượt quá {#limit} ký tự',
      'string.alphanum': 'Tên người dùng chỉ được chứa chữ cái và số',
      'any.required': 'Tên người dùng là bắt buộc',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email phải là chuỗi',
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Mật khẩu phải là chuỗi',
      'string.empty': 'Mật khẩu không được để trống',
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
});

/**
 * Validation schema cho đăng nhập
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email phải là chuỗi',
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Mật khẩu phải là chuỗi',
      'string.empty': 'Mật khẩu không được để trống',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
});

/**
 * Validation schema cho đặt lại mật khẩu
 */
const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Mật khẩu phải là chuỗi',
      'string.empty': 'Mật khẩu không được để trống',
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp',
      'any.required': 'Xác nhận mật khẩu là bắt buộc',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
};