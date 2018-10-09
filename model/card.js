const mongoose = require('mongoose');

const { Recruit } = require('./recruit');
const { updateIdArray } = require('./helpers/updateArray');

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
    cut: {
      type: Number,
      default: 3000
    },
    perm: {
      type: Number,
      default: 30000
    },
    dye: {
      type: Number,
      default: 30000
    }
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
  region: String,
  shop: String,
  requireGender: String
});

const sortHelper = (a, b) => a.since - b.since;

function sortTimes(next) {
  const card = this;
  card.ableTimes.sort(sortHelper);
  card.reservedTimes.sort(sortHelper);
  next();
}

async function updateReservable(next) {
  const card = this;
  const { reservedTimes, ableTimes } = card;
  let largestAbleTime = 0;
  ableTimes.forEach(time => {
    const reserveds = reservedTimes.filter(rt => rt.until <= time.until && rt.since >= time.since);
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

  const {
    requireTime: { cut, perm, dye }
  } = await Recruit.findById(card._recruit);
  card.reservable = largestAbleTime >= Math.min(cut, perm, dye);
  next();
}

async function validateRecruit() {
  const recruit = await Recruit.findById(this._recruit);
  if (!recruit) {
    throw new Error('recruit not found!');
  }
}

async function updateRelationalDBs(doc) {
  const recruit = await Recruit.findById(doc._recruit);
  recruit._cards = updateIdArray(recruit._cards, doc._id);
  await recruit.save();
}

async function removeRelationalDBs(doc) {
  const recruit = await Recruit.findById(doc._recruit);
  recruit._cards = recruit._cards.filter(_card => _card._id.toHexString() !== doc._id.toHexString());
  await recruit.save();
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
