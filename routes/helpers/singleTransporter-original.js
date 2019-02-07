const nodemailer = require('nodemailer');
const config = require('../../config');

const transporter = nodemailer.createTransport({
  service: 'naver',
  auth: {
    user: config.EMAIL.ID,
    pass: config.EMAIL.PASSWORD
  },
  pool: true
});

export default transporter;
