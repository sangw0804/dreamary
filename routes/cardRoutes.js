const express = require('express');

const router = express.Router({ mergeParams: true });
const { Recruit } = require('../model/recruit');
const { Card } = require('../model/card');
const { generateCondition, checker } = require('./helpers');

// GET /cards
router.get('/cards', async (req, res) => {
  try {
    const { date, cut, perm, dye } = req.query;
    if (!(cut in checker) || !(perm in checker) || !(dye in checker)) {
      throw new Error('invalid query!!');
    }
    const cards = await Card.find(
      generateCondition(date, { cut, perm, dye })
    ).populate('_recruit');
    res.status(200).send(cards);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /recruits/:recruit_id/cards
router.get('/recruits/:recruit_id/cards', async (req, res) => {
  try {
    const { date, cut, perm, dye } = req.query;
    if (!(cut in checker) || !(perm in checker) || !(dye in checker)) {
      throw new Error('invalid query!!');
    }
    const cards = await Card.find({
      _recruit: req.params.recruit_id,
      ...generateCondition(date, { cut, perm, dye })
    });
    res.status(200).send(cards);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST /recruits/:recruit_id/cards
router.post('/recruits/:recruit_id/cards', async (req, res) => {
  try {
    const { date, ableTimes, price, must, no } = req.body;
    const { recruit_id } = req.params;
    const recruit = await Recruit.findById(recruit_id);
    if (!recruit) {
      throw new Error('recruit not found!');
    }
    const createdCard = await Card.create({
      _recruit: recruit_id,
      date,
      ableTimes,
      price,
      must,
      no,
      reservedTimes: []
    });

    recruit._cards.push(createdCard._id);
    await recruit.save();

    res.status(200).send(createdCard);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /recruits/:id/cards/:card_id
// router.patch('/recruits/:id/cards/:card_id', async (req, res) => {
//   try {
//     const updatedCard = await Card.findByIdAndUpdate(req.params.card_id, );
//   } catch (e) {

//   }
// });

// DELETE /recruits/:recruit_id/cards/:id
router.delete('/recruits/:recruit_id/cards/:id', async (req, res) => {
  try {
    const recruit = await Recruit.findById(req.params.recruit_id);
    if (!recruit) {
      throw new Error('recruit not found!');
    }
    const { id } = req.params;
    await Card.remove({ _id: id });
    recruit._cards = recruit._cards.filter(
      card => card._id.toHexString() !== id
    );
    await recruit.save();

    res.status(200).send({});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
