const express = require('express');

const router = express.Router({ mergeParams: true });

const { Review } = require('../model/review');
const { Recruit } = require('../model/recruit');
const logger = require('../log');

// POST /recruits/:recruit_id/reviews
router.post('/', async (req, res) => {
  try {
    const { _user, content, score, _reservation } = req.body;
    const body = {
      _user,
      content,
      score,
      _reservation,
      createdAt: new Date().getTime(),
      _recruit: req.params.recruit_id
    };

    const createdReview = await Review.create(body);

    res.status(200).send(createdReview);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
