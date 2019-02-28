const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    _user: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: {
      // 티켓 가격
      required: true,
      type: Number
    },
    activatedAt: {
      // 활성회 된 시간
      type: Number,
      default: null
    },
    expiredAt: {
      // 만료 시간
      type: Number,
      default: null
    },
    createdAt: {
      // 생성 시간
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

ticketSchema.methods.activate = function activateHandler() {
  const ticket = this;

  ticket.activatedAt = Math.floor(new Date().getTime() / 86400000) * 86400000;

  let kind = 1;
  if (ticket.price == 28000) kind = 3;
  ticket.expiredAt = ticket.activatedAt + 2678400000 * kind; // add 31 days or 93 days
};

ticketSchema.methods.extend = function extendHandler() {
  // 한달 연장
  const ticket = this;

  ticket.expiredAt += 2678400000;
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = { Ticket };
