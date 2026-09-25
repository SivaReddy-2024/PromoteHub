const mongoose = require('mongoose');

const cashbackOfferSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true
    },
    storeLogo: {
      type: String,
      required: true
    },
    storeSlug: {
      type: String,
      required: true
    },
    cashbackRate: {
      type: String,
      required: true
    },
    maxCashback: {
      type: String,
      default: 'No Limit'
    },
    category: {
      type: String,
      required: true
    },
    trackingSpeed: {
      type: String,
      default: 'Within 24 Hours'
    },
    terms: {
      type: [String],
      default: [
        'Shop through our link in an empty cart.',
        'Do not open other coupon browser extensions.',
        'Cashback tracks within 24-48 hours and confirms in 60-90 days.'
      ]
    },
    trackingUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'active'
    }
  },
  { timestamps: true }
);

const CashbackOffer = mongoose.model('CashbackOffer', cashbackOfferSchema);
module.exports = CashbackOffer;
