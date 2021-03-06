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
      // 점수 - 더이상 사용되지 않음
      type: Number,
      required: true
    },
    content: {
      // 내용
      type: String,
      required: true
    },
    images: [String], // 리뷰 image url들
    createdAt: {
      // 생성 시간
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

async function validateRelatedDBs() {
  const review = this;
  const recruit = await Recruit.findById(review._recruit);
  const reservation = await Reservation.findById(review._reservation);

  if (!recruit || !reservation) throw new Error('recruit || reservation not found!');
}

reviewSchema.pre('save', validateRelatedDBs);

reviewSchema.methods.updateRelatedDBs = async function updateHandler(originalReviewScore) {
  const review = this;
  const recruit = await Recruit.findById(review._recruit);
  const reservation = await Reservation.findById(review._reservation);

  reservation._review = review._id;
  recruit._reviews = updateIdArray(recruit._reviews, review._id);

  // originalReviewScore 가 0 일 수 있으므로
  // 점수 수정 로직 - 현재 리뷰 점수 사용하지 않고 있습니다!
  if (typeof originalReviewScore === 'number')
    recruit.score = removeScore(recruit.score, originalReviewScore, recruit._reviews.length);
  recruit.score = addScore(recruit.score, review.score, recruit._reviews.length);

  await recruit.save();
  await reservation.save();
};

reviewSchema.methods.removeRelatedDBs = async function removeHandler() {
  const review = this;
  const recruit = await Recruit.findById(review._recruit);
  await Reservation.findByIdAndRemove(review._reservation, { $set: { _review: null } });

  recruit.score = removeScore(recruit.score, review.score, recruit._reviews.length);
  recruit._reviews = recruit._reviews.filter(rv => rv.toHexString() !== review._id.toHexString());

  await recruit.save();
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
