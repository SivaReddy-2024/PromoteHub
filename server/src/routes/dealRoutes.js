const express = require('express');
const router = express.Router();
const {
  getDeals,
  getDealByIdentifier,
  createDeal,
  updateDeal,
  deleteDeal,
  trackClick
} = require('../controllers/dealController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDeals)
  .post(createDeal); // Flexible: supports guest demo or user creation

router.route('/:identifier')
  .get(getDealByIdentifier)
  .put(updateDeal)
  .delete(deleteDeal);

router.post('/:id/track-click', trackClick);

module.exports = router;
