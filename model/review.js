const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
