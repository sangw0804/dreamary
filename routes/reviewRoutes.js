const express = require('express');

const router = express.Router({ mergeParams: true });

const { Review } = require('../model/review');
const { Recruit } = require('../model/recruit');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

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
    logger && logger.error('POST /recruits/:recruit_id/reviews | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
