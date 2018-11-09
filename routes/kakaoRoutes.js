const express = require('express');

const router = express.Router();
const request = require('request-promise');
const admin = require('firebase-admin');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

router.post('/', async ({ body: { userToken } }, res) => {
  const options = {
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: { Authorization: `Bearer ${userToken}` }
  };

  try {

	logger.info('%o', options);
    const response = await request(options);
    const userData = JSON.parse(response);
	logger.info('%o',userData.id)
    const customToken = await admin.auth().createCustomToken(String(userData.id));
    res.status(200).send({ token: customToken, userData });
  } catch (e) {
    logger && logger.error('kakao_route | %o', e);
    res.status(400).send(e);
  }
});

module.exports = router;
