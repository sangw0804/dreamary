const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _uid: {
      type: String,
      required: true
    },
    reservationCount: {
      type: Number,
      default: 0
    },
    name: String,
    _tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
      }
    ],
    _reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
      }
    ],
    _recruit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruit'
    },
    addresses: [
      {
        extraAddress: String,
        fullAddress: String,
        sido: String,
        sigungu: String
      }
    ],
    birthday: {
      day: String,
      month: String,
      year: String
    },
    career: Number,
    careerDetail: String,
    cert_jg: String,
    cert_mh: String,
    email: String,
    gender: String,
    introduce: String,
    isApproval: Boolean,
    isD: Boolean,
    isRegister: Boolean,
    point: {
      type: Number,
      default: 0
    },
    money: {
      type: Number,
      default: 0
    },
    penalty: Number,
    phoneNumber: String,
    portfolios: [String],
    profile: String,
    untilDesigner: Number,
    recommendation: Number,
    recommendationCode: String,
    designerRecommendation: Number,
    designerRecommendationCode: String,
    yeinbub: String,
    withdrawal: String,
    expiredAt: {
      type: Number,
      default: null
    },
    createdAt: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
