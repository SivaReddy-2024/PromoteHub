const mongoose = require('mongoose');

const festivalCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'Mega Sale'
    },
    description: {
      type: String,
      required: true
    },
    banner: {
      type: String,
      required: true
    },
    discountUpTo: {
      type: String,
      default: 'Up to 80% OFF'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    participatingBrands: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'scheduled', 'ended'],
      default: 'active'
    },
    featured: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const FestivalCampaign = mongoose.model('FestivalCampaign', festivalCampaignSchema);
module.exports = FestivalCampaign;
