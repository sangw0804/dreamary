const mongoose = require('mongoose');

const config = require('../config');
const { Card } = require('../model/card');
const logger = process.env.NODE_ENV !== 'test' ? require('../log') : false;

mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

const checkReservable = async () => {
  try {
    const tomorrow = new Date().getTime() + 86400000;
    const cards = await Card.find({ reservable: true });
    const promises = cards.map(async card => {
      if (card.date <= tomorrow) {
        card.reservable = false;
        card.reservedTimes = [...card.ableTimes];

        await card.save();
      }
    });
    await Promise.all(promises);
    if (logger) logger.info('CheckReservable Success');
  } catch (e) {
    if (logger) logger.error('CheckReservable Error : %o', e);
  }
};

if (process.env.CHECK_RUN) {
  checkReservable();
} else {
  module.exports = { checkReservable };
}
