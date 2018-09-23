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
  isCanceled: {
    type: Boolean,
    default: false
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = { Reservation };
