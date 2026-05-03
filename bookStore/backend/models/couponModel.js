import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  discountType: {
    type: String,
    enum: ["percentage", "fixed", "bxgy"],
    required: true,
  },

  discountValue: {
    type: Number,
    default: 0,
  },

  maxDiscount: {
    type: Number,
    default: null,
  },

  minOrderAmount: {
    type: Number,
    default: 0,
  },

  buyQuantity: {
    type: Number,
    default: null, 
  },

  getQuantity: {
    type: Number,
    default: null, 
  },

  maxFreeItems: {
    type: Number,
    default: null,
  },

  applicableProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddBook",
    },
  ],

  applicableCategories: [
    {
      name: String,
      subCategory: String
    }
  ],
  
  applicableGenre: {
    type: String,
    default: null
  },

  startDate: {
    type: Date,
    required: true,
  },

  expiryDate: {
    type: Date,
    required: true,
  },

  usageLimit: {
    type: Number,
    default: null,
  },

  usedCount: {
    type: Number,
    default: 0,
  },

  perUserLimit: {
    type: Number,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  description: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const CouponDetail = mongoose.model("Coupon", couponSchema);