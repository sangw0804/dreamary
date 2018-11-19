const expect = require('expect');
const request = require('supertest');
// const {ObjectID} = require("mongodb");
const { app } = require('../app');
const { User } = require('../model/user');
const { populateUsers, users } = require('./seed/userSeed');

// seed User db
beforeEach(populateUsers);

// test User
describe('User', () => {
  describe('GET /users', () => {
    it('should get every users', done => {
      request(app)
        .get('/users')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(3);
          expect(res.body[0].point).toBe(0);
        })
        .end(done);
    });
  });

  describe('GET /users/:id', () => {
    it('should get user with valid id', done => {
      request(app)
        .get(`/users/${users[0]._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create new user with valid id', done => {
      const data = {
        _uid: '4'
      };
      request(app)
        .post('/users')
        .send(data)
        .expect(200)
        .expect(res => {
          expect(typeof res.body._id).toBe('string');
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(res.body._id)
            .then(foundUser => {
              expect(foundUser._uid).toBe('4');
              expect(foundUser._tickets.length).toBe(0);
              done();
            })
            .catch(e => {
              done(e);
            });
        });
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', done => {
      request(app)
        .patch(`/users/${users[0]._id}`)
        .send({ name: '굳굳' })
        .expect(200)
        .expect(res => {
          expect(res.body.name).toBe('굳굳');
        })
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const user = await User.findById(users[0]._id);
            expect(user.name).toBe('굳굳');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PATCH /users/:id/addpoint', () => {
    it('should add 1000 point to user', done => {
      request(app)
        .patch(`/users/${users[0]._id}/addpoint`)
        .send({ point: 1000 })
        .expect(200)
        .expect(res => {
          expect(res.body.point).toBe(1000);
        })
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const user = await User.findById(res.body._id);
            expect(user.point).toBe(1000);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid id', done => {
      request(app)
        .patch(`/users/123/addpoint`)
        .expect(400)
        .end(done);
    });
  });
});
