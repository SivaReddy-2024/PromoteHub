const express = require('express');
const router = express.Router();
const {
  getBankOffers,
  createBankOffer,
  getCashbackOffers,
  createCashbackOffer,
  getFestivalCampaigns,
  getFestivalCampaignBySlug,
  createFestivalCampaign,
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  globalSearch,
  getAdminAnalytics,
  toggleFavorite,
  recordUserCopiedCoupon,
  updateNotificationPreferences
} = require('../controllers/hubExtrasController');
const { protect } = require('../middleware/authMiddleware');

// Bank Offers
router.route('/bank-offers')
  .get(getBankOffers)
  .post(createBankOffer);

// Cashback Offers
router.route('/cashback')
  .get(getCashbackOffers)
  .post(createCashbackOffer);

// Festival Campaigns
router.route('/festivals')
  .get(getFestivalCampaigns)
  .post(createFestivalCampaign);

router.route('/festivals/:slug')
  .get(getFestivalCampaignBySlug);

// Blog
router.route('/blog')
  .get(getBlogPosts)
  .post(createBlogPost);

router.route('/blog/:slug')
  .get(getBlogPostBySlug);

// Global Search
router.get('/search', globalSearch);

// Admin Analytics
router.get('/admin/analytics', getAdminAnalytics);

// User Activity
router.post('/hub-user/favorite', protect, toggleFavorite);
router.post('/hub-user/copied-coupon', protect, recordUserCopiedCoupon);
router.put('/hub-user/notifications', protect, updateNotificationPreferences);

module.exports = router;
