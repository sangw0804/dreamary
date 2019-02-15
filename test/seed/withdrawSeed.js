const { ObjectID } = require('mongodb');
const { Withdraw } = require('../../model/withdraw');
const { users } = require('./userSeed');

const withdraws = [
  {
    _id: new ObjectID(),
    _designer: users[0]._id,
    name: '신한결',
    socialId: '950804-1234567',
    address: '서울시 성북구 안암로 123-44',
    accountHolder: '오상우',
    bank: '신한은행',
    accountNumber: '123-456-123456',
    money: 10000,
    email: 'dreamary@korea.ac.kr',
    createdAt: new Date().getTime()
  }
];

const populateWithdraws = async done => {
  try {
    await Withdraw.deleteMany({});
    await Withdraw.insertMany(withdraws);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { withdraws, populateWithdraws };
