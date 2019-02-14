const express = require('express');

const router = express.Router({ mergeParams: true });

const { uploadFile } = require('./helpers/fileUpload');
const { Event } = require('../model/event');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

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
    const locations = await uploadFile(req, true);

    const event = await Event.findById(req.params.id);
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
