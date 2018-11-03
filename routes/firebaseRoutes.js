const express = require('express');

const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');
const firebase = require('firebase');

const router = express.Router();
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

AWS.config.region = 'ap-northeast-2';

router.post('/upload', (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    const { uid } = req.query;
    const randomNum = Math.floor(Math.random() * 1000000);
    form.parse(req, (err, fields, files) => {
      Object.keys(files).forEach(fileType => {
        const s3 = new AWS.S3();
        const params = {
          Bucket: 'dreamary',
          Key: randomNum + files[fileType].name,
          ACL: 'public-read',
          Body: fs.createReadStream(files[fileType].path)
        };
        s3.upload(params, (err, data) => {
          if (err) throw new Error('something wrong!');

          firebase
            .database()
            .ref(`/users/${uid}`)
            .update({ [fileType]: data.Location });
        });
      });
    });

    res.status(200).send(req.files);
  } catch (e) {
    logger && logger.error('/upload | %o', e);
    console.log(e);
  }
});

module.exports = router;
