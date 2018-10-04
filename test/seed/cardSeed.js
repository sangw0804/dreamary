const { ObjectID } = require('mongodb');
const { recruits } = require('./recruitSeed');
const { Card } = require('../../model/card');
const { Recruit } = require('../../model/recruit');

const cards = [
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    date: new Date().setHours(6, 0, 0, 0),
    ableTimes: [
      {
        since: 480,
        until: 840
      },
      {
        since: 1200,
        until: 1320
      }
    ],
    reservedTimes: [],
    reservable: true,
    price: {
      cut: 3000,
      perm: 20000,
      dye: 30000
    },
    requireTime: {
      cut: 90,
      perm: 180,
      dye: 120
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
  },
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    date: new Date().setHours(6, 0, 0, 0),
    ableTimes: [
      {
        since: 480,
        until: 840
      },
      {
        since: 1200,
        until: 1320
      }
    ],
    reservedTimes: [],
    reservable: true,
    price: {
      cut: 3000,
      perm: 20000,
      dye: 30000
    },
    requireTime: {
      cut: 60,
      perm: 240,
      dye: 90
    },
    must: {
      cut: false,
      perm: false,
      dye: true
    },
    no: {
      cut: false,
      perm: true,
      dye: false
    }
  }
];

const populateCards = async done => {
  try {
    await Card.remove({});
    await Card.insertMany(cards);
    await Recruit.findByIdAndUpdate(recruits[0]._id, {
      $set: { _cards: [cards[0]._id, cards[1]._id] }
    });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { cards, populateCards };
