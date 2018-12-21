const express = require('express');

const router = express.Router({ mergeParams: true });
const { Inquiry } = require('../model/inquiry');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});

    res.status(200).send(inquiries);
  } catch (e) {
    if (logger) logger.error('GET /inquiries || %o', e);
    res.status(400).send(e);
  }
});

// POST /inquiries
router.post('/', async (req, res) => {
  try {
    const { _user, title, name, email, content } = req.body;
    const inquiry = await Inquiry.create({ _user, title, name, email, content, createdAt: new Date().getTime() });

    res.status(200).send(inquiry);
  } catch (e) {
    if (logger) logger.error('POST /inquiries || %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
