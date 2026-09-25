const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [250, 'Bio cannot exceed 250 characters'],
      default: ''
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company cannot exceed 100 characters'],
      default: ''
    },
    favorites: {
      deals: [{ type: String }],
      coupons: [{ type: String }],
      brands: [{ type: String }]
    },
    copiedCoupons: [
      {
        code: String,
        brand: String,
        dealTitle: String,
        copiedAt: { type: Date, default: Date.now }
      }
    ],
    cashbackHistory: [
      {
        store: String,
        amount: Number,
        status: { type: String, default: 'Pending' },
        date: { type: Date, default: Date.now },
        orderId: String
      }
    ],
    notificationPreferences: {
      newCoupons: { type: Boolean, default: true },
      expiringDeals: { type: Boolean, default: true },
      brandOffers: { type: Boolean, default: true },
      cashbackOffers: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for campaigns owned by this user
userSchema.virtual('campaigns', {
  ref: 'Campaign',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
