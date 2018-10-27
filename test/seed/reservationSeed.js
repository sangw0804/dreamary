const { ObjectID } = require('mongodb');
const { User } = require('../../model/user');
const { Reservation } = require('../../model/reservation');
const { Card } = require('../../model/card');
const { users } = require('../seed/userSeed');
const { cards } = require('../seed/cardSeed');

const reservations = [
  {
    _id: new ObjectID(),
    _user: users[0]._id,
    _card: cards[0]._id,
    _designer: users[1]._id,
    date: cards[0].date,
    services: {
      cut: true
    },
    time: {
      since: 1200,
      until: 1290
    },
    _review: null
  },
  {
    _id: new ObjectID(),
    _user: users[2]._id,
    _card: cards[1]._id,
    _designer: users[1]._id,
    date: cards[1].date,
    services: {
      cut: true
    },
    time: {
      since: 1200,
      until: 1290
    },
    _review: null
  }
];

const populateReservation = async done => {
  try {
    await Reservation.deleteMany({});
    await Reservation.insertMany(reservations);
    await User.findByIdAndUpdate(users[0]._id, {
      $set: { _reservations: [reservations[0]._id] }
    });
    await User.findByIdAndUpdate(users[1]._id, {
      $set: { _reservations: [reservations[0]._id] }
    });
    await Card.findByIdAndUpdate(cards[0]._id, { $set: { reservedTimes: [reservations[0].time] } });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { reservations, populateReservation };
