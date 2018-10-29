const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    _user: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: {
      required: true,
      type: Number
    },
    activatedAt: {
      required: true,
      type: Number
    },
    expiredAt: {
      type: Number,
      default: null
    },
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  {
    versionKey: false
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = { Ticket };
