const express = require('express');

const router = express.Router({ mergeParams: true });
const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.region = 'ap-northeast-2';

const { Review } = require('../model/review');
const { Recruit } = require('../model/recruit');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

function formidablePromise(req, opts) {
  return new Promise(function(resolve, reject) {
    const form = new formidable.IncomingForm(opts);
    form.parse(req, function(err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

// POST /recruits/:recruit_id/reviews
router.post('/', async (req, res) => {
  try {
    const { _user, content, score, _reservation } = req.body;
    const body = {
      _user,
      content,
      score,
      _reservation,
      _recruit: req.params.recruit_id
    };

    const createdReview = await Review.create(body);

    res.status(200).send(createdReview);
  } catch (e) {
    logger && logger.error('POST /recruits/:recruit_id/reviews | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /recruits/:recruit_id/reviews/:id/images
router.patch('/:id/images', async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    const { id } = req.query;
    const { fields, files } = await formidablePromise(req);
    const fileLocations = [];

    for (const fileKey in files) {
      const randomNum = Math.floor(Math.random() * 1000000);
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'dreamary',
        Key: randomNum + files[fileKey].name,
        ACL: 'public-read',
        Body: fs.createReadStream(files[fileKey].path)
      };
      const data = await s3.upload(params).promise();
      fileLocations.push(data.Location);
    }
    const updatedReview = await Review.findByIdAndUpdate(id, { $set: { images: fileLocations } });

    res.status(200).send(updatedReview);
  } catch (e) {
    logger && logger.error('PATCH /recruits/:recruit_id/reviews/:id/images | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /recruits/:recruit_id/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    await review.remove();
    res.status(200).send({});
  } catch (e) {
    console.log(e);
    logger && logger.error('DELETE /recruits/:recruit_id/reviews/:id | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
