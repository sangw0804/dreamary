const mongoose = require('mongoose');

const config = require('../config');
const { Card } = require('../model/card');

mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

const checkReservable = async () => {
  try {
    const tomorrow = new Date().getTime() + 86400000;
    const cards = await Card.find({ reservable: true });
    console.log(cards);
    console.log(tomorrow);
    const promises = cards.map(async card => {
      if (card.date <= tomorrow) {
        console.log(card);
        card.reservable = false;
        card.reservedTimes = [...card.ableTimes];
        console.log(card);
        console.log(await card.save());
      }
    });
    await Promise.all(promises);
    console.log('************************************************************');
    console.log(cards);
  } catch (e) {
    console.log(e);
  }
};

module.exports = { checkReservable };
