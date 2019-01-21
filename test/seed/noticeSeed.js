const { ObjectID } = require('mongodb');

const { Notice } = require('../../model/notice');

const notices = [
  {
    _id: new ObjectID(),
    title: '테스트 공지',
    content: '테스트입니다.',
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    title: '테스트 공지2',
    content: '테스트2입니다.',
    createdAt: new Date().getTime()
  }
];

const populateNotices = async done => {
  try {
    await Notice.deleteMany({});
    await Notice.insertMany(notices);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { notices, populateNotices };
