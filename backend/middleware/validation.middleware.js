const { createError } = require('../utils/error.utils');

/**
 * Factory function để tạo middleware validation từ Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Request property to validate (body, params, query)
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(createError(message, 400));
    }

    // Thay thế dữ liệu đã được validate
    req[source] = value;
    next();
  };
};

module.exports = validate;