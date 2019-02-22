const mongoose = require('mongoose');

const config = require('../config');
const logger = require('../log');
const { User } = require('../model/user');
const { Ticket } = require('../model/ticket');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });

// 매일 00:02분에 티켓이 만료되었지만 성사된 예약이 2건 이하인 디자이너에게 티켓 유효기간 연장

const checkTicket = async () => {
  try {
    const expiredDesigners = await User.find({
      isD: true,
      expiredAt: { $gt: 0, $lt: new Date().getTime() },
      reservationCount: { $lte: 2 }
    })
      .populate('_tickets')
      .exec();

    const promises = expiredDesigners.map(async designer => {
      const ticket = designer._tickets.find(t => t.expiredAt === designer.expiredAt);
      console.log(designer);
      console.log(ticket);

      ticket.extend();
      // await ticket.save();

      designer.expiredAt = ticket.expiredAt;
      console.log(ticket);
      console.log(designer);
      console.log('* * * * * * * * * * * * * * * * * * * * * ');
      // await designer.save();
    });

    return Promise.all(promises);
  } catch (e) {
    logger.error(e);
  }
};

checkTicket().then(() => mongoose.disconnect());
