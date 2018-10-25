const { ObjectID } = require('mongodb');
const { Review } = require('../../model/review');
const { Recruit } = require('../../model/recruit');
const { Reservation } = require('../../model/reservation');
const { recruits } = require('./recruitSeed');
const { reservations } = require('./reservationSeed');
const { users } = require('./userSeed');

const reviews = [
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    _user: users[0]._id,
    score: 4.0,
    content: '상당히 잘 자르시네요',
    createdAt: new Date().getTime()
  }
];

const populateReview = async done => {
  try {
    await Review.remove({});
    await Review.insertMany(reviews);
    await Recruit.findByIdAndUpdate(reviews[0]._recruit, { $set: { _reviews: [reviews[0]._id] } });
    await Reservation.findByIdAndUpdate(reservations[0]._id, { $set: { _review: reviews[0]._id } });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { reviews, populateReview };
