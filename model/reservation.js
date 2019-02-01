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
      type: Number,
      required: true
    },
    time: {
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
      cut: Boolean,
      perm: Boolean,
      dye: Boolean
    },
    isCanceled: {
      type: Boolean,
      default: false
    },
    cancelReason: String,
    isDone: {
      type: Boolean,
      default: false
    },
    _review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null
    },
    cancelByUser: Boolean,
    createdAt: {
      type: Number,
      required: true
    },
    updatedAt: {
      type: Number
    }
  },
  {
    versionKey: false
  }
);

reservationSchema.methods.updateRelatedDB = async function updateHandler() {
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
