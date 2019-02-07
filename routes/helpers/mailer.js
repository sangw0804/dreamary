"use strict";

var _singleTransporter = _interopRequireDefault(require("./singleTransporter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create reusable transporter object using the default SMTP transport
// send mail with defined transport object
var sendMailPromise = function sendMailPromise(alarmTalkError, options) {
  return new Promise(function (resolve, reject) {
    var mailOptions = {
      from: 'dreamary@naver.com',
      // sender address
      to: 'kwshim@dreamary.net, thlee@dreamary.net, jypark@dreamary.net, help@dreamary.net, dev@dreamary.net',
      // list of receivers
      subject: '알림톡 전송 실패!!!!!',
      // Subject line
      text: "".concat(new Date(), " \n ").concat(JSON.stringify(alarmTalkError), " \n ").concat(JSON.stringify(options)) // plain text body

    };

    _singleTransporter.default.sendMail(mailOptions, function (error, info) {
      if (error) reject(error);else resolve(info);

      _singleTransporter.default.close();
    });
  });
};

module.exports = {
  sendMailPromise: sendMailPromise
};
