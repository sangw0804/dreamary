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

const users = [
  {
    _id: new ObjectID(),
    isD: false,
    name: '오상우',
    phone: '01087623725',
    locations: null,
    _uid: '123',
    tickets: [],
    reservations: []
  },
  {
    _id: new ObjectID(),
    isD: true,
    name: '안운장',
    phone: '01012345678',
    locations: [
      {
        region: '성북구',
        shop: '준오헤어',
        address: '성북구 안암로 12길 234 2층'
      }
    ],
    _uid: '456',
    tickets: [],
    reservations: []
  },
  {
    _id: new ObjectID(),
    isD: false,
    name: '신한결',
    phone: '01043214321',
    locations: null,
    _uid: '789',
    tickets: [],
    reservations: []
  }
];

const recruits = [
  {
    _id: new ObjectID(),
    _designer: users[1]._id,
    title: '뎅겅잘라드립니다',
    ableDates: [
      {
        since: new Date().getTime(),
        until: new Date().getTime() + 10000000
      }
    ],
    portfolios: [
      'https://picsum.photos/300/200/?image=5',
      'https://picsum.photos/300/200/?image=8',
      'https://picsum.photos/300/200/?image=7'
    ],
    _reviews: [],
    introduction: '자기소개입니다.',
    requirement:
      '커트 : 여자분은 최소 어깨 아래기장이면 좋겠습니다. \n염색 : 머릿결 손상이 너무 심하시면 어렵습니다. 양해 부탁드립니다. \n그 외 다른 부분은 모델분께 맞춰드리겠습니다.'
  }
];

const reviews = [
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    _user: users[0]._id,
    score: 4.0,
    content: '상당히 잘 자르시네요',
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    _user: users[2]._id,
    score: 2.5,
    content: '그냥 그래요...',
    createdAt: new Date().getTime() + 10000000
  }
];

const reservations = [
  {
    _id: new ObjectID(),
    _user: users[0]._id,
    _designer: users[1]._id,
    time: {
      since: new Date().getTime(),
      until: new Date().getTime() + 10000000
    }
  },
  {
    _id: new ObjectID(),
    _user: users[2]._id,
    _designer: users[1]._id,
    time: {
      since: new Date().getTime() + 50000000,
      until: new Date().getTime() + 90000000
    }
  }
];

recruits[0]._reviews = [reviews[0]._id, reviews[1]._id];

const seedUsersDB = async () => {
  await User.remove({});
  await User.insertMany(users);
};

const seedRecruitsDB = async () => {
  await Recruit.remove({});
  await Recruit.insertMany(recruits);
};

const seedReviewsDB = async () => {
  await Review.remove({});
  await Review.insertMany(reviews);
};

const seedReservationsDB = async () => {
  await Reservation.remove({});
  await Reservation.insertMany(reservations);
};

const seedDB = async () => {
  try {
    await seedUsersDB();
    await seedRecruitsDB();
    await seedReviewsDB();
    await seedReservationsDB();
    console.log('successfully seeded DB!');
  } catch (e) {
    console.log(e);
  }
};

seedDB();
