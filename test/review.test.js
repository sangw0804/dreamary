const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { recruits, populateRecruits } = require('./seed/recruitSeed');
const { users, populateUsers } = require('./seed/userSeed');
const { populateReview } = require('./seed/reviewSeed');
const { Review } = require('../model/review');

beforeEach(populateUsers);
beforeEach(populateRecruits);
beforeEach(populateReview);

describe('Review', () => {
  describe('POST /recruits/:id/reviews', () => {
    it('should create new review with valid data', done => {
      const data = {
        _user: users[0]._id,
        score: 1.0,
        content: '아주 엉망이네요'
      };
      request(app)
        .post(`/recruits/${recruits[0]._id}/reviews`)
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
          }
          try {
            const review = await Review.findById(res.body._id);
            expect(review.score).toBe(1.0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not create new review with invalid data', done => {
      const invalidData = {
        _user: users[0]._id,
        content: '아주 엉망이네요'
      };
      request(app)
        .post(`/recruits/${recruits[0]._id}/reviews`)
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          if (err) {
            done(err);
          }
          try {
            const reviews = await Review.find({});
            expect(reviews.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not create new review with invalid recruit id param', done => {
      const data = {
        _user: users[0]._id,
        score: 1.0,
        content: '아주 엉망이네요'
      };
      request(app)
        .post(`/recruits/${new ObjectID()}/reviews`)
        .send(data)
        .expect(400)
        .end(async (err, res) => {
          if (err) {
            done(err);
          }
          try {
            const reviews = await Review.find({});
            expect(reviews.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
