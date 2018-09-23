const expect = require('expect');
const request = require('supertest');
// const {ObjectID} = require("mongodb");
const { app } = require('../app');
const { User } = require('../model/user');
const { populateUsers } = require('./seed/userSeed');

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
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create new user with valid id', done => {
      const data = {
        _uid: '4',
        isD: false,
        name: '이정민',
        phone: '01098765432'
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
});
