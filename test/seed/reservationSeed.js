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
    date: new Date().setHours(6, 0, 0, 0),
    services: {
      cut: 3000
    },
    time: {
      since: 1000,
      until: 1100
    }
  }
];

const populateReservation = async done => {
  try {
    await Reservation.deleteMany({});
    await Reservation.insertMany(reservations);
    await User.findByIdAndUpdate(users[0]._id, {
      $set: { reservations: [reservations[0]._id] }
    });
    await User.findByIdAndUpdate(users[1]._id, {
      $set: { reservations: [reservations[0]._id] }
    });
    await Card.findByIdAndUpdate(cards[0]._id, {
      $set: { reservedTimes: [reservations[0].time] }
    });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { reservations, populateReservation };
