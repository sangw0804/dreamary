const { ObjectID } = require('mongodb');

const { users } = require('./userSeed');
const { Coupon } = require('../../model/coupon');

const coupons = [
  {
    _id: Math.floor(Math.random() * 10 ** 12),
    point: 3000,
    _user: null,
    createdAt: new Date().getTime(),
    forDesigner: false
  },
  {
    _id: Math.floor(Math.random() * 10 ** 12),
    point: 2000,
    _user: null,
    createdAt: new Date().getTime() - 1000000,
    forDesigner: true
  }
];

const populateCoupons = async done => {
  try {
    await Coupon.deleteMany({});
    await Coupon.insertMany(coupons);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { coupons, populateCoupons };
