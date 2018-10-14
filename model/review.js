const mongoose = require('mongoose');

const { Recruit } = require('./recruit');
const { Reservation } = require('./reservation');
const { updateIdArray } = require('./helpers/updateArray');
const { addScore, removeScore } = require('./helpers/updateScore');

const reviewSchema = new mongoose.Schema(
  {
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
  },
  {
    versionKey: false,
    timestamps: true
  }
);

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
  recruit._reviews = updateIdArray(recruit._reviews, review._id);

  recruit.score = addScore(recruit.score, review.score, recruit._reviews.length);
  await recruit.save();
  await reservation.save();
}

async function removeRelatedDBs(doc) {
  const review = doc;
  const recruit = await Recruit.findById(review._recruit);
  await Reservation.findByIdAndRemove(review._reservation, { $set: { _review: null } });

  recruit.score = removeScore(recruit.score, review.score, recruit._reviews.length);
  recruit._reviews = recruit._reviews.filter(rv => rv.toHexString() !== review._id.toHexString());

  await recruit.save();
}

reviewSchema.pre('save', validateRelatedDBs);

reviewSchema.post('save', updateRelatedDBs);
reviewSchema.post('remove', removeRelatedDBs);

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
