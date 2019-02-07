"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var nodemailer = require('nodemailer');

var config = require('../../config');

var transporter = nodemailer.createTransport({
  service: 'naver',
  auth: {
    user: config.EMAIL.ID,
    pass: config.EMAIL.PASSWORD
  },
  pool: true
});
var _default = transporter;
exports.default = _default;
