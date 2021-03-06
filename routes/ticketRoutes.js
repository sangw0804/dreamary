const express = require('express');

const router = express.Router({ mergeParams: true });
const { User } = require('../model/user');
const { Ticket } = require('../model/ticket');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /users/:id/tickets
router.get('/', async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.params.id });

    if (!foundUser) throw new Error('user not found!');

    const foundTickets = await Ticket.find({ _user: foundUser._id });
    res.status(200).send(foundTickets);
  } catch (e) {
    if (logger) logger.error('GET /users/:id/tickets | %o', e);
    res.status(400).send(e);
  }
});

// POST /users/:id/tickets
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) throw new Error('user not found!!');

    const { price, money } = req.body;

    const createdTicket = await Ticket.create({ price, _user: req.params.id, createdAt: new Date().getTime() });

    user._tickets.push(createdTicket._id);

    if (money) user.money -= money;

    const createdUser = await user.save();

    res.status(200).send({ ticket: createdTicket, userData: createdUser });
  } catch (e) {
    if (logger) logger.error('POST /users/:id/tickets | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /users/:id/tickets/:ticket_id
router.patch('/:ticket_id', async (req, res) => {
  try {
    const { id, ticket_id } = req.params;

    const foundUser = await User.findOne({ _id: id });
    if (!foundUser) throw new Error('user not found!!');

    const foundTicket = await Ticket.findById(ticket_id);
    foundTicket.activate();
    const savedTicket = await foundTicket.save();
    foundUser.expiredAt = foundTicket.expiredAt;
    foundUser.reservationCount = 0;
    await foundUser.save();

    res.status(200).send(savedTicket);
  } catch (e) {
    if (logger) logger.error('PATCH /users/:id/tickets | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
