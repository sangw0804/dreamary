const mongoose = require('mongoose');

const config = require('../config');
const logger = require('../log');
const { User } = require('../model/user');
const { Ticket } = require('../model/ticket');
const { alarmTalk } = require('../routes/helpers/alarmTalk');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });

/*
  매일 00:02분에
  1. 티켓이 만료되었지만 성사된 예약이 2건 이하인 디자이너에게 티켓 유효기간 연장 & 알림톡
  2. 티켓이 만료되었고 성사된 예약이 3건 이상인 디자이너에게 알림톡
  3. 3일 뒤 티켓이 만료되는 디자이너에게 알림톡
  */

const checkTicket = async () => {
  try {
    console.log(await User.find());

    const expiredDesigners = await User.find({
      isD: true,
      expiredAt: { $gt: 0, $lt: new Date().getTime() },
      reservationCount: { $lte: 2 }
    })
      .populate('_tickets')
      .exec();

    console.log(expiredDesigners);

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
