const mongoose = require('mongoose');

const logger = require('../log');

const couponSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    forDesigner: {
      type: Boolean,
      required: true
    },
    point: {
      type: Number,
      required: true
    },
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    _master_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

couponSchema.statics.makeCoupons = async function(point, number, forDesigner) {
  const Coupon = this;
  const coupons = [];
  for (let i = 0; i < number; i++) {
    coupons.push(
      await Coupon.create({
        point,
        _id: Math.floor(Math.random() * 10 ** 12),
        forDesigner,
        createdAt: new Date().getTime()
      })
    );
  }
  return coupons;
};

couponSchema.statics.makeMasterCoupon = async function(point) {
  const Coupon = this;
  const masterCoupon = await Coupon.create({
    point,
    _id: Math.floor(Math.random() * 10 ** 12),
    forDesigner: false,
    _master_users: [],
    createdAt: new Date().getTime()
  });
  return masterCoupon;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = { Coupon };
