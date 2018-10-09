const mongoose = require('mongoose');

const { Recruit } = require('./recruit');
const { Reservation } = require('./reservation');

const reviewSchema = new mongoose.Schema({
  _recruit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruit',
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  score: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  }
});

async function validateRelatedDBs() {
  const review = this;
  const recruit = await Recruit.findById(review._recruit);
  const reservation = await Reservation.findById(review._reservation);
  if (!recruit || !reservation) {
    throw new Error('recruit || reservation not found!');
  }
}

async function updateRelatedDBs(doc) {
  const review = doc;
  const recruit = await Recruit.findById(review._recruit);
  const reservation = await Reservation.findById(review._reservation);
  reservation._review = review._id;
  recruit._reviews.push(review._id);

  recruit.score = ((recruit.score * (recruit._reviews.length - 1) + review.score) / recruit._reviews.length).toFixed(1);
  await recruit.save();
  await reservation.save();
}

reviewSchema.pre('save', validateRelatedDBs);

reviewSchema.post('save', updateRelatedDBs);

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
