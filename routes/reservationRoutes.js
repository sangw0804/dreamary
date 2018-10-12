const express = require('express');

const router = express.Router({ mergeParams: true });
const { Reservation } = require('../model/reservation');
const { User } = require('../model/user');
const { Card } = require('../model/card');
const { Recruit } = require('../model/recruit');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /users/:user_id/reservations/all
router.get('/all', async (req, res) => {
  try {
    const foundReservations = await Reservation.find({})
      .populate('_user')
      .populate({ path: '_designer', populate: { path: '_recruit' } })
      .populate('_card')
      .exec();
    res.status(200).send(foundReservations);
  } catch (e) {
    logger && logger.error('GET /users/:user_id/reservations/all | %o', e);
    res.status(400).send(e);
  }
});

// GET /users/:user_id/reservations
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.params;
    const foundReservations = await Reservation.find({ $or: [{ _user: user_id }, { _designer: user_id }] })
      .populate({ path: '_designer', populate: { path: '_recruit' } })
      .populate('_user')
      .populate('_card')
      .exec();

    res.status(200).send(foundReservations);
  } catch (e) {
    logger && logger.error('GET /users/:user_id/reservations | %o', e);
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
    logger && logger.error('POST /users/:user_id/reservations | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /users/:user_id/reservations/:id 예약 취소 OR 시술 완료
router.patch('/:id', async (req, res) => {
  try {
    const { isCanceled, isDone } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    reservation.isCanceled = !!isCanceled;
    reservation.isDone = !!isDone;
    await reservation.save();

    res.status(200).send(reservation);
  } catch (e) {
    logger && logger.error('PATCH /users/:user_id/reservations/:id | %o', e);
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
    logger && logger.error('DELETE /users/:user_id/reservations/:id | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
