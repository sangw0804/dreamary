const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { Card } = require('../model/card');
const { Recruit } = require('../model/recruit');
const { cards, populateCards } = require('./seed/cardSeed');
const { recruits, populateRecruits } = require('./seed/recruitSeed');
const { users, populateUsers } = require('./seed/userSeed');

beforeEach(populateUsers);
beforeEach(populateRecruits);
beforeEach(populateCards);

describe('Card', () => {
  describe('GET /cards', () => {
    it('should get right cards with query', done => {
      request(app)
        .get('/cards?perm=1&dye=2')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(1);
        })
        .end(done);
    });

    it('should get every cards with no query', done => {
      request(app)
        .get('/cards')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2);
        })
        .end(done);
    });

    it('should return 400 with invalid query', done => {
      request(app)
        .get('/cards?perm=3')
        .expect(400)
        .end(done);
    });
  });

  describe('GET /recruits/:id/cards', () => {
    it('should get every cards of this recruit', done => {
      request(app)
        .get(`/recruits/${recruits[0]._id}/cards`)
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(1);
        })
        .end(done);
    });

    it('should get filtered cards of this recruit', done => {
      request(app)
        .get(`/recruits/${recruits[0]._id}/cards?perm=1&dye=2`)
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(1);
        })
        .end(done);
    });

    it('should get 400 with invalid recruit id', done => {
      request(app)
        .get('/recruits/123a/cards')
        .expect(400)
        .end(done);
    });
  });

  describe('POST /recruits/:id/cards', () => {
    it('should create new card with correct recruit id', done => {
      const data = {
        _recruit: recruits[0]._id,
        date: new Date().setHours(6, 0, 0, 0),
        ableTimes: [
          {
            since: 600,
            until: 780
          },
          {
            since: 1200,
            until: 1380
          }
        ],
        price: {
          cut: 3000,
          perm: 20000,
          dye: 30000
        },
        must: {
          cut: false,
          perm: true,
          dye: false
        },
        no: {
          cut: false,
          perm: false,
          dye: true
        }
      };
      request(app)
        .post(`/recruits/${recruits[0]._id}/cards`)
        .send(data)
        .expect(200)
        .expect(res => {
          expect(res.body._id.length).toBeGreaterThan(0);
        })
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundCards = await Card.find({ _recruit: recruits[0]._id });
            expect(foundCards.length).toBe(2);
            const foundRecruit = await Recruit.findById(recruits[0]._id);
            expect(foundRecruit._cards.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should get 400 with invalid data', done => {
      const invalidData = {
        invalid: 'data'
      };
      request(app)
        .post(`/recruits/${recruits[0]._id}/cards`)
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundCards = await Card.find({ _recruit: recruits[0]._id });
            expect(foundCards.length).toBe(1);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should get 400 with absent recruit id', done => {
      const data = {
        _id: new ObjectID(),
        _recruit: new ObjectID(), // absent recruit id
        date: 20180928,
        ableTimes: [
          {
            since: new Date().getTime(),
            until: new Date().getTime() + 30000000
          },
          {
            since: new Date().getTime() + 40000000,
            until: new Date().getTime() + 70000000
          }
        ],
        reservedTimes: [],
        price: {
          cut: 3000,
          perm: 20000,
          dye: 30000
        },
        must: {
          cut: false,
          perm: true,
          dye: false
        },
        no: {
          cut: false,
          perm: false,
          dye: true
        }
      };
      request(app)
        .post(`/recruits/${data._recruit}/cards`)
        .send(data)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundCards = await Card.find({});
            expect(foundCards.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('DELETE /recruits/:id/cards/:card_id', () => {
    it('should remove card with valid id', done => {
      request(app)
        .delete(`/recruits/${recruits[0]._id}/cards/${cards[0]._id}`)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            await setTimeout(() => 1, 1000); // asyncronous 문제로 잠깐 기다림

            const foundCards = await Card.find({});
            expect(foundCards.length).toBe(1);
            const foundRecruit = await Recruit.findById(recruits[0]._id);
            expect(foundRecruit._cards.length).toBe(0);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should get 400 with invalid id', done => {
      request(app)
        .delete(`/recruits/${recruits[0]._id}/cards/123`)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundCards = await Card.find({});
            expect(foundCards.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not remove card with absent id', done => {
      request(app)
        .delete(`/recruits/${recruits[0]._id}/cards/${new ObjectID()}`)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) {
              throw new Error(err);
            }
            const foundCards = await Card.find({});
            expect(foundCards.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
