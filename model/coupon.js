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
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  {
    versionKey: false
  }
);

couponSchema.statics.makeCoupons = async function(point, number, forDisgner) {
  const Coupon = this;
  const coupons = [];
  for (let i = 0; i < number; i++) {
    coupons.push(await Coupon.create({ point, _id: Math.floor(Math.random() * 10 ** 12), forDisgner }));
  }
  return coupons;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = { Coupon };
