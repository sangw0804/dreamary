const mongoose = require('mongoose');

const { Recruit } = require('./recruit');

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
  },
  shopLocation: String
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
    const reserveds = reservedTimes.filter(
      rt => rt.until <= time.until && rt.since >= time.since
    );
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

  const { cut, perm, dye } = card.reservable;
  card.reservable = largestAbleTime >= Math.min(cut, perm, dye);
  next();
}

async function validateRecruit(next) {
  const recruit = await Recruit.findById(this._recruit);
  if (!recruit) {
    return next('Recruit not found!');
  }
  next();
}

async function updateRelationalDBs(doc, next) {
  try {
    const recruit = await Recruit.findById(doc._recruit);
    recruit._cards.push(doc._id);
    await recruit.save();
    next();
  } catch (e) {
    next(e);
  }
}

async function removeRelationalDBs(doc, next) {
  try {
    const recruit = await Recruit.findById(doc._recruit);
    recruit._cards = recruit._cards.filter(
      _card => _card._id.toHexString() !== doc._id.toHexString()
    );
    await recruit.save();

    next();
  } catch (e) {
    next(e);
  }
}

cardSchema.pre('save', validateRecruit);
cardSchema.pre('save', sortTimes);
cardSchema.pre('save', updateReservable);
cardSchema.pre('remove', sortTimes);
cardSchema.pre('remove', updateReservable);

cardSchema.post('save', updateRelationalDBs);
cardSchema.post('remove', removeRelationalDBs);

const Card = mongoose.model('Card', cardSchema);

module.exports = { Card };
