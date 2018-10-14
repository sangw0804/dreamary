const mongoose = require('mongoose');
const { User } = require('./user');

// const { updateIdArray } = require('./helpers/updateArray');

const recruitSchema = new mongoose.Schema(
  {
    _designer: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      required: true,
      type: String
    },
    _cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      }
    ],
    portfolios: [
      {
        type: String
      }
    ],
    requirement: {
      type: String
    },
    requireTime: {
      cut: Number,
      perm: Number,
      dye: Number
    },
    _reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    score: {
      type: Number,
      default: 0.0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

async function updateRelatedDBs(doc) {
  const recruit = doc;
  const user = await User.findById(recruit._designer);
  user._recruit = recruit._id;
  await user.save();
}

async function removeRelatedDBs(doc) {
  const recruit = doc;
  const user = await User.findById(recruit._designer);
  user._recruit = null;
  await user.save();
}

recruitSchema.post('save', updateRelatedDBs);
recruitSchema.post('remove', removeRelatedDBs);

const Recruit = mongoose.model('Recruit', recruitSchema);

module.exports = { Recruit };
