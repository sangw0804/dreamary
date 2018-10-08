const { ObjectID } = require('mongodb');
const { User } = require('../../model/user');

// User
const users = [
  {
    _id: new ObjectID(),
    _uid: '123',
    tickets: [],
    reservations: []
  },
  {
    _id: new ObjectID(),
    _uid: '456',
    tickets: [],
    reservations: []
  },
  {
    _id: new ObjectID(),
    _uid: '789',
    tickets: [],
    reservations: []
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
