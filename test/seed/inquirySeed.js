const { ObjectID } = require('mongodb');
const { Inquiry } = require('../../model/inquiry');
const { users } = require('./userSeed');

const inquiries = [
  {
    _id: new ObjectID(),
    _user: users[0]._id,
    name: '신한결',
    title: '머리가 자꾸 빠져요',
    email: 'dreamary@korea.ac.kr',
    content: '머리가 자꾸 빠지는데 어떡합니까이거....'
  }
];

const populateInquiries = async done => {
  try {
    await Inquiry.deleteMany({});
    await Inquiry.insertMany(inquiries);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { inquiries, populateInquiries };
