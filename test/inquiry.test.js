const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { Inquiry } = require('../model/inquiry');
const { populateUsers, users } = require('./seed/userSeed');
const { populateInquiries, inquiries } = require('./seed/inquirySeed');

beforeEach(populateUsers);
beforeEach(populateInquiries);

describe('Inquiry', () => {
  describe('GET /inquiries', () => {
    it('should get every inquiries', done => {
      request(app)
        .get('/inquiries')
        .expect(200)
        .expect(res => {
          expect(res.body[0]._id).toBe(inquiries[0]._id.toHexString());
        })
        .end(done);
    });
  });

  describe('POST /inquiries', () => {
    it('should create new inquiry with valid data', done => {
      const data = {
        _user: users[0]._id.toHexString(),
        title: '궁금합니다',
        name: '신한결',
        content: '드리드리머리머리드머리',
        email: 'dreamary@korea.ac.kr'
      };
      request(app)
        .post('/inquiries')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.content).toBe(data.content);
        })
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const foundInquiries = await Inquiry.find({});
            expect(foundInquiries.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid data', done => {
      const data = {
        _user: users[0]._id.toHexString(),
        name: '신한결',
        content: '드리드리머리머리드머리'
      };
      request(app)
        .post('/inquiries')
        .send(data)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const foundInquiries = await Inquiry.find({});
            expect(foundInquiries.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
