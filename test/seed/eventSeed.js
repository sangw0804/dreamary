const { ObjectID } = require('mongodb');

const { Event } = require('../../model/event');

const events = [
  {
    _id: new ObjectID(),
    title: '테스트 이벤트',
    content: '테스트입니다.',
    until: new Date().getTime(),
    images: [],
    createdAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    title: '테스트 이벤트2',
    content: '테스트2입니다.',
    until: new Date().getTime(),
    images: [],
    createdAt: new Date().getTime()
  }
];

const populateEvents = async done => {
  try {
    await Event.deleteMany({});
    await Event.insertMany(events);
    done();
  } catch (e) {
    done(e);
  }
};

module.exports = { events, populateEvents };
