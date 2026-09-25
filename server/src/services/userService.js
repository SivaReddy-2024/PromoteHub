const User = require('../models/User');
const Campaign = require('../models/Campaign');

class UserService {
  /**
   * Get user profile with campaign statistics
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const campaignCounts = await Campaign.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      total: 0,
      active: 0,
      draft: 0,
      paused: 0,
      completed: 0
    };

    campaignCounts.forEach((item) => {
      stats.total += item.count;
      if (stats[item._id] !== undefined) {
        stats[item._id] = item.count;
      }
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        company: user.company,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats
    };
  }

  /**
   * Update user personal profile
   */
  async updateProfile(userId, { name, avatar, bio, company }) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (company !== undefined) user.company = company;

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Change user password securely
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Current password does not match our records');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    return true;
  }
}

module.exports = new UserService();
