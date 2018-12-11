const express = require('express');

const AWS = require('aws-sdk');
const fs = require('fs');
const firebase = require('firebase');
const sharp = require('sharp');

const formPromise = require('./helpers/formidablePromise');
const { Recruit } = require('../model/recruit');

const router = express.Router();
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

AWS.config.region = 'ap-northeast-2';

router.post('/upload', async (req, res) => {
  try {
    const { uid } = req.query;

    const { err, fields, files } = await formPromise(req);
    if (err) throw new Error(err);

    const promises = Object.keys(files).map(async fileType => {
      const s3 = new AWS.S3();
      await sharp(files[fileType].path)
        .rotate()
        .toFile(`/home/ubuntu/${files[fileType].name}`);
      await sharp(files[fileType].path)
        .rotate()
        .resize(200, 200)
        .toFile(`/home/ubuntu/${files[fileType].name}_thumb`);

      const randomName = Math.floor(Math.random() * 1000000) + files[fileType].name;
      const params = {
        Bucket: 'dreamary',
        Key: randomName,
        ACL: 'public-read',
        Body: fs.createReadStream(`/home/ubuntu/${files[fileType].name}`)
      };

      await s3
        .upload({
          ...params,
          Body: fs.createReadStream(`/home/ubuntu/${files[fileType].name}_thumb`),
          Key: `${randomName}_thumb`
        })
        .promise(); // thumb 이미지 저장
      const data = await s3.upload(params).promise(); // 원본 이미지 저장
      fs.unlink(files[fileType].path);
      fs.unlink(`/home/ubuntu/${files[fileType].name}`);
      fs.unlink(`/home/ubuntu/${files[fileType].name}_thumb`);
      if (['cert_mh', 'cert_jg', 'profile'].includes(fileType)) {
        await firebase
          .database()
          .ref(`/users/${uid}`)
          .update({ [fileType]: data.Location });
      } else {
        return data.Location;
      }
    });

    let Locations = await Promise.all(promises);
    Locations = Locations.filter(loc => !!loc);
    if (Locations.length) {
      const snapshot = await firebase
        .database()
        .ref(`/users/${uid}`)
        .once('value');

      let { portfolios } = snapshot.val();
      if (!portfolios) portfolios = [];
      portfolios = portfolios.concat(Locations);
      await firebase
        .database()
        .ref(`/users/${uid}`)
        .update({ portfolios });
    }

    res.status(200).send(req.files);
  } catch (e) {
    if (logger) logger.error('/upload | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
