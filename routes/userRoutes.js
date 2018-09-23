const express = require('express');

const router = express.Router();
const { User } = require('../model/user');

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
    const { isD, phone, _uid, name } = req.body;
    const body = {
      _uid,
      isD,
      phone,
      name,
      _tickets: [],
      _reservations: []
    };
    const createdUser = await User.create(body);

    res.status(200).send(createdUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
