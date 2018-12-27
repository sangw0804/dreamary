const { ObjectID } = require('mongodb');
const { recruits } = require('./recruitSeed');
const { Card } = require('../../model/card');
const { Recruit } = require('../../model/recruit');

const cards = [
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    date: new Date().setHours(6, 0, 0, 0) + 86400000,
    ableTimes: [
      {
        since: 480,
        until: 810
      },
      {
        since: 1200,
        until: 1320
      },
      {
        since: 1380,
        until: 1470
      }
    ],
    reservedTimes: [],
    reservable: true,
    permPrice: {
      normal: 10000,
      chin: 20000,
      shoulder: 30000,
      chest: 40000
    },
    dyePrice: {
      normal: 10000,
      chin: 20000,
      shoulder: 30000,
      chest: 40000
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
    },
    sido: '서울',
    sigungu: '강서구',
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    _recruit: recruits[1]._id,
    date: new Date().setHours(6, 0, 0, 0) + 86400000 * 2,
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
    permPrice: {
      normal: 10000,
      chin: 20000,
      shoulder: 30000,
      chest: 40000
    },
    dyePrice: {
      normal: 10000,
      chin: 20000,
      shoulder: 30000,
      chest: 40000
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
    },
    sido: '서울',
    sigungu: '강남구',
    createdAt: new Date().getTime()
  }
];

const populateCards = async done => {
  try {
    await Card.remove({});
    await Card.insertMany(cards);
    await Recruit.findByIdAndUpdate(recruits[0]._id, {
      $set: { _cards: [cards[0]._id] }
    });
    await Recruit.findByIdAndUpdate(recruits[1]._id, {
      $set: { _cards: [cards[1]._id] }
    });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { cards, populateCards };
