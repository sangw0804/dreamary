const express = require('express');

const router = express.Router({ mergeParams: true });

const { Notice } = require('../model/notice');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /notices/:id
router.get('/:id', async (req, res) => {
  try {
    const fountNotice = await Notice.findById(req.params.id);

    res.status(200).send(fountNotice);
  } catch (e) {
    if (logger) logger.error('GET /notices/:id | %o', e);
    res.status(400).send(e);
  }
});

// GET /notices
router.get('/', async (req, res) => {
  try {
    const foundNotices = await Notice.find();

    res.status(200).send(foundNotices);
  } catch (e) {
    if (logger) logger.error('GET /notices | %o', e);
    res.status(400).send(e);
  }
});

// POST /notices
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const createdNotice = await Notice.create({ title, content, createdAt: new Date().getTime() });

    res.status(200).send(createdNotice);
  } catch (e) {
    if (logger) logger.error('POST /notices | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /notices/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true });

    res.status(200).send(updatedNotice);
  } catch (e) {
    if (logger) logger.error('PATCH /notices/:id | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /notices/:id
router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).send({});
  } catch (e) {
    if (logger) logger.error('DELETE /notices/:id | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
