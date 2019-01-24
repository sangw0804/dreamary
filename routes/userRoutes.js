const express = require('express');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');

const router = express.Router();
const { User } = require('../model/user');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;
const formPromise = require('./helpers/formidablePromise');

AWS.config.region = 'ap-northeast-2';

// GET /users
router.get('/', async (req, res) => {
  try {
    const foundUsers = await User.find()
      .populate({ path: '_recruit', populate: { path: '_cards' } })
      .populate('_reservations')
      .exec();
    res.status(200).send(foundUsers);
  } catch (e) {
    if (logger) logger.error('GET /users | %o', e);
    res.status(400).send(e);
  }
});

// GET /users/uid/:uid

router.get('/uid/:uid', async (req, res) => {
  try {
    const foundUser = (await User.find({ _uid: req.params.uid }))[0];

    res.status(200).send(foundUser || {});
  } catch (e) {
    if (logger) logger.error('GET /users/uid/:uid | %o', e);
    res.status(400).send(e);
  }
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id)
      .populate({ path: '_recruit' })
      .populate({ path: '_reservations' })
      .exec();
    res.status(200).send(foundUser);
  } catch (e) {
    if (logger) logger.error('GET /users/:id | %o', e);
    res.status(400).send(e);
  }
});

// POST /users
router.post('/', async (req, res) => {
  try {
    const { _uid, name } = req.body;
    const body = { _uid, _tickets: [], _reservations: [], _recruit: null, name, createdAt: new Date().getTime() };
    const createdUser = await User.create(body);

    res.status(200).send(createdUser);
  } catch (e) {
    if (logger) logger.error('POST /users | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /users/:id/images
router.patch('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const { err, files, fields } = await formPromise(req);
    if (err) throw new Error(err);

    const user = await User.findById(id);

    const promises = Object.keys(files).map(async fileKey => {
      const randomNum = Math.floor(Math.random() * 1000000);
      const s3 = new AWS.S3();
      await sharp(files[fileKey].path)
        .rotate()
        .toFile(`/home/ubuntu/${files[fileKey].name}`);
      await sharp(files[fileKey].path)
        .rotate()
        .resize(200, 200)
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

      if (fileKey === 'cert_jg') {
        user.cert_jg = data.Location;
      } else if (fileKey === 'profile') {
        user.profile = data.Location;
      } else {
        return data.Location;
      }
    });

    const fileLocations = (await Promise.all(promises)).filter(loc => loc);

    user.portfolios = user.portfolios.concat(fileLocations);
    await user.save();

    res.status(200).send(user);
  } catch (e) {
    if (logger) logger.error('PATCH /users/:id/images | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /users/:id/addpoint
router.patch('/:id/addpoint', async (req, res) => {
  try {
    const { point } = req.body;
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) throw new Error('user not found!');
    foundUser.point += point;
    await foundUser.save();

    res.status(200).send(foundUser);
  } catch (e) {
    if (logger) logger.error('PATCH /users/:id/addpoint | %o', e);
    res.status(400).send(e);
  }
});

// PATCH /users/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true });
    if (!updatedUser) throw new Error('user not found!');

    res.status(200).send(updatedUser);
  } catch (e) {
    if (logger) logger.error('PATCH /users/:id | %o', e);
    res.status(400).send(e);
  }
});

// DELETE /users/:id/images/:index
router.delete('/:id/images/:index', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('user not found!');

    user.portfolios.splice(req.params.index, 1);
    await user.save();

    res.status(200).send(user);
  } catch (e) {
    if (logger) logger.error('DELETE /users/:id/images/:index | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
