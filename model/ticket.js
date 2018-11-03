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
      type: Number,
      default: null
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

ticketSchema.methods.activate = function() {
  const ticket = this;
  ticket.activatedAt = Math.floor(new Date().getTime() / 86400000) * 86400000;
  let kind = 1;
  if (ticket.price == 28000) kind = 3;
  ticket.expiredAt = ticket.activatedAt + 2678400000 * kind; // add 31 days or 93 days
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = { Ticket };
