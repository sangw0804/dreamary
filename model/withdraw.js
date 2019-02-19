const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  _designer: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  socialId: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  address: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  accountHolder: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  bank: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  accountNumber: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  money: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  isRefused: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  updatedAt: {
    type: mongoose.Schema.Types.Number,
    default: null
  },
  createdAt: {
    type: mongoose.Schema.Types.Number,
    required: true
  }
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = { Withdraw };
