const { ObjectID } = require('mongodb');
const { recruits } = require('./recruitSeed');
const { Card } = require('../../model/card');
const { Recruit } = require('../../model/recruit');

const cards = [
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    date: 20180928,
    ableTimes: [
      {
        since: new Date().getTime(),
        until: new Date().getTime() + 30000000
      },
      {
        since: new Date().getTime() + 40000000,
        until: new Date().getTime() + 70000000
      }
    ],
    reservedTimes: [],
    price: {
      cut: 3000,
      perm: 20000,
      dye: 30000
    },
    must: {
      cut: false,
      perm: true,
      dye: false
    },
    no: {
      cut: false,
      perm: false,
      dye: true
    }
  }
];

const populateCards = async done => {
  try {
    await Card.remove({});
    await Card.insertMany(cards);
    await Recruit.findByIdAndUpdate(recruits[0]._id, {
      $set: { _cards: [cards[0]._id] }
    });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { cards, populateCards };
