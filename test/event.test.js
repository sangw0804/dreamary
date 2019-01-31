const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../app');
const { Event } = require('../model/event');
const { events, populateEvents } = require('./seed/eventSeed');

beforeEach(populateEvents);

describe('Event', () => {
  describe('GET /events', () => {
    it('should return every events in db', done => {
      request(app)
        .get('/events')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /events/:id', () => {
    it('should return event with correct id', done => {
      request(app)
        .get(`/events/${events[0]._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(events[0]._id.toHexString());
        })
        .end(done);
    });

    it('should return 400 with invalid id', done => {
      request(app)
        .get('/events/123')
        .expect(400)
        .end(done);
    });
  });

  describe('POST /events/:id', () => {
    it('should create event with valid body', done => {
      const data = {
        title: '테스트3',
        content: '테스트3입니다.',
        until: new Date().getTime()
      };
      request(app)
        .post('/events')
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundEvents = await Event.find();
            expect(foundEvents.length).toBe(3);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not create event with invalid body', done => {
      const invalidData = {
        title: 'content가 없다'
      };
      request(app)
        .post('/events')
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundEvents = await Event.find();
            expect(foundEvents.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PATCH /events/:id', () => {
    it('should update event with valid id', done => {
      const data = {
        title: '변경된 타이틀'
      };
      request(app)
        .patch(`/events/${events[0]._id}`)
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundEvent = await Event.findById(events[0]._id);
            expect(foundEvent.title).toBe(data.title);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid id', done => {
      const data = {
        title: '변경된 타이틀'
      };
      request(app)
        .patch('/events/123')
        .send(data)
        .expect(400)
        .end(done);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should remove event with valid id', done => {
      request(app)
        .delete(`/events/${events[0]._id}`)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const fountEvents = await Event.find();
            expect(fountEvents.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
