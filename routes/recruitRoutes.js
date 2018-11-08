const express = require('express');

const router = express.Router();
const { Recruit } = require('../model/recruit');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// GET /recruits
router.get('/', async (req, res) => {
  try {
    const foundRecruits = await Recruit.find({})
      .populate('_designer')
      .populate('_cards')
      .exec();
    res.status(200).send(foundRecruits);
  } catch (e) {
    logger && logger.error('GET /recruits | %o', e);
    res.status(400).send(e);
  }
});

// GET /recruits/:id
router.get('/:id', async (req, res) => {
  try {
    const foundRecruit = await Recruit.findById(req.params.id)
      .populate('_designer')
      .populate({
        path: '_reviews',
        populate: { path: '_user' }
      })
      .populate('_cards')
      .exec();
    if (!foundRecruit) {
      throw new Error('recruit not found!!');
    }
    res.status(200).send(foundRecruit);
  } catch (e) {
    logger && logger.error('GET /recruits/:id | %o', e);
    res.status(400).send(e);
  }
});

// POST /recruits
// TODO: 한명의 디자이너가 한개의 recruit만을 가지게 하려면 어떻게 할까?
router.post('/', async (req, res) => {
  try {
    const { title, _designer, _cards, portfolios, requireTime, requirement, _reviews, shops } = req.body;
    const createdRecruit = await Recruit.create({
      title,
      _designer,
      _cards,
      portfolios,
      requirement,
      shops,
      _reviews,
      requireTime
    });
    await createdRecruit.updateRelatedDB();

    res.status(200).send(createdRecruit);
  } catch (e) {
    logger && logger.error('POST /recruits | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /recruits/:id/updateportpolios
router.patch('/:id/updateportpolios', async (req, res) => {
  try {
    const { remove } = req.body;
    const foundRecruit = await Recruit.findById(req.params.id);
    if (!foundRecruit) throw new Error('Recruit not found!!');
    foundRecruit.portfolios = foundRecruit.portfolios.filter(url => url !== remove);
    await foundRecruit.save();

    res.status(200).send(foundRecruit);
  } catch (e) {
    logger && logger.error('PATCH /recruits/:id | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /recruits/:id
router.patch('/:id', async (req, res) => {
  try {
    const { title, _designer, _cards, portfolios, requireTime, requirement, _reviews, shops } = req.body;
    const updatedRecruit = await Recruit.findByIdAndUpdate(
      req.params.id,
      { $set: { title, _designer, _cards, portfolios, requireTime, requirement, _reviews, shops } },
      { new: true }
    );
    if (!updatedRecruit) {
      throw new Error('user not found!');
    }
    res.status(200).send(updatedRecruit);
  } catch (e) {
    logger && logger.error('PATCH /recruits/:id | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /recruits/:id
router.delete('/:id', async (req, res) => {
  try {
    const recruit = await Recruit.findById(req.params.id);
    await recruit.remove();
    await recruit.removeRelatedDB();
    res.status(200).send({});
  } catch (e) {
    logger && logger.error('DELETE /recruits/:id | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
