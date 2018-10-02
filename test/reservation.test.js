const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { User } = require('../model/user');
const { Reservation } = require('../model/reservation');
const { Card } = require('../model/card');
const { users, populateUsers } = require('./seed/userSeed');
const { reservations, populateReservation } = require('./seed/reservationSeed');
const { cards, populateCards } = require('./seed/cardSeed');
const { recruits, populateRecruits } = require('./seed/recruitSeed');

beforeEach(populateUsers);
beforeEach(populateRecruits);
beforeEach(populateCards);
beforeEach(populateReservation);

describe('Reservation', () => {
  describe('GET /users/:user_id/reservations/all', () => {
    it('should get every reservations', done => {
      request(app)
        .get(`/users/${users[0]._id}/reservations/all`)
        .expect(200)
        .expect(res => {
          expect(res.body[0]._id).toBe(reservations[0]._id.toHexString());
        })
        .end(done);
    });
  });

  describe('POST /users/:user_id/reservations', () => {
    it('should create new reservation with valid data', done => {
      const data = {
        _user: users[0]._id,
        _designer: users[2]._id,
        _card: cards[0]._id,
        date: new Date().setHours(6, 0, 0, 0),
        time: {
          since: 2000,
          until: 2200
        },
        services: {
          perm: 30000
        }
      };
      request(app)
        .post(`/users/${users[0]._id}/reservations`)
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBeTruthy();
        })
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundReservation = await Reservation.findById(res.body._id);
            expect(foundReservation).toBeTruthy();
            const foundUser = await User.findById(foundReservation._designer);
            expect(foundUser).toBeTruthy();
            expect(foundUser._reservations[0].toHexString()).toBe(res.body._id);
            const foundCard = await Card.findById(res.body._card);
            expect(foundCard.reservedTimes[1].since).toBe(res.body.time.since);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not create new reservation with invalid data', done => {
      const invalidData = {
        _user: new ObjectID(),
        _designer: users[2]._id,
        time: {
          since: new Date().getTime(),
          until: new Date().getTime()
        }
      };
      request(app)
        .post(`/users/${users[0]._id}/reservations`)
        .send(invalidData)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          Reservation.find({})
            .then(foundReservations => {
              expect(foundReservations.length).toBe(1);
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });
  });

  describe('DELETE /users/:user_id/reservations/:id', () => {
    it('should remove reservation with exist id', done => {
      request(app)
        .delete(`/users/${users[0]._id}/reservations/${reservations[0]._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Reservation.find({})
            .then(foundReservations => {
              expect(foundReservations.length).toBe(0);
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });

    it('should not remove reservation with absent id', done => {
      request(app)
        .delete(`/users/${users[0]._id}}/reservations/${new ObjectID()}`)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Reservation.find({})
            .then(foundReservations => {
              expect(foundReservations.length).toBe(1);
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });
  });

  describe('GET /users/:user_id/reservations', () => {
    it('should get reservations with exist designer id', done => {
      request(app)
        .get(`/users/${users[1]._id}/reservations`)
        .expect(200)
        .expect(res => {
          expect(res.body[0]._designer._id).toBe(users[1]._id.toHexString());
        })
        .end(done);
    });

    it('should get reservations with exist user id', done => {
      request(app)
        .get(`/users/${users[0]._id}/reservations`)
        .expect(200)
        .expect(res => {
          expect(res.body[0]._user).toBe(users[0]._id.toHexString());
        })
        .end(done);
    });

    it('should get 400 with invalid user id', done => {
      request(app)
        .get('/users/1234/reservations')
        .expect(400)
        .end(done);
    });
  });
});
