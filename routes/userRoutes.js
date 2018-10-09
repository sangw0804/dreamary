const express = require('express');

const router = express.Router();
const { User } = require('../model/user');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /users
router.get('/', async (req, res) => {
  try {
    const foundUsers = await User.find();
    res.status(200).send(foundUsers);
  } catch (e) {
    logger && logger.error('GET /users | %o', e);
    res.status(400).send(e);
  }
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.status(200).send(foundUser);
  } catch (e) {
    logger && logger.error('GET /users/:id | %o', e);
    res.status(400).send(e);
  }
});

// POST /users
router.post('/', async (req, res) => {
  try {
    const { _uid } = req.body;
    const body = {
      _uid,
      _tickets: [],
      _reservations: [],
      _recruit: null
    };
    const createdUser = await User.create(body);

    res.status(200).send(createdUser);
  } catch (e) {
    logger && logger.error('POST /users | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
