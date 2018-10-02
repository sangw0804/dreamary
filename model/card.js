const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  _recruit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruit',
    required: true
  },
  date: {
    required: true,
    type: Number
  },
  ableTimes: [
    {
      since: Number,
      until: Number
    }
  ],
  reservedTimes: [
    {
      since: Number,
      until: Number
    }
  ],
  reservable: {
    type: Boolean,
    default: true
  },
  price: {
    cut: Number,
    perm: Number,
    dye: Number
  },
  must: {
    cut: Boolean,
    perm: Boolean,
    dye: Boolean
  },
  no: {
    cut: Boolean,
    perm: Boolean,
    dye: Boolean
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = { Card };
