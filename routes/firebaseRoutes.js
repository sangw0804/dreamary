const express = require('express');

const AWS = require('aws-sdk');
const fs = require('fs');
const firebase = require('firebase');

const formPromise = require('./helpers/formidablePromise');
const { Recruit } = require('../model/recruit');

const router = express.Router();
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

AWS.config.region = 'ap-northeast-2';

router.post('/upload', async (req, res) => {
  try {
    const { uid } = req.query;
    const randomNum = Math.floor(Math.random() * 1000000);

    const { err, fields, files } = await formPromise(req);
    if (err) throw new Error(err);

    const promises = Object.keys(files).map(async fileType => {
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'dreamary',
        Key: randomNum + files[fileType].name,
        ACL: 'public-read',
        Body: fs.createReadStream(files[fileType].path)
      };

      const data = await s3.upload(params).promise();
      fs.unlink(files[fileType].path);
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
    logger && logger.error('/upload | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
