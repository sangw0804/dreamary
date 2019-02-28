const mongoose = require('mongoose');
const { User } = require('./user');

// const { updateIdArray } = require('./helpers/updateArray');

const recruitSchema = new mongoose.Schema(
  {
    _designer: {
      // recruit -> 디자이너 참조값
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      // 제목
      required: true,
      type: String
    },
    _cards: [
      // recruit -> 카드들 참조값
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      }
    ],
    shops: [String], // 샵 이름들
    requirement: {
      // 요청사항
      type: String
    },
    requireTime: {
      // 시술별 필요 시간
      cut: Number,
      perm: Number,
      dye: Number
    },
    _reviews: [
      // recruit -> 리뷰들 참조값
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    score: {
      // 더이상 사용하지 않음
      type: Number,
      default: 0.0
    },
    updatedAt: {
      // 수정 시간 (타임스탬프)
      type: Number
    },
    createdAt: {
      // 생성 시간 (타임스탬프)
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

recruitSchema.methods.updateRelatedDB = async function updateHandler() {
  const recruit = this;
  const user = await User.findById(recruit._designer);
  user._recruit = recruit._id;
  await user.save();
};

recruitSchema.methods.removeRelatedDB = async function removeHandler() {
  const recruit = this;
  const user = await User.findById(recruit._designer);
  user._recruit = null;
  await user.save();
};

const Recruit = mongoose.model('Recruit', recruitSchema);

module.exports = { Recruit };
