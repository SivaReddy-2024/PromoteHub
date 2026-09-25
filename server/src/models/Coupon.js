const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      trim: true,
      uppercase: true
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
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    discount: {
      type: String,
      required: true
    },
    minimumPurchase: {
      type: Number,
      default: 0
    },
    maximumDiscount: {
      type: Number,
      default: 0
    },
    expiryDate: {
      type: Date,
      required: true
    },
    terms: {
      type: [String],
      default: [
        'Valid on eligible cart items only.',
        'One coupon per user account.',
        'Not redeemable for cash or gift vouchers.'
      ]
    },
    status: {
      type: String,
      enum: ['active', 'expiring_soon', 'expired', 'scheduled', 'draft'],
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
    clicks: {
      type: Number,
      default: 0
    },
    copies: {
      type: Number,
      default: 0
    },
    merchantUrl: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

couponSchema.index({ code: 1, brandSlug: 1 });
couponSchema.index({ category: 1, status: 1 });
couponSchema.index({ status: 1, createdAt: -1 });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
