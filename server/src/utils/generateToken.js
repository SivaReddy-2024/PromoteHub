const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set HttpOnly cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User ID to encode in token
 * @returns {string} Signed JWT token
 */
const sendTokenResponse = (res, user, statusCode = 200, message = 'Authenticated successfully') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'promotehub_fallback_secret_key_never_in_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Return token for API clients / automated test tools
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        company: user.company,
        createdAt: user.createdAt
      }
    }
  });
};

/**
 * Clear authentication token cookie on logout
 * @param {Object} res - Express response object
 */
const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });
};

module.exports = {
  sendTokenResponse,
  clearTokenCookie
};
