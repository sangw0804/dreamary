const mongoose = require('mongoose');

// 출금신청 db 스키마

const withdrawSchema = new mongoose.Schema({
  _designer: {
    // 신청한 디자이너 _id값
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    // 신청자 이름
    type: mongoose.Schema.Types.String,
    required: true
  },
  socialId: {
    // 주민번호
    type: mongoose.Schema.Types.String,
    required: true
  },
  address: {
    // 주소
    type: mongoose.Schema.Types.String,
    required: true
  },
  email: {
    // 이메일
    type: mongoose.Schema.Types.String,
    required: true
  },
  accountHolder: {
    // 예금주명
    type: mongoose.Schema.Types.String,
    required: true
  },
  bank: {
    // 은행명
    type: mongoose.Schema.Types.String,
    required: true
  },
  accountNumber: {
    // 계좌번호
    type: mongoose.Schema.Types.String,
    required: true
  },
  money: {
    // 출금금액
    type: mongoose.Schema.Types.Number,
    required: true
  },
  isRefused: {
    // 반려 여부
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  updatedAt: {
    // 수정 일시
    type: mongoose.Schema.Types.Number,
    default: null
  },
  createdAt: {
    // 생성 일시
    type: mongoose.Schema.Types.Number,
    required: true
  }
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = { Withdraw };
