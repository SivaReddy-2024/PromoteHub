const User = require('../models/User');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      password
    });

    return user;
  }

  /**
   * Login user with credentials
   */
  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Remove password from returned user object
    user.password = undefined;
    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
