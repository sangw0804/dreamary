const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  {
    versionKey: false
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = { Inquiry };
