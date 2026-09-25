const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
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
    excerpt: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    },
    author: {
      name: { type: String, default: 'Editorial Team' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      role: { type: String, default: 'Savings Expert' }
    },
    category: {
      type: String,
      required: true
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    tags: [String],
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;
