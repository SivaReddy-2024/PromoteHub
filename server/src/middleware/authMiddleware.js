const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Protect routes - Verifies JWT from HttpOnly cookie or Authorization Bearer header
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check HttpOnly cookie first (primary browser auth)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization: Bearer header (useful for API clients / testing)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Authentication required. Please log in.', [], 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'promotehub_fallback_secret_key_never_in_production'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User session not found. Please log in again.', [], 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', [], 401);
    }
    return errorResponse(res, 'Invalid authentication token.', [], 401);
  }
};

/**
 * Optional authentication - attaches req.user if a valid token is present, but doesn't block if absent
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'promotehub_fallback_secret_key_never_in_production'
    );
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Silently continue for optional auth
  }

  next();
};

/**
 * Role-based authorization guard
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource.`,
        [],
        403
      );
    }
    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize
};
