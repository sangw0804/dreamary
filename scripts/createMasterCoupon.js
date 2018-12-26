const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

const { Coupon } = require('../model/coupon');

const createMasterCoupon = async point => {
  const masterCoupon = await Coupon.create({
    _id: Math.floor(Math.random() * 10 ** 12),
    point,
    forDesigner: false,
    createdAt: new Date().getTime(),
    _master_users: [],
    isMaster: true,
    _user: null
  });

  console.log(masterCoupon);
};

createMasterCoupon(5000);
