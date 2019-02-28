const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _uid: {
      // firebase auth 에서 사용하는 uid
      type: String,
      required: true
    },
    reservationCount: {
      // 유저가 하나의 ticket 기간 안에 완료한 예약 횟수
      type: Number,
      default: 0
    },
    name: String, // 유저 이름
    _tickets: [
      // 디자이너 -> 티겟들 참조
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
      }
    ],
    _reservations: [
      // 유저 -> 예약들 참조
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
      }
    ],
    _recruit: {
      // 디자이너 -> recruit 참조
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruit'
    },
    addresses: [
      // 샵 주소들
      {
        extraAddress: String,
        fullAddress: String,
        sido: String,
        sigungu: String
      }
    ],
    birthday: {
      // 생년월일
      day: String,
      month: String,
      year: String
    },
    career: Number,
    careerDetail: String,
    cert_jg: String, // 면허증/자격증 url
    cert_mh: String, // 더이상 사용하지 않음
    email: String, // 이메일
    gender: String, // 성별
    introduce: String, // 자기소개
    isApproval: Boolean, // 디자이너 승인 여부
    isD: Boolean, // 유저/디자이너 여부
    isRegister: Boolean, // 핸드폰번호 확인 여부
    point: {
      // 유저 포인트
      type: Number,
      default: 0
    },
    money: {
      // 디자이너 money
      type: Number,
      default: 0
    },
    penalty: Number, // 노쇼 등 페널티 (관리자페이지에서 줄 수 있음)
    phoneNumber: String, // 전화번호
    portfolios: [String], // 디자이너 포트폴리오 url들
    profile: String, // 디자이너 프로필사진 url
    untilDesigner: Number, // 디자이너 승급까지 남은 개월수
    recommendation: Number, // 유저 추천받은횟수
    recommendationCode: String, // 유저 추천인 코드
    designerRecommendation: Number, // 디자이너 추천받은 횟수
    designerRecommendationCode: String, // 디자이너 추천인 코드
    yeinbub: String, // 사용하지 않음
    withdrawal: String, // 탈퇴여부
    expiredAt: {
      // 이용권 만료 시간 (타임스탬프)
      type: Number,
      default: null
    },
    createdAt: {
      // 생성시간 (타임스탬프)
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
