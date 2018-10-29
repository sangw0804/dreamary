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
        _designer: users[1]._id,
        _card: cards[0]._id,
        date: cards[0].date,
        time: {
          since: 560,
          until: 740
        },
        services: {
          perm: true
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
            expect(foundUser._reservations.length).toBe(2);
            const foundCard = await Card.findById(res.body._card);
            expect(foundCard.reservedTimes[0].since).toBe(res.body.time.since); // reservedTimes 정렬 확인
            expect(foundCard.reservable).toBe(false); // reservable true => false 로 바뀌었는지 확인
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
              expect(foundReservations.length).toBe(2);
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
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundReservations = await Reservation.find({});
            expect(foundReservations.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
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
              expect(foundReservations.length).toBe(2);
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
          expect(res.body[0]._user._id).toBe(users[0]._id.toHexString());
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

  describe('PATCH /users/:user_id/reservations/:id', () => {
    it('should cancel reservation and remove from card reservedTime', done => {
      request(app)
        .patch(`/users/${users[0]._id}/reservations/${reservations[0]._id}`)
        .send({ isCanceled: 'true' })
        .expect(200)
        .expect(res => {
          expect(res.body.isCanceled).toBe(true);
        })
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }

            const card = await Card.findById(res.body._card);
            expect(card.reservedTimes.length).toBe(0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should cancel reservation and remove from card reservedTime', done => {
      request(app)
        .patch(`/users/${users[0]._id}/reservations/${reservations[0]._id}`)
        .send({ isDone: 'true' })
        .expect(200)
        .expect(res => {
          expect(res.body.isDone).toBe(true);
        })
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }

            const card = await Card.findById(res.body._card);
            expect(card.reservedTimes.length).toBe(0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
