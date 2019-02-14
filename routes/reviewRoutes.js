const express = require('express');

const router = express.Router({ mergeParams: true });

const { Review } = require('../model/review');
const { Recruit } = require('../model/recruit');
const { User } = require('../model/user');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;
const { uploadFile } = require('./helpers/fileUpload');

// GET /recruits/:recruit_id/reviews/:id
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new Error('review not found!!');

    res.status(200).send(review);
  } catch (e) {
    if (logger) logger.error('GET /recruits/:recruit_id/reviews/:id | %o', e);
    res.status(400).send(e);
  }
});

// POST /recruits/:recruit_id/reviews
router.post('/', async (req, res) => {
  try {
    const { _user, content, score, _reservation } = req.body;
    const body = {
      _user,
      content,
      score,
      _reservation,
      _recruit: req.params.recruit_id,
      createdAt: new Date().getTime()
    };

    const createdReview = await Review.create(body);
    await createdReview.updateRelatedDBs();

    const recruit = await Recruit.findById(body._recruit);
    const plusPoint = recruit._reviews.length === 1 ? 5000 : 1000;
    const user = await User.findByIdAndUpdate(_user, { $inc: { point: plusPoint } }, { new: true });

    res.status(200).send(user);
  } catch (e) {
    if (logger) logger.error('POST /recruits/:recruit_id/reviews | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /recruits/:recruit_id/reviews/:id/images
router.patch('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;

    const fileLocations = await uploadFile(req);

    const review = await Review.findById(id);
    review.images = review.images.concat(fileLocations);
    await review.save();

    res.status(200).send(review);
  } catch (e) {
    if (logger) logger.error('PATCH /recruits/:recruit_id/reviews/:id/images | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /recruits/:recruit_id/reviews/:id/images/:index
router.delete('/:id/images/:index', async (req, res) => {
  try {
    const { id, index } = req.params;

    const review = await Review.findById(id);
    review.images.splice(+index, 1);
    await review.save();

    res.status(200).send(review);
  } catch (e) {
    if (logger) logger.error('DELETE /recruits/:recruit_id/reviews/:id/images/:index | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /recruits/:recruit_id/reviews/:id
router.patch('/:id', async (req, res) => {
  try {
    const { content, score } = req.body;

    const updatedReview = await Review.findById(req.params.id);
    updatedReview.content = content;
    const originalScore = updatedReview.score;
    updatedReview.score = score;

    await updatedReview.save();
    await updatedReview.updateRelatedDBs(originalScore);

    res.status(200).send(updatedReview);
  } catch (e) {
    if (logger) logger.error('PATCH /recruits/:recruit_id/reviews/:id | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /recruits/:recruit_id/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    await review.remove();
    await review.removeRelatedDBs();

    res.status(200).send({});
  } catch (e) {
    if (logger) logger.error('DELETE /recruits/:recruit_id/reviews/:id | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
