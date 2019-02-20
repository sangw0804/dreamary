const express = require('express');
const mongoose = require('mongoose');

const router = express.Router({ mergeParams: true });
const { Withdraw } = require('../model/withdraw');
const { User } = require('../model/user');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /withdraws/:user_id
router.get('/:user_id', async (req, res) => {
  try {
    const withdraws = await Withdraw.find({ _designer: req.params.user_id });

    res.status(200).send(withdraws);
  } catch (e) {
    if (logger) logger.error('GET /withdraws/:user_id || %o', e);
    res.status(400).send(e);
  }
});

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
  let withdraw;

  try {
    const { _designer, name, socialId, address, email, bank, accountHolder, accountNumber, money } = req.body;

    withdraw = await Withdraw.create({
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

    const designer = await User.findById(_designer);

    designer.money -= money;
    const savedDesigner = await designer.save();

    res.status(200).send(savedDesigner);
  } catch (e) {
    if (withdraw) await Withdraw.findByIdAndRemove(withdraw._id);

    if (logger) logger.error('POST /withdraws || %o', e);
    res.status(400).send(e);
  }
});

// PATCH /withdraws/:id
router.patch('/:id', async (req, res) => {
  try {
    const { isRefused } = req.body;

    if (typeof isRefused !== 'boolean') throw new Error('isRefused is not valid!');

    const updatedWithdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      { $set: { updatedAt: new Date().getTime(), isRefused } },
      { new: true }
    );

    res.status(200).send(updatedWithdraw);
  } catch (e) {
    if (logger) logger.error('PATCH /withdraws/:id || %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
