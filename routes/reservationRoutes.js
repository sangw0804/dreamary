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

    // const recruit = await Recruit.findById(req.params.id);
    const createdReservation = await Reservation.create({
      _user,
      _designer,
      _card,
      date,
      services,
      time
    });

    res.status(200).send(createdReservation);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /users/:user_id/reservations/:id 무조건 예약 취소
router.patch('/:id', async (req, res) => {
  try {
    // const { isCanceled } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    reservation.isCanceled = true;
    await reservation.save();

    res.status(200).send(reservation);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// DELETE /users/:user_id/reservations/:id
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new Error('reservation not found!!');
    }
    await reservation.remove();

    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
