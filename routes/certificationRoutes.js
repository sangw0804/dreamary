const express = require('express');
const axios = require('axios');

const router = express.Router({ mergeParams: true });
const config = require('../config');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

// POST /certification
router.post('/', async (req, res) => {
  try {
    const { imp_uid } = req.body;
    if (!imp_uid) throw new Error('imp_uid is undefined!');

    const {
      response: { access_token }
    } = await axios.post(
      'https://api.iamport.kr/users/getToken',
      {
        imp_key: config.IMP_KEY,
        imp_secret: config.IMP_SECRET
      },
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    console.log(access_token);
    // const { response, message } = await axios.get(`https://api.iamport.kr/certifications/${imp_uid}`, {
    //   headers: { Authorization: access_token }
    // });
    // console.log(response);
    // console.log(message);
    // console.log(typeof message);

    res.status(200).send('hi');
  } catch (e) {
    logger && logger.error(e);
    res.status(400).send(e);
  }
});

module.exports = router;
