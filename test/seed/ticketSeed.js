const { ObjectID } = require('mongodb');
const { Ticket } = require('../../model/ticket');
const { User } = require('../../model/user');
const { users } = require('./userSeed');

const tickets = [
  {
    _id: new ObjectID(),
    _user: users[0]._id,
    isD: false,
    price: 3000,
    purchasedAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    _user: users[1]._id,
    isD: true,
    price: 10000,
    purchasedAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    _user: users[0]._id,
    isD: false,
    price: 3000,
    purchasedAt: new Date().getTime()
  }
];

const populateTicket = async done => {
  try {
    await Ticket.deleteMany({});
    await Ticket.insertMany(tickets);
    await User.updateOne(
      { _id: users[0]._id },
      { $set: { tickets: [tickets[0]._id, tickets[2]._id] } },
      { new: true }
    );
    await User.updateOne(
      { _id: users[1]._id },
      { $set: { tickets: [tickets[1]._id] } },
      { new: true }
    );
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { tickets, populateTicket };
