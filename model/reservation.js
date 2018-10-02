const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
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
    cut: Number,
    perm: Number,
    dye: Number
  },
  isCanceled: {
    type: Boolean,
    default: false
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = { Reservation };
