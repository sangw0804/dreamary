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
    const expiredDesigners = await User.find({
      isD: true,
      expiredAt: { $gt: 0, $lt: new Date().getTime() }
    })
      .populate('_tickets')
      .exec();

    const willExpireDesigners = await User.find({
      isD: true,
      expiredAt: { $gt: new Date().getTime() + 86400000 * 2, $lt: new Date().getTime() + 86400000 * 3 }
    });

    const promises = expiredDesigners.map(async designer => {
      if (designer.reservationCount <= 2) {
        const ticket = designer._tickets.find(t => t.expiredAt === designer.expiredAt);

        ticket.extend();
        await ticket.save();

        designer.expiredAt = ticket.expiredAt;
        designer.reservationCount = 0;
        await designer.save();
        // 2개 이하인 경우 알람톡.
        await alarmTalk('designerTicketDoneExtend', undefined, designer._id);
      } else {
        // 3개 이상인 경우 알람톡.
        await alarmTalk('designerTicketDone', undefined, designer._id);
      }
    });

    promises.concat(
      willExpireDesigners.map(async designer => {
        // 만료 3일 전 알람톡
        await alarmTalk('designerTicketWillDone', undefined, designer._id);
      })
    );

    return Promise.all(promises);
  } catch (e) {
    logger.error(e);
  }
};

checkTicket().then(() => mongoose.disconnect());
