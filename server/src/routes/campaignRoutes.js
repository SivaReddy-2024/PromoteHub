const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  getMyCampaigns,
  getMyCampaignStats,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');
const {
  createCampaignValidator,
  updateCampaignValidator
} = require('../validators/campaignValidator');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Specific user subroutes MUST come before /:id parameter route
router.get('/user/my', protect, getMyCampaigns);
router.get('/user/stats', protect, getMyCampaignStats);

// Main collection routes
router.route('/')
  .get(getCampaigns)
  .post(protect, createCampaignValidator, createCampaign);

// Document specific routes
router.route('/:id')
  .get(optionalAuth, getCampaignById)
  .put(protect, updateCampaignValidator, updateCampaign)
  .delete(protect, deleteCampaign);

module.exports = router;
