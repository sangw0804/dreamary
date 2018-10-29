const express = require('express');

const router = express.Router({ mergeParams: true });
const { Coupon } = require('../model/coupon');
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
    const { point, number } = req.body;
    const coupons = await Coupon.makeCoupons(point, number);

    res.status(200).send(coupons);
  } catch (e) {
    console.log(e);
    logger && logger.error('POST /coupons %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
