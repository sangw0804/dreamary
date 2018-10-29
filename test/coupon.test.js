const expect = require('expect');
const request = require('supertest');
const { app } = require('../app');
const { populateUsers } = require('./seed/userSeed');
const { populateCoupons, coupons } = require('./seed/couponSeed');
const { Coupon } = require('../model/coupon');

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
        number: 10
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
  });
});
