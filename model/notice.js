const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
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

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = { Notice };
