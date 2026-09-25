const userService = require('../services/userService');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get user profile and statistics
 * @route   GET /api/users/profile
 * @access  Protected
 */
const getUserProfile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.user._id);
    return successResponse(res, 'User profile retrieved', data);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/profile
 * @access  Protected
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, avatar, bio, company } = req.body;
    const updatedUser = await userService.updateProfile(req.user._id, {
      name,
      avatar,
      bio,
      company
    });
    return successResponse(res, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user account password
 * @route   PUT /api/users/change-password
 * @access  Protected
 */
const changeUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, currentPassword, newPassword);
    return successResponse(res, 'Password changed successfully', {});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserPassword
};
