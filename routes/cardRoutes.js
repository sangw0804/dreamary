const express = require('express');

const router = express.Router({ mergeParams: true });
const { Recruit } = require('../model/recruit');
const { Card } = require('../model/card');

// GET /recruits/:id/cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({ _recruit: req.params.id });
    res.status(200).send(cards);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST /recruits/:id/cards
router.post('/', async (req, res) => {
  try {
    const { _recruit, date, ableTimes, price, must, no } = req.body;
    const recruit = await Recruit.findById(_recruit);
    if (!recruit) {
      throw new Error('recruit not found!');
    }
    const createdCard = await Card.create({
      _recruit,
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

// DELETE /recruits/:id/cards/:card_id
router.delete('/:card_id', async (req, res) => {
  try {
    const recruit = await Recruit.findById(req.params.id);
    if (!recruit) {
      throw new Error('recruit not found!');
    }
    const { card_id } = req.params;
    await Card.remove({ _id: card_id });
    recruit._cards = recruit._cards.filter(
      card => card._id.toHexString() !== card_id
    );
    await recruit.save();

    res.status(200).send({});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
