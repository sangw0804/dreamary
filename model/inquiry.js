const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false
  }
);
