const express = require('express');

const router = express.Router({ mergeParams: true });
const { Reservation } = require('../model/reservation');
const { User } = require('../model/user');
const { Card } = require('../model/card');
const { Recruit } = require('../model/recruit');
const logger = require('../log');

// GET /users/:user_id/reservations/all
router.get('/all', async (req, res) => {
  try {
    const foundReservations = await Reservation.find({});
    res.status(200).send(foundReservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /users/:user_id/reservations
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.params;
    const foundReservations = await Reservation.find({
      $or: [{ _user: user_id }, { _designer: user_id }]
    })
      .populate('_designer')
      .exec();

    res.status(200).send(foundReservations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST /users/:user_id/reservations
router.post('/', async (req, res) => {
  try {
    const { _user, _designer, time, _card, date, services } = req.body;
    const user = await User.findById(_user);
    const designer = await User.findById(_designer);
    const card = await Card.findById(_card);
    // const recruit = await Recruit.findById(req.params.id);

    if (!user || !designer || !card) {
      throw new Error('user || card || recruit not found!!');
    }
    const createdReservation = await Reservation.create({
      _user,
      _designer,
      _card,
      date,
      services,
      time
    });

    user._reservations.push(createdReservation._id);
    designer._reservations.push(createdReservation._id);
    card.reservedTimes.push(time);

    await user.save();
    await designer.save();
    await card.save();

    res.status(200).send(createdReservation);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /users/:user_id/reservations/:id
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndRemove(req.params.id);
    if (!reservation) {
      throw new Error('reservation not found!!');
    }
    const user = await User.findById(reservation._user);
    user._reservations = user._reservations.filter(
      reserve => reserve.toHexString() !== req.params.id
    );
    const designer = await User.findById(reservation._designer);
    designer._reservations = designer._reservations.filter(
      reserve => reserve.toHexString() !== req.params.id
    );
    const card = await Card.findById(reservation._card);
    card.reservedTimes = card.reservedTimes.filter(
      time => time.since !== reservation.time.since
    );

    await user.save();
    await designer.save();
    await card.save();

    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
