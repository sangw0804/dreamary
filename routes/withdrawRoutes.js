const express = require('express');

const router = express.Router({ mergeParams: true });
const { Withdraw } = require('../model/withdraw');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /withdraws
router.get('/', async (req, res) => {
  try {
    const withdraws = await Withdraw.find({});

    res.status(200).send(withdraws);
  } catch (e) {
    if (logger) logger.error('GET /withdraws || %o', e);
    res.status(400).send(e);
  }
});

// POST /withdraws
router.post('/', async (req, res) => {
  try {
    const { _designer, name, socialId, address, email, bank, accountHolder, accountNumber, money } = req.body;
    const withdraws = await Withdraw.create({
      _designer,
      name,
      socialId,
      address,
      email,
      bank,
      money,
      accountHolder,
      accountNumber,
      createdAt: new Date().getTime()
    });

    res.status(200).send(withdraws);
  } catch (e) {
    console.log(e);
    if (logger) logger.error('POST /withdraws || %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
