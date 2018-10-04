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
  requireTime: {
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

const sortHelper = (a, b) => a.since - b.since;

function sortTimes(next) {
  const card = this;
  card.ableTimes.sort(sortHelper);
  card.reservedTimes.sort(sortHelper);
  next();
}

function updateReservable(next) {
  const card = this;
  const { reservedTimes, ableTimes } = card;
  ableTimes.forEach(time => {
    const reserveds = reservedTimes.filter(rt => rt.);
  })
}

cardSchema.pre('save', sortTimes);
cardSchema.pre('findOneAndUpdate', sortTimes);
cardSchema.pre('update', sortTimes);

const Card = mongoose.model('Card', cardSchema);

module.exports = { Card };
