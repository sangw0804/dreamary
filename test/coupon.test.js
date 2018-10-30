const expect = require('expect');
const request = require('supertest');
const { app } = require('../app');
const { populateUsers, users } = require('./seed/userSeed');
const { populateCoupons, coupons } = require('./seed/couponSeed');
const { Coupon } = require('../model/coupon');
const { User } = require('../model/user');

beforeEach(populateUsers);
beforeEach(populateCoupons);

describe('Coupon', () => {
  describe('GET /coupons', () => {
    it('should get every coupons', done => {
      request(app)
        .get('/coupons')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('POST /coupons', () => {
    it('should make coupons with valid data', done => {
      const validData = {
        point: 1000,
        number: 10,
        forDesigner: true
      };
      request(app)
        .post('/coupons')
        .send(validData)
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(10);
        })
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const foundCoupons = await Coupon.find({ point: 1000 });
            expect(foundCoupons.length).toBe(10);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid data', done => {
      const invalidData = {
        number: 10
      };
      request(app)
        .post('/coupons')
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);
            const foundCoupons = await Coupon.find();
            expect(foundCoupons.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('PATCH /coupons/:id', () => {
    it('should update coupon with valid data', done => {
      const validData = {
        _user: users[1]._id,
        isD: false
      };
      request(app)
        .patch(`/coupons/${coupons[0]._id}`)
        .send(validData)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const coupon = await Coupon.findById(coupons[0]._id);
            expect(coupon._user.toHexString()).toBe(users[1]._id.toHexString());
            const user = await User.findById(users[1]._id);
            expect(user.point).toBe(coupons[0].point);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should update coupon and ticket with valid data', done => {
      const validData = {
        _user: users[2]._id,
        isD: true
      };
      request(app)
        .patch(`/coupons/${coupons[1]._id}`)
        .send(validData)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const coupon = await Coupon.findById(coupons[1]._id);
            expect(coupon._user.toHexString()).toBe(users[2]._id.toHexString());
            const user = await User.findById(users[2]._id);
            expect(user._tickets.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return 400 with invalid data', done => {
      const invalidData = {
        _user: '123'
      };
      request(app)
        .patch(`/coupons/${coupons[0]._id}`)
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const coupon = await Coupon.findById(coupons[0]._id);
            expect(coupon._user).toBeNull();
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
