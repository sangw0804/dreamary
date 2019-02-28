const mongoose = require('mongoose');

const { Recruit } = require('./recruit');
const { updateIdArray } = require('./helpers/updateArray');
const logger = require('../log');

const cardSchema = new mongoose.Schema(
  {
    _recruit: {
      // card -> recruit 참조값
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruit',
      required: true
    },
    date: {
      // 카드 날찌 (해당 날짜의 09:00 타임스탬프값)
      required: true,
      type: Number
    },
    ableTimes: [
      // 가능 시간 범위 객체
      {
        since: Number, // 00:00 ~ 24:00 까지를 분 단위로 저장. 예를 들어 15:00 ~ 19:30 까지 가능하다면
        until: Number // { since: 900, until: 1170 } 로서 저장
      }
    ],
    reservedTimes: [
      // 예약된 시간 범위 객체
      {
        since: Number, // ableTimes 객체와 같은 형식
        until: Number
      }
    ],
    reservable: {
      // 예약 가능 여부
      type: Boolean,
      default: true
    },
    permPrice: {
      // 펌 기장별 가격
      normal: Number, // 일반
      chin: Number, // 턱
      shoulder: Number, // 어깨
      chest: Number // 가슴
    },
    dyePrice: {
      // 염색 기장별 가격
      normal: Number,
      chin: Number,
      shoulder: Number,
      chest: Number
    },
    must: {
      // 필수 시술 여부
      cut: {
        type: Boolean,
        default: false
      },
      perm: {
        type: Boolean,
        default: false
      },
      dye: {
        type: Boolean,
        default: false
      }
    },
    no: {
      // 불가 시술 여부
      cut: {
        type: Boolean,
        default: false
      },
      perm: {
        type: Boolean,
        default: false
      },
      dye: {
        type: Boolean,
        default: false
      }
    },
    sido: String, //  ex. "서울"
    sigungu: String, // ex. "강남구"
    fullAddress: String, // ex. "서울시 강남구 안암로 413 길 22"
    shop: String, // ex. "주노헤어 강남점"
    requireGender: String, // 가능 성별 ex. "male" or "female" or "both"
    picture: String, // 사진촬영여부 ex. "사진 필수 모자이크 O"
    createdAt: {
      // 생성 시간 (타임스탬프)
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const sortHelper = (a, b) => a.since - b.since;

function sortTimes(next) {
  // 가능 시간과 예약 시간을 시간순으로 정렬하는 헬퍼 함수
  const card = this;
  card.ableTimes.sort(sortHelper);
  card.reservedTimes.sort(sortHelper);
  next();
}

async function updateReservable() {
  // 예약 시간과 가능 시간 들을 확인하면서 reservable 판단.
  const card = this;
  const { reservedTimes, ableTimes, must } = card;

  let largestAbleTime = 0; // 가장 긴 가능시간.
  ableTimes.forEach(time => {
    // 예약 시간 중 해당 가능 시간(time) 안쪽에 있는 예약 시간들을 reserveds에 넣는다.
    const reserveds = reservedTimes.filter(rt => rt.until <= time.until && rt.since >= time.since);
    if (!reserveds.length) {
      // 해당 가능 시간 안쪽에 예약 시간이 없으면 해당 가능 시간의 길이가 가장 긴 가능시간이 될 수 있다.
      largestAbleTime = Math.max(largestAbleTime, time.until - time.since);
      return;
    }

    let endPoint = time.since;
    let tempLargest = 0;
    reserveds.forEach(reserved => {
      // 예약 시간들을 확인하면서 가장 큰 임시 가능시간 찾기
      tempLargest = Math.max(tempLargest, reserved.since - endPoint);
      endPoint = reserved.until;
    });
    tempLargest = Math.max(tempLargest, time.until - endPoint);
    largestAbleTime = Math.max(largestAbleTime, tempLargest);
  });

  // 최소 필요 시간 구하기
  const { requireTime } = await Recruit.findById(card._recruit);
  const times = [];

  Object.keys(must).forEach(key => {
    if (key !== '$init' && must[key]) times.push(requireTime[key]);
  });

  let leastNeededTime = times.reduce((accu, curr) => accu + curr, 0);
  if (!times.length) leastNeededTime = Math.min(...Object.values(requireTime).filter(t => typeof t === 'number'));
  card.reservable = largestAbleTime >= leastNeededTime; // 최소 필요 시간과 가장 큰 가능시간을 비교해 reservable 결정하기
}

async function validateRecruit() {
  const recruit = await Recruit.findById(this._recruit);

  if (!recruit) throw new Error('recruit not found!');
}

cardSchema.methods.updateRecruitDB = async function updateHandler() {
  // recruit의 _cards 배열 정리하기
  const recruit = await Recruit.findById(this._recruit);

  recruit._cards = updateIdArray(recruit._cards, this._id);
  await recruit.save();
};

cardSchema.methods.removeRecruitDB = async function removeHandler() {
  const recruit = await Recruit.findById(this._recruit);

  recruit._cards = recruit._cards.filter(_card => _card._id.toHexString() !== this._id.toHexString());
  await recruit.save();
};

cardSchema.pre('save', validateRecruit);
cardSchema.pre('save', sortTimes);
cardSchema.pre('save', updateReservable);
cardSchema.pre('remove', sortTimes);
cardSchema.pre('remove', updateReservable);

const Card = mongoose.model('Card', cardSchema);

module.exports = { Card };
