const express = require('express');

const AWS = require('aws-sdk');
const fs = require('fs');
const firebase = require('firebase');
// const formidable = require('formidable');
const formPromise = require('./helpers/formidablePromise');
const { Recruit } = require('../model/recruit');

const router = express.Router();
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

AWS.config.region = 'ap-northeast-2';

router.post('/upload', async (req, res) => {
  try {
    // const form = new formidable.IncomingForm();
    const { uid } = req.query;
    const randomNum = Math.floor(Math.random() * 1000000);

    const { err, fields, files } = await formPromise(req);
    if (err) throw new Error(err);
    for (let fileType of Object.keys(files)) {
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'dreamary',
        Key: randomNum + files[fileType].name,
        ACL: 'public-read',
        Body: fs.createReadStream(files[fileType].path)
      };

      const data = await s3.upload(params).promise();
      if (['cert_mh', 'cert_jg', 'profile'].includes(fileType)) {
        await firebase
          .database()
          .ref(`/users/${uid}`)
          .update({ [fileType]: data.Location });

        fs.unlink(files[fileType].path);
      } else {
        const snapshot = await firebase
          .database()
          .ref(`/users/${uid}`)
          .once('value');

        let { portfolios } = snapshot.val();
        if (!portfolios) portfolios = [];
        portfolios.push(data.Location);

        await firebase
          .database()
          .ref(`/users/${uid}`)
          .update({ portfolios });
        fs.unlink(files[fileType].path);
      }
    }

    //   s3.upload(params, (err, data) => {
    //     if (err) throw new Error('something wrong!');
    //     console.log(fileType);

    //     if (['cert_mh', 'cert_jg', 'profile'].includes(fileType)) {
    //       firebase
    //         .database()
    //         .ref(`/users/${uid}`)
    //         .update({ [fileType]: data.Location })
    //         .then(() => {
    //           fs.unlink(files[fileType].path);
    //         });
    //     } else {
    //       firebase
    //         .database()
    //         .ref(`/users/${uid}`)
    //         .once('value')
    //         .then(snapshot => {
    //           let { portfolios } = snapshot.val();
    //           if (!portfolios) portfolios = [];
    //           portfolios.push(data.Location);
    //           console.log(portfolios);
    //           firebase
    //             .database()
    //             .ref(`/users/${uid}`)
    //             .update({ portfolios })
    //             .then(() => {
    //               fs.unlink(files[fileType].path);
    //             });
    //         });
    //     }
    //   });
    // });

    // form.parse(req, (err, fields, files) => {
    //   Object.keys(files).forEach(fileType => {
    //     const s3 = new AWS.S3();
    //     const params = {
    //       Bucket: 'dreamary',
    //       Key: randomNum + files[fileType].name,
    //       ACL: 'public-read',
    //       Body: fs.createReadStream(files[fileType].path)
    //     };
    //     s3.upload(params, (err, data) => {
    //       if (err) throw new Error('something wrong!');
    //       console.log(fileType);

    //       if (['cert_mh', 'cert_jg', 'profile'].includes(fileType)) {
    //         firebase
    //           .database()
    //           .ref(`/users/${uid}`)
    //           .update({ [fileType]: data.Location })
    //           .then(() => {
    //             fs.unlink(files[fileType].path);
    //           });
    //       } else {
    //         firebase
    //           .database()
    //           .ref(`/users/${uid}`)
    //           .once('value')
    //           .then(snapshot => {
    //             let { portfolios } = snapshot.val();
    //             if (!portfolios) portfolios = [];
    //             portfolios.push(data.Location);
    //             console.log(portfolios);
    //             firebase
    //               .database()
    //               .ref(`/users/${uid}`)
    //               .update({ portfolios })
    //               .then(() => {
    //                 fs.unlink(files[fileType].path);
    //               });
    //           });
    //       }
    //     });
    //   });
    // });

    res.status(200).send(req.files);
  } catch (e) {
    logger && logger.error('/upload | %o', e);
    console.log(e);
  }
});

module.exports = router;
