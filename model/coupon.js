const mongoose = require('mongoose');

const logger = require('../log');

const couponSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    forDesigner: {
      // 디자이너용 쿠폰/ 유저용 쿠폰 true/false
      type: Boolean,
      required: true
    },
    point: {
      // 쿠폰의 포인트 가치
      type: Number,
      required: true
    },
    _user: {
      // 쿠폰을 사용한 유저의 _id값
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isMaster: {
      // 마스터 쿠폰 여부
      type: Boolean,
      default: false
    },
    _master_users: [
      // 마스터 쿠폰을 사용한 유저들의 _id값들
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      // 생성 일자
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

couponSchema.statics.makeCoupons = async function makeCouponHandler(point, number, forDesigner) {
  // 주어진 point 가치를 가지는 쿠폰을 number개 만들어서 배열로 리턴.
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

couponSchema.methods.checkMasterUserInclude = function checkHandler(userId) {
  // 마스터쿠폰을 주어진 _id의 유저가 사용했는지 여부를 반환
  const masterCoupon = this;
  const userIdStrings = masterCoupon._master_users.map(objectId => objectId.toHexString());
  return userIdStrings.includes(userId.toHexString());
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = { Coupon };
