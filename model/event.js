const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  until: {
    type: Number,
    required: true
  },
  images: [String],
  createdAt: {
    type: Number,
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };