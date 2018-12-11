const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { recruits, populateRecruits } = require('./seed/recruitSeed');
const { users, populateUsers } = require('./seed/userSeed');
const { reservations, populateReservation } = require('./seed/reservationSeed');
const { populateReview, reviews } = require('./seed/reviewSeed');
const { Review } = require('../model/review');
const { Recruit } = require('../model/recruit');
const { Reservation } = require('../model/reservation');
const { populateCards } = require('./seed/cardSeed');

beforeEach(populateUsers);
beforeEach(populateRecruits);
beforeEach(populateCards);
beforeEach(populateReservation);
beforeEach(populateReview);

describe('Review', () => {
  describe('GET /recruits/:recruit_id/reviews/:id', () => {
    it('should get a review with valid id', done => {
      request(app)
        .get(`/recruits/${recruits[0]._id}/reviews/${reviews[0]._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(reviews[0]._id.toHexString());
        })
        .end(done);
    });

    it('should return 400 with invalid id', done => {
      request(app)
        .get(`/recruits/${recruits[0]._id}/reviews/${new ObjectID()}`)
        .expect(400)
        .end(done);
    });
  });

  describe('POST /recruits/:recruit_id/reviews', () => {
    it('should create new review with valid data', done => {
      const data = {
        _user: users[0]._id,
        _recruit: recruits[1]._id,
        _reservation: reservations[1]._id,
        score: 1.0,
        content: '아주 엉망이네요'
      };
      request(app)
        .post(`/recruits/${recruits[1]._id}/reviews`)
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
          }
          try {
            await new Promise((resolve, reject) => setTimeout(resolve, 500)); // asyncronous db 처리 때문

            const review = await Review.findById(res.body._id);
            expect(review.score).toBe(1.0);
            const recruit = await Recruit.findById(res.body._recruit);
            expect(recruit._reviews[0]._id.toHexString()).toBe(res.body._id);
            expect(recruit.score).toBe(1.0);
            const reservation = await Reservation.findById(res.body._reservation);
            expect(reservation._review.toHexString()).toBe(res.body._id);
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
          try {
            if (err) throw new Error(err);
            const foundReviews = await Review.find({});
            expect(foundReviews.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PATCH /recruits/:recruit_id/reviews/:id', () => {
    it('should update review with valid data', done => {
      const data = {
        score: 1.0,
        content: '별로에요'
      };
      request(app)
        .patch(`/recruits/${recruits[0]._id}/reviews/${reviews[0]._id}`)
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const review = await Review.findById(reviews[0]._id);
            expect(review.score).toBe(1.0);
            const recruit = await Recruit.findById(review._recruit);
            expect(recruit.score).toBe(1.0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('DELETE /recruits/:recruit_id/reviews/:id', () => {
    it('should remove review with valid id', done => {
      request(app)
        .delete(`/recruits/${recruits[0]._id}/reviews/${reviews[0]._id}`)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundReviews = await Review.find();
            expect(foundReviews.length).toBe(0);
            const recruit = await Recruit.findById(recruits[0]._id);
            expect(recruit._reviews.length).toBe(0);
            expect(recruit.score).toBe(0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
