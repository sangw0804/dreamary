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
  let largestAbleTime = 0;
  ableTimes.forEach(time => {
    const reserveds = reservedTimes.filter(rt => rt.until <= time.until);
    if (!reserveds.length) {
      largestAbleTime = Math.max(largestAbleTime, time.until - time.since);
      return;
    }
    let endPoint = time.since;
    let tempLargest = 0;
    reserveds.forEach(reserved => {
      tempLargest = Math.max(tempLargest, reserved.since - endPoint);
      endPoint = reserved.until;
    });
    largestAbleTime = Math.max(largestAbleTime, tempLargest);
  });

  next();
}

cardSchema.pre('save', sortTimes);
cardSchema.pre('save', updateReservable);
cardSchema.pre('remove', sortTimes);
cardSchema.pre('remove', updateReservable);

const Card = mongoose.model('Card', cardSchema);

module.exports = { Card };
