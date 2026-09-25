const { body } = require('express-validator');
const { validate } = require('./authValidator');
const { CAMPAIGN_CATEGORIES, CAMPAIGN_STATUSES } = require('../constants/campaignConstants');

const createCampaignValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('promotionalContent')
    .trim()
    .notEmpty()
    .withMessage('Promotional content or coupon/offer is required'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Banner image URL is required')
    .isURL()
    .withMessage('Banner image URL must be a valid URL'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CAMPAIGN_CATEGORIES)
    .withMessage(`Category must be one of: ${CAMPAIGN_CATEGORIES.join(', ')}`),
  body('targetAudience')
    .trim()
    .notEmpty()
    .withMessage('Target audience is required')
    .isLength({ max: 150 })
    .withMessage('Target audience cannot exceed 150 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after the start date');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(CAMPAIGN_STATUSES)
    .withMessage(`Status must be one of: ${CAMPAIGN_STATUSES.join(', ')}`),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a non-negative number'),
  validate
];

const updateCampaignValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('promotionalContent')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Promotional content cannot be empty'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Banner image URL must be a valid URL'),
  body('category')
    .optional()
    .trim()
    .isIn(CAMPAIGN_CATEGORIES)
    .withMessage(`Category must be one of: ${CAMPAIGN_CATEGORIES.join(', ')}`),
  body('targetAudience')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Target audience cannot exceed 150 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date')
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(CAMPAIGN_STATUSES)
    .withMessage(`Status must be one of: ${CAMPAIGN_STATUSES.join(', ')}`),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a non-negative number'),
  validate
];

module.exports = {
  createCampaignValidator,
  updateCampaignValidator
};
