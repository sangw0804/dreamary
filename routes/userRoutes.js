const express = require('express');

const router = express.Router();
const { User } = require('../model/user');
const logger = require('../log');

// GET /users
router.get('/', async (req, res) => {
  try {
    const foundUsers = await User.find();
    res.status(200).send(foundUsers);
  } catch (e) {
    res.send(400).send(e);
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
//	logger.error('POST /users : %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
