const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    icon: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    offerCount: {
      type: Number,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
