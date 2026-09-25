const mongoose = require('mongoose');
const { CAMPAIGN_CATEGORIES, CAMPAIGN_STATUSES } = require('../constants/campaignConstants');

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    promotionalContent: {
      type: String,
      required: [true, 'Promotional content or offer details are required'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Campaign banner or image URL is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Campaign category is required'],
      enum: {
        values: CAMPAIGN_CATEGORIES,
        message: '{VALUE} is not a supported campaign category'
      }
    },
    targetAudience: {
      type: String,
      required: [true, 'Target audience description is required'],
      trim: true,
      maxlength: [150, 'Target audience cannot exceed 150 characters']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    status: {
      type: String,
      enum: {
        values: CAMPAIGN_STATUSES,
        message: '{VALUE} is not a valid campaign status'
      },
      default: 'draft'
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Campaign creator user reference is required']
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for optimal query efficiency
campaignSchema.index({ user: 1, status: 1 });
campaignSchema.index({ status: 1, createdAt: -1 });
campaignSchema.index({ category: 1, status: 1 });

// Full-text search index
campaignSchema.index({
  title: 'text',
  description: 'text',
  promotionalContent: 'text'
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
