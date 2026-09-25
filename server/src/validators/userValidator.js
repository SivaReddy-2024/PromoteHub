const { body } = require('express-validator');
const { validate } = require('./authValidator');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('avatar')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('Bio cannot exceed 250 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company cannot exceed 100 characters'),
  validate
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('confirmNewPassword')
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    }),
  validate
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator
};
