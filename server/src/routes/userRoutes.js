const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changeUserPassword
} = require('../controllers/userController');
const {
  updateProfileValidator,
  changePasswordValidator
} = require('../validators/userValidator');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfileValidator, updateUserProfile);
router.put('/change-password', protect, changePasswordValidator, changeUserPassword);

module.exports = router;
