const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const logger = require('./log');

mongoose.connect(
  'mongodb://localhost:27017/dreamary',
  { useNewUrlParser: true }
);

const { User } = require('./model/user');
const { Recruit } = require('./model/recruit');
const { Review } = require('./model/review');
const { Card } = require('./model/card');
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
    _cards: [],
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

const cards = [
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    date: new Date().setHours(6, 0, 0, 0),
    ableTimes: [
      {
        since: 480,
        until: 840
      },
      {
        since: 1200,
        until: 1320
      }
    ],
    reservedTimes: [],
    reservable: true,
    price: {
      cut: 3000,
      perm: 20000,
      dye: 30000
    },
    requireTime: {
      cut: 90,
      perm: 180,
      dye: 120
    },
    must: {
      cut: false,
      perm: true,
      dye: false
    },
    no: {
      cut: false,
      perm: false,
      dye: true
    }
  },
  {
    _id: new ObjectID(),
    _recruit: recruits[0]._id,
    date: new Date().setHours(6, 0, 0, 0),
    ableTimes: [
      {
        since: 480,
        until: 840
      },
      {
        since: 1200,
        until: 1320
      }
    ],
    reservedTimes: [],
    reservable: true,
    price: {
      cut: 3000,
      perm: 20000,
      dye: 30000
    },
    requireTime: {
      cut: 60,
      perm: 240,
      dye: 90
    },
    must: {
      cut: false,
      perm: false,
      dye: true
    },
    no: {
      cut: false,
      perm: true,
      dye: false
    }
  }
];

const reservations = [
  {
    _id: new ObjectID(),
    _user: users[0]._id,
    _designer: users[1]._id,
    _card: cards[0]._id,
    date: cards[0].date,
    time: {
      since: 540,
      until: 630
    },
    services: {
      cut: 3000
    }
  },
  {
    _id: new ObjectID(),
    _user: users[2]._id,
    _designer: users[1]._id,
    _card: cards[1]._id,
    date: cards[1].date,
    time: {
      since: 1200,
      until: 1290
    },
    services: {
      dye: 30000
    }
  }
];

recruits[0]._reviews = [reviews[0]._id, reviews[1]._id];
recruits[0]._cards = [cards[0]._id, cards[1]._id];
cards[0].reservedTimes.push(reservations[0].time);
cards[1].reservedTimes.push(reservations[1].time);

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

const seedCardsDB = async () => {
  await Card.remove({});
  await Card.insertMany(cards);
};

const seedDB = async () => {
  try {
    await seedUsersDB();
    await seedRecruitsDB();
    await seedCardsDB();
    await seedReservationsDB();
    await seedReviewsDB();
    logger.info('successfully seeded DB!');
  } catch (e) {
    logger.error(e);
  }
};

seedDB();
