const express = require('express');
const axios = require('axios');
const { Iamporter, IamporterError } = require('iamporter');

const router = express.Router({ mergeParams: true });
const config = require('../config');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// POST /certification
router.post('/', async (req, res) => {
  try {
    const { imp_uid } = req.body;
    if (!imp_uid) throw new Error('imp_uid is undefined!');

    const iamporter = new Iamporter({
      apiKey: config.IMP_KEY,
      secret: config.IMP_SECRET
    });

    const result = await iamporter.getCertification(imp_uid);
    console.log(result);

    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    logger && logger.error(e);
    res.status(400).send(e);
  }
});

module.exports = router;
