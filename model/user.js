const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _uid: {
      type: String,
      required: true
    },
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
    point: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
