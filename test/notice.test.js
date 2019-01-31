const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../app');
const { Notice } = require('../model/notice');
const { notices, populateNotices } = require('./seed/noticeSeed');

beforeEach(populateNotices);

describe('Notice', () => {
  describe('GET /notices', () => {
    it('should return every notices in db', done => {
      request(app)
        .get('/notices')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /notices/:id', () => {
    it('should return notice with correct id', done => {
      request(app)
        .get(`/notices/${notices[0]._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(notices[0]._id.toHexString());
        })
        .end(done);
    });

    it('should return 400 with invalid id', done => {
      request(app)
        .get('/notices/123')
        .expect(400)
        .end(done);
    });
  });

  describe('POST /notices/:id', () => {
    it('should create notice with valid body', done => {
      const data = {
        title: '테스트3',
        content: '테스트3입니다.'
      };
      request(app)
        .post('/notices')
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundNotices = await Notice.find();
            expect(foundNotices.length).toBe(3);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not create notice with invalid body', done => {
      const invalidData = {
        title: 'content가 없다'
      };
      request(app)
        .post('/notices')
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundNotices = await Notice.find();
            expect(foundNotices.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PATCH /notices/:id', () => {
    it('should update notice with valid id', done => {
      const data = {
        title: '변경된 타이틀'
      };
      request(app)
        .patch(`/notices/${notices[0]._id}`)
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundNotice = await Notice.findById(notices[0]._id);
            expect(foundNotice.title).toBe(data.title);
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
        .patch('/notices/123')
        .send(data)
        .expect(400)
        .end(done);
    });
  });

  describe('DELETE /notices/:id', () => {
    it('should remove notice with valid id', done => {
      request(app)
        .delete(`/notices/${notices[0]._id}`)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const fountNotices = await Notice.find();
            expect(fountNotices.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
