const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { users, populateUsers } = require('./seed/userSeed');
const { tickets, populateTicket } = require('./seed/ticketSeed');
const { Ticket } = require('../model/ticket');
const { User } = require('../model/user');

beforeEach(populateUsers);
beforeEach(populateTicket);

// test Ticket
describe('Ticket', () => {
  describe('GET /users/:id/tickets', () => {
    it('should get all tickets with exist user id', done => {
      request(app)
        .get(`/users/${users[0]._id}/tickets`)
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2);
          expect(res.body[0].price).toBe(3000);
        })
        .end(done);
    });

    it('should not get tickets with exist user who has no ticket at all', done => {
      request(app)
        .get(`/users/${users[2]._id}/tickets`)
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(0);
        })
        .end(done);
    });

    it('should get 400 with absent user id', done => {
      request(app)
        .get(`/users/${new ObjectID()}/tickets`)
        .expect(400)
        .end(done);
    });
  });

  describe('POST /users/:id/tickets', () => {
    it('should create new ticket with valid data', done => {
      const data = {
        isD: true,
        price: 10000
      };
      let ticketId;
      request(app)
        .post(`/users/${users[2]._id}/tickets`)
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body.price).toBe(10000);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Ticket.findById(res.body._id)
            .then(foundTicket => {
              ticketId = foundTicket._id;
              expect(foundTicket._user.toHexString()).toBe(users[2]._id.toHexString());
              expect(foundTicket.createdAt).toBeTruthy();
              expect(foundTicket.expiredAt).toBeNull();

              return User.findById(foundTicket._user);
            })
            .then(foundUser => {
              expect(foundUser._tickets.pop().toHexString()).toBe(ticketId.toHexString());
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });

    it('should not create new ticket with invalid data', done => {
      const invalidData = {
        isD: true
      };
      request(app)
        .post(`/users/${users[2]._id}/tickets`)
        .send(invalidData)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Ticket.find({})
            .then(foundTickets => {
              expect(foundTickets.length).toBe(3);
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });

    it('should not create new ticket with absent user id', done => {
      const data = {
        isD: true,
        price: 10000
      };
      request(app)
        .post(`/users/${new ObjectID()}/tickets`)
        .send(data)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Ticket.find({})
            .then(foundTickets => {
              expect(foundTickets.length).toBe(3);
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });
  });

  describe('PATCH /users/:id/tickets/:ticket_id', () => {
    it('should update ticket with valid user id', done => {
      const data = {};
      request(app)
        .patch(`/users/${tickets[0]._user}/tickets/${tickets[0]._id}`)
        .send(data)
        .expect(200)
        .expect(res => {
          expect(typeof res.body.expiredAt).toBe('number');
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Ticket.findById(tickets[0]._id)
            .then(foundTicket => {
              expect(typeof foundTicket.expiredAt).toBe('number');
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });

    it('should not update ticket with absent user id', done => {
      const data = {};
      request(app)
        .patch(`/users/${new ObjectID()}/tickets/${tickets[0]._id}`)
        .send(data)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Ticket.findById(tickets[0]._id)
            .then(foundTicket => {
              expect(foundTicket.expiredAt).toBeNull();
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });
  });
});
