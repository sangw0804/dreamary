const { ObjectID } = require('mongodb');
const { User } = require('../../model/user');

// User
const users = [
  {
    _id: new ObjectID(),
    _uid: '950342021',
    tickets: [],
    reservations: [],
    point: 0,
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    _uid: '953409359',
    tickets: [],
    reservations: [],
    point: 0,
    money: 20000,
    createdAt: new Date().getTime(),
    reservationCount: 2
  },
  {
    _id: new ObjectID(),
    _uid: '789',
    tickets: [],
    reservations: [],
    point: 0,
    createdAt: new Date().getTime()
  }
];

const populateUsers = async done => {
  try {
    await User.deleteMany({});
    await User.insertMany(users);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { users, populateUsers };
