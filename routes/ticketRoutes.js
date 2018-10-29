const express = require('express');

const router = express.Router({ mergeParams: true });
const { User } = require('../model/user');
const { Ticket } = require('../model/ticket');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /users/:id/tickets
router.get('/', async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.params.id });
    if (!foundUser) {
      throw new Error('user not found!');
    }
    const foundTickets = await Ticket.find({ _user: foundUser._id });
    res.status(200).send(foundTickets);
  } catch (e) {
    logger && logger.error('GET /users/:id/tickets | %o', e);
    res.status(400).send(e);
  }
});

// POST /users/:id/tickets
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      throw new Error('user not found!!');
    }

    const { price } = req.body;
    const createdTicket = await Ticket.create({
      price,
      _user: req.params.id
    });

    user._tickets.push(createdTicket._id);

    await user.save();

    res.status(200).send(createdTicket);
  } catch (e) {
    logger && logger.error('GET /users/:id/tickets | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /users/:id/tickets/:ticket_id
router.patch('/:ticket_id', async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.params.id });
    if (!foundUser) {
      throw new Error('user not found!!');
    }
    // const body = { expiredAt: new Date().getTime() };
    // const updatedTicket = await Ticket.findOneAndUpdate({ _id: req.params.ticket_id }, { $set: body }, { new: true });

    res.status(200).send(updatedTicket);
  } catch (e) {
    logger && logger.error('GET /users/:id/tickets | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
