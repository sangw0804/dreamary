const mongoose = require('mongoose');

const { Recruit } = require('./recruit');
const { updateIdArray } = require('./helpers/updateArray');
const logger = require('../log');

const cardSchema = new mongoose.Schema(
  {
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
    permPrice: {
      normal: Number,
      chin: Number,
      shoulder: Number,
      chest: Number
    },
    dyePrice: {
      normal: Number,
      chin: Number,
      shoulder: Number,
      chest: Number
    },
    must: {
      cut: {
        type: Boolean,
        default: false
      },
      perm: {
        type: Boolean,
        default: false
      },
      dye: {
        type: Boolean,
        default: false
      }
    },
    no: {
      cut: {
        type: Boolean,
        default: false
      },
      perm: {
        type: Boolean,
        default: false
      },
      dye: {
        type: Boolean,
        default: false
      }
    },
    sido: String,
    sigungu: String,
    shop: String,
    requireGender: String,
    picture: String,
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  {
    versionKey: false
  }
);

const sortHelper = (a, b) => a.since - b.since;

function sortTimes(next) {
  const card = this;
  card.ableTimes.sort(sortHelper);
  card.reservedTimes.sort(sortHelper);
  next();
}

async function updateReservable() {
  const card = this;
  const { reservedTimes, ableTimes, must } = card;
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

  const { requireTime } = await Recruit.findById(card._recruit);
  let times = [];
  for (let key in must) {
    if (must[key]) times.push(requireTime[key]);
  }
  if (!times.length) times = Object.values(requireTime);
  card.reservable = largestAbleTime >= Math.min(...times);
}

async function validateRecruit() {
  const recruit = await Recruit.findById(this._recruit);
  if (!recruit) {
    throw new Error('recruit not found!');
  }
}

cardSchema.methods.updateRecruitDB = async function() {
  const recruit = await Recruit.findById(this._recruit);
  logger.info('%o', recruit);
  recruit._cards = updateIdArray(recruit._cards, this._id);
  logger.info('%o', recruit);
  await recruit.save();
};

// async function updateRelationalDBs(doc) {
//   const recruit = await Recruit.findById(doc._recruit);
//   recruit._cards = updateIdArray(recruit._cards, doc._id);
//   await recruit.save();
// }

cardSchema.methods.removeRecruitDB = async function() {
  const recruit = await Recruit.findById(this._recruit);
  recruit._cards = recruit._cards.filter(_card => _card._id.toHexString() !== this._id.toHexString());
  await recruit.save();
};

// async function removeRelationalDBs(doc) {
//   const recruit = await Recruit.findById(doc._recruit);
//   recruit._cards = recruit._cards.filter(_card => _card._id.toHexString() !== doc._id.toHexString());
//   await recruit.save();
// }

cardSchema.pre('save', validateRecruit);
cardSchema.pre('save', sortTimes);
cardSchema.pre('save', updateReservable);
cardSchema.pre('remove', sortTimes);
cardSchema.pre('remove', updateReservable);

// cardSchema.post('save', updateRelationalDBs);
// cardSchema.post('remove', removeRelationalDBs);

const Card = mongoose.model('Card', cardSchema);

module.exports = { Card };
