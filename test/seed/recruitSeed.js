const { ObjectID } = require('mongodb');
const { Recruit } = require('../../model/recruit');
const { User } = require('../../model/user');
const { users } = require('./userSeed');

// Recruit
const recruits = [
  {
    _id: new ObjectID(),
    title: '머리자르실분',
    _designer: users[1]._id,
    designerName: '안운장',
    _reviews: [],
    _cards: [],
    requireTime: {
      cut: 90,
      perm: 180,
      dye: 120
    }
  },
  {
    _id: new ObjectID(),
    title: '컷컷컷',
    designerName: '신한결',
    _designer: users[2]._id,
    _reviews: [],
    _cards: [],
    requireTime: {
      cut: 60,
      perm: 240,
      dye: 90
    }
  }
];

const populateRecruits = async done => {
  try {
    await Recruit.deleteMany({});
    await Recruit.insertMany(recruits);
    await User.findByIdAndUpdate(users[1]._id, { $set: { _recruit: recruits[0]._id } });
    await User.findByIdAndUpdate(users[2]._id, { $set: { _recruit: recruits[1]._id } });
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { recruits, populateRecruits };
