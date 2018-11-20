const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

const { User } = require('./model/user');
const { Recruit } = require('./model/recruit');
const { Review } = require('./model/review');
const { Reservation } = require('./model/reservation');

const makeReview = async (name, recruit_id, score, content, createdAt) => {
  try {
    const user = await User.create({ name, createdAt: new Date().getTime(), _uid: '12345678' });

    Review.create({
      _user: user._id,
      _recruit: recruit_id,
      _reservation: new ObjectID().toHexString(),
      score,
      content,
      image: null,
      createdAt: new Date(createdAt).getTime()
    });
  } catch (e) {
    console.log(e);
  }
};

makeReview('이태훈', '5be1af1f0264be1e07c20655', 4, '정말 쓰레기같네요', '11/16/2018');
