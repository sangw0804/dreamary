const express = require('express');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');

const router = express.Router({ mergeParams: true });

const formPromise = require('./helpers/formidablePromise');
const { Event } = require('../model/event');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

AWS.config.region = 'ap-northeast-2';

// GET /events/:id
router.get('/:id', async (req, res) => {
  try {
    const foundEvent = await Event.findById(req.params.id);

    res.status(200).send(foundEvent);
  } catch (e) {
    if (logger) logger.error('GET /events/:id | %o', e);
    res.status(400).send(e);
  }
});

// GET /events
router.get('/', async (req, res) => {
  try {
    const foundEvents = await Event.find();

    res.status(200).send(foundEvents);
  } catch (e) {
    if (logger) logger.error('GET /events | %o', e);
    res.status(400).send(e);
  }
});

// POST /events
router.post('/', async (req, res) => {
  try {
    const { title, content, until } = req.body;
    const createdEvent = await Event.create({ title, content, until, createdAt: new Date().getTime() });

    res.status(200).send(createdEvent);
  } catch (e) {
    if (logger) logger.error('POST /events | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /events/:id/images
router.patch('/:id/images', async (req, res) => {
  try {
    // TODO: 사진 업로드 로직이 여러군데에서 사용중, 모듈화 하기
    const { err, files, fields } = await formPromise(req);
    if (err) throw new Error(err);

    const event = await Event.findById(req.params.id);

    const promises = Object.keys(files).map(async fileKey => {
      const randomNum = Math.floor(Math.random() * 1000000);
      const s3 = new AWS.S3();
      await sharp(files[fileKey].path)
        .rotate()
        .toFile(`/home/ubuntu/${files[fileKey].name}`);
      await sharp(files[fileKey].path)
        .rotate()
        .toFile(`/home/ubuntu/${files[fileKey].name}_thumb`);
      const params = {
        Bucket: 'dreamary',
        Key: randomNum + files[fileKey].name,
        ACL: 'public-read',
        Body: fs.createReadStream(`/home/ubuntu/${files[fileKey].name}`)
      };

      await s3
        .upload({
          ...params,
          Body: fs.createReadStream(`/home/ubuntu/${files[fileKey].name}_thumb`),
          Key: `${randomNum + files[fileKey].name}_thumb`
        })
        .promise();
      const data = await s3.upload(params).promise();

      fs.unlink(files[fileKey].path);
      fs.unlink(`/home/ubuntu/${files[fileKey].name}`);
      fs.unlink(`/home/ubuntu/${files[fileKey].name}_thumb`);

      return data.Location;
    });

    const locations = await Promise.all(promises);

    event.images = event.images.concat(locations);
    await event.save();

    res.status(200).send(event);
  } catch (e) {
    if (logger) logger.error('PATCH /events/:id/images | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /events/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true });

    res.status(200).send(updatedEvent);
  } catch (e) {
    if (logger) logger.error('PATCH /events/:id | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /events/:id/images/:index
router.delete('/:id/images/:index', async (req, res) => {
  try {
    const foundEvent = await Event.findById(req.params.id);
    if (!foundEvent) throw new Error('event not found!');

    foundEvent.images.splice(req.params.index, 1);
    await foundEvent.save();

    res.status(200).send(foundEvent);
  } catch (e) {
    if (logger) logger.error('DELETE /events/:id/images/:index | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /events/:id
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).send({});
  } catch (e) {
    if (logger) logger.error('DELETE /events/:id | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
