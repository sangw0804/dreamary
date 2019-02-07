// create reusable transporter object using the default SMTP transport
import transporter from './singleTransporter';

// send mail with defined transport object
const sendMailPromise = (alarmTalkError, options) => new Promise((resolve, reject) => {
  const mailOptions = {
    from: 'dreamary@naver.com', // sender address
    to: 'kwshim@dreamary.net, thlee@dreamary.net, jypark@dreamary.net, help@dreamary.net, dev@dreamary.net', // list of receivers
    subject: '알림톡 전송 실패!!!!!', // Subject line
    text: `${new Date()} \n ${JSON.stringify(alarmTalkError)} \n ${JSON.stringify(options)}` // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) reject(error);
    else resolve(info);

    transporter.close();
  });
});

module.exports = { sendMailPromise };
