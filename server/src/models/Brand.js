const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    logo: {
      type: String,
      required: true
    },
    website: {
      type: String,
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
    activeOffersCount: {
      type: Number,
      default: 0
    },
    couponCount: {
      type: Number,
      default: 0
    },
    cashbackRate: {
      type: String,
      default: 'Up to 5%'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    featured: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

brandSchema.index({ slug: 1 });
brandSchema.index({ category: 1 });
brandSchema.index({ featured: 1 });

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
