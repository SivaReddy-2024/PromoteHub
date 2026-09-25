/**
 * Standardized API Response Utilities
 */

const successResponse = (res, message = 'Success', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', errors = [], statusCode = 400) => {
  const payload = {
    success: false,
    message
  };

  if (Array.isArray(errors) && errors.length > 0) {
    payload.errors = errors;
  } else if (typeof errors === 'string') {
    payload.errors = [{ message: errors }];
  }

  return res.status(statusCode).json(payload);
};

// Flexible signature aliases
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return successResponse(res, message, data, statusCode);
};

const sendError = (res, statusCode = 400, message = 'Error', errors = []) => {
  return errorResponse(res, message, errors, statusCode);
};

module.exports = {
  successResponse,
  errorResponse,
  sendSuccess,
  sendError
};
