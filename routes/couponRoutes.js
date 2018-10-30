const express = require('express');

const router = express.Router({ mergeParams: true });
const { Coupon } = require('../model/coupon');
const { User } = require('../model/user');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).send(coupons);
  } catch (e) {
    logger && logger.error('GET /coupons %o', e);
    res.status(400).send(e);
  }
});

// POST /coupons
router.post('/', async (req, res) => {
  try {
    const { point, number, forDesigner } = req.body;
    if (!point || !number) throw new Error('invalid params!!!');
    const coupons = await Coupon.makeCoupons(point, number, forDesigner);

    res.status(200).send(coupons);
  } catch (e) {
    logger && logger.error('POST /coupons %o', e);
    res.status(400).send(e);
  }
});

// PATCH /coupons/:id
router.patch('/:id', async (req, res) => {
  try {
    const { _user, isD } = req.body;
    const { id } = req.params;
    const coupon = await Coupon.findById(+id);
    const user = await User.findById(_user);
    if (!coupon || !user) throw new Error('coupon || user not found!');
    if (isD !== coupon.forDesigner) throw new Error('coupon type and user type not match!!!');

    coupon._user = _user;
    if (user.forDesigner) {
      user.expiredAt += coupon.point;
    } else {
      user.point += coupon.point;
    }

    const savedCoupon = await coupon.save();
    await user.save();

    res.status(200).send(savedCoupon);
  } catch (e) {
    logger && logger.error('PATCH /coupons/:id %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
