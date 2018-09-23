const { ObjectID } = require('mongodb');
const { Recruit } = require('../../model/recruit');
const { users } = require('./userSeed');

// Recruit
const recruits = [
  {
    _id: new ObjectID(),
    title: '머리자르실분',
    _designer: users[1]._id,
    _reviews: []
  }
];

const populateRecruits = async done => {
  try {
    await Recruit.deleteMany({});
    await Recruit.insertMany(recruits);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { recruits, populateRecruits };
