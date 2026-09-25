const mongoose = require('mongoose');

const bankOfferSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    bankLogo: {
      type: String,
      required: true
    },
    cardType: {
      type: String,
      required: true,
      enum: ['Credit Card', 'Debit Card', 'Credit & Debit Card', 'EMI Only', 'Net Banking']
    },
    discount: {
      type: String,
      required: true
    },
    minimumTransaction: {
      type: Number,
      required: true
    },
    maximumDiscount: {
      type: Number,
      required: true
    },
    validity: {
      type: String,
      required: true
    },
    applicableMerchants: {
      type: [String],
      default: ['Amazon', 'Flipkart', 'Croma', 'Myntra']
    },
    terms: {
      type: [String],
      default: [
        'Offer applicable once per card during promotional period.',
        'Not valid on corporate cards or delinquent accounts.',
        'Instant discount applied at payment gateway.'
      ]
    },
    status: {
      type: String,
      default: 'active'
    }
  },
  { timestamps: true }
);

const BankOffer = mongoose.model('BankOffer', bankOfferSchema);
module.exports = BankOffer;
