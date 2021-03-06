const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { Withdraw } = require('../model/withdraw');
const { User } = require('../model/user');
const { populateUsers, users } = require('./seed/userSeed');
const { populateWithdraws, withdraws } = require('./seed/withdrawSeed');

beforeEach(populateUsers);
beforeEach(populateWithdraws);

describe('Withdraw', () => {
  describe('GET /withdraws', () => {
    it('should get every withdraws', done => {
      request(app)
        .get('/withdraws')
        .expect(200)
        .expect(res => {
          expect(res.body[0]._id).toBe(withdraws[0]._id.toHexString());
        })
        .end(done);
    });
  });

  describe('GET /withdraws/:user_id', () => {
    it("should get specific user's withdraws", done => {
      request(app)
        .get(`/withdraws/${users[1]._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(1);
          expect(res.body[0]._id).toBe(withdraws[1]._id.toHexString());
        })
        .end(done);
    });
  });

  describe('POST /withdraws', () => {
    it('should create new withdraw with valid data', done => {
      const data = {
        _designer: users[1]._id,
        name: '홍길동',
        socialId: '950804-1234567',
        address: '서울시 성북구 안암로 123-44',
        accountHolder: '홍길동',
        bank: '우리은행',
        accountNumber: '123-456-123456',
        money: 20000,
        email: 'dreamary@korea.ac.kr'
      };
      request(app)
        .post('/withdraws')
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundWithdraw = await Withdraw.find({});
            expect(foundWithdraw.length).toBe(3);

            const designer = await User.findById(users[1]._id);
            expect(designer.money).toBe(0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid data', done => {
      const data = {
        _designer: users[0]._id.toHexString()
      };
      request(app)
        .post('/withdraws')
        .send(data)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundWithdraws = await Withdraw.find({});
            expect(foundWithdraws.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PATCH /withdraws/:id', () => {
    it('should update specific withdraw with valid data', done => {
      const data = {
        isRefused: true
      };
      request(app)
        .patch(`/withdraws/${withdraws[0]._id}`)
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundWithdraw = await Withdraw.findById(withdraws[0]._id);
            expect(typeof foundWithdraw.updatedAt).toBe('number');
            expect(foundWithdraw.isRefused).toBe(true);

            const foundDesigner = await User.findById(foundWithdraw._designer);
            expect(foundDesigner.money).toBe(10000);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid data', done => {
      const invalidData = {
        isRefused: 'hi'
      };
      request(app)
        .patch(`/withdraws/${withdraws[0]._id}`)
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundWithdraw = await Withdraw.findById(withdraws[0]._id);

            expect(foundWithdraw.updatedAt).toBeNull();
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
