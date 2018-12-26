const express = require('express');

const router = express.Router({ mergeParams: true });

const AWS = require('aws-sdk');
const fs = require('fs');
const sharp = require('sharp');

AWS.config.region = 'ap-northeast-2';

const { Review } = require('../model/review');
const { Recruit } = require('../model/recruit');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;
const formPromise = require('./helpers/formidablePromise');

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

    res.status(200).send(createdReview);
  } catch (e) {
    if (logger) logger.error('POST /recruits/:recruit_id/reviews | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /recruits/:recruit_id/reviews/:id/images
router.patch('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const { err, files, fields } = await formPromise(req);
    if (err) throw new Error(err);

    // if ()
    const promises = Object.keys(files).map(async fileKey => {
      const randomNum = Math.floor(Math.random() * 1000000);
      const s3 = new AWS.S3();
      await sharp(files[fileKey].path)
        .rotate()
        .toFile(`/home/ubuntu/${files[fileKey].name}`);
      const params = {
        Bucket: 'dreamary',
        Key: randomNum + files[fileKey].name,
        ACL: 'public-read',
        Body: fs.createReadStream(`/home/ubuntu/${files[fileKey].name}`)
      };
      const data = await s3.upload(params).promise();

      fs.unlink(files[fileKey].path);
      fs.unlink(`/home/ubuntu/${files[fileKey].name}`);
      return data.Location;
    });

    const fileLocations = await Promise.all(promises);

    const review = await Review.findById(id);
    review.images = review.images.concat(fileLocations);
    await review.save();

    res.status(200).send(review);
  } catch (e) {
    if (logger) logger.error('PATCH /recruits/:recruit_id/reviews/:id/images | %o', e);
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
