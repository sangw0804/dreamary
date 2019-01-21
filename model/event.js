const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  content: String,
  until: Number,
  images: [String],
  createdAt: {
    type: Number,
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
