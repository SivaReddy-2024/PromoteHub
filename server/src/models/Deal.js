const mongoose = require('mongoose');
const { OFFER_STATUSES } = require('../constants/hubConstants');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
      minlength: 3,
      maxlength: 150
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Deal description is required'],
      trim: true
    },
    brandName: {
      type: String,
      required: true,
      trim: true
    },
    brandLogo: {
      type: String,
      required: true
    },
    brandSlug: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    dealPrice: {
      type: Number,
      required: true,
      min: 0
    },
    savingsAmount: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      default: ''
    },
    cashbackText: {
      type: String,
      default: ''
    },
    merchantUrl: {
      type: String,
      required: true,
      trim: true
    },
    affiliateUrl: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: OFFER_STATUSES,
      default: 'active'
    },
    verified: {
      type: Boolean,
      default: true
    },
    lastVerified: {
      type: Date,
      default: Date.now
    },
    featured: {
      type: Boolean,
      default: false
    },
    isHot: {
      type: Boolean,
      default: false
    },
    isFlash: {
      type: Boolean,
      default: false
    },
    flashStock: {
      type: Number,
      default: 20
    },
    flashTotalStock: {
      type: Number,
      default: 50
    },
    clicks: {
      type: Number,
      default: 0
    },
    terms: {
      type: [String],
      default: [
        'Offer valid while stock lasts.',
        'Applicable only on selected products.',
        'Cannot be combined with any other promotional voucher.',
        'Standard merchant return and warranty policies apply.'
      ]
    },
    howToUse: {
      type: [String],
      default: [
        'Click on "GET DEAL" to visit the merchant site.',
        'Add eligible products to your shopping cart.',
        'If a promo code is provided, apply it at checkout.',
        'Complete the transaction with your preferred payment method.'
      ]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

dealSchema.index({ status: 1, createdAt: -1 });
dealSchema.index({ category: 1, status: 1 });
dealSchema.index({ brandSlug: 1 });
dealSchema.index({ isHot: 1 });
dealSchema.index({ isFlash: 1 });
dealSchema.index({ featured: 1 });
dealSchema.index({
  title: 'text',
  description: 'text',
  brandName: 'text'
});

// Auto compute savings amount if originalPrice exists
dealSchema.pre('save', function (next) {
  if (this.originalPrice && this.dealPrice && this.originalPrice > this.dealPrice) {
    this.savingsAmount = this.originalPrice - this.dealPrice;
  }
  next();
});

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;
