const mongoose = require('mongoose');

const { User } = require('./user');
const { Card } = require('./card');
const { updateIdArray, updateTimeArray } = require('./helpers/updateArray');

const reservationSchema = new mongoose.Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    _designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    _card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    },
    date: {
      // 예약 날짜 09:00의 타임스탬프
      type: Number,
      required: true
    },
    time: {
      // 예약 시간 ex. 14:00 ~ 16:00 인 경우 { since: 840, until: 960 }
      since: {
        type: Number,
        required: true
      },
      until: {
        type: Number,
        required: true
      }
    },
    services: {
      // 예약한 서비스 true
      cut: Boolean,
      perm: Boolean,
      dye: Boolean
    },
    isCanceled: {
      // 예약 취소 여부
      type: Boolean,
      default: false
    },
    cancelReason: String, // 취소 이유
    isDone: {
      // 완료 여부
      type: Boolean,
      default: false
    },
    _review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null
    },
    cancelByUser: Boolean, // 유저에 의해 취소했는지 여부
    createdAt: {
      // 생성시간
      type: Number,
      required: true
    },
    updatedAt: {
      // 수정시간
      type: Number
    }
  },
  {
    versionKey: false
  }
);

reservationSchema.methods.updateRelatedDB = async function updateHandler() {
  // reservation이 바뀔 경우 user, designer, card 의 참조값들이 바뀌게 된다.
  const reservation = this;
  const user = await User.findById(reservation._user);
  const designer = await User.findById(reservation._designer);
  const card = await Card.findById(reservation._card);

  if (!user || !designer) throw new Error('user || designer not found!!');

  const temp = user._reservations.map(r => r.toHexString());
  if (temp.includes(reservation._id.toHexString())) {
    card.reservedTimes = card.reservedTimes.filter(reservedTime => reservedTime.since !== reservation.time.since);
    await card.save();
    return;
  }

  user._reservations = updateIdArray(user._reservations, reservation._id);
  designer._reservations = updateIdArray(designer._reservations, reservation._id);
  card.reservedTimes = updateTimeArray(card.reservedTimes, reservation.time);

  await user.save();
  await designer.save();
  await card.save();
};

reservationSchema.methods.removeRelatedDB = async function removeHandler() {
  // reservation이 삭제되면 user, designer, card에 있던 reservation참조값도 같이 삭제된다.
  const reservation = this;

  const user = await User.findById(reservation._user);
  user._reservations = user._reservations.filter(reserve => reserve.toHexString() !== reservation._id);
  const designer = await User.findById(reservation._designer);
  designer._reservations = designer._reservations.filter(reserve => reserve.toHexString() !== reservation._id);
  const card = await Card.findById(reservation._card);
  card.reservedTimes = card.reservedTimes.filter(time => time.since !== reservation.time.since);

  await user.save();
  await designer.save();
  await card.save();
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = { Reservation };
