const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../app');
const { User } = require('../model/user');
const { Recruit } = require('../model/recruit');
const { recruits, populateRecruits } = require('./seed/recruitSeed');
const { users, populateUsers } = require('./seed/userSeed');
const { cards, populateCards } = require('./seed/cardSeed');

// seed Recruit db
beforeEach(populateUsers);
beforeEach(populateRecruits);
beforeEach(populateCards);

// test Recruit
describe('Recruit', () => {
  describe('GET /recruits', () => {
    it('should get every recruits', done => {
      request(app)
        .get('/recruits')
        .expect(200)
        .expect(res => {
          expect(res.body[0]._designer._id).toBe(users[1]._id.toHexString());
        })
        .end(done);
    });
  });

  describe('GET /recruits/:id', () => {
    it('should get one recruit with valid exist user id', done => {
      request(app)
        .get(`/recruits/${recruits[0]._id.toHexString()}`)
        .expect(200)
        .expect(res => {
          expect(res.body._designer._id).toBe(users[1]._id.toHexString());
        })
        .end(done);
    });

    it('should get 400 with invalid user id', done => {
      request(app)
        .get('/recruits/123')
        .expect(400)
        .end(done);
    });

    it('should get 400 with absent user id', done => {
      request(app)
        .get(`/recruits/${new ObjectID().toHexString()}`)
        .expect(400)
        .end(done);
    });
  });

  describe('POST /recruits', () => {
    it('should make recruit with valid params', done => {
      const data = {
        _designer: users[2]._id,
        title: '두번째 디자이너의 모집글',
        designerName: '신한결',
        ableDates: [
          {
            since: 20180910123412,
            until: 20180910142344
          }
        ]
      };
      request(app)
        .post('/recruits')
        .send(data)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundRecruits = await Recruit.find();
            expect(foundRecruits.length).toBe(3);
            const user = await User.findById(res.body._designer);
            expect(user._recruit.toHexString()).toBe(res.body._id);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not make recruit with invalid params', done => {
      const invalidData = {
        title: '디자이너 아이디가 없음'
      };
      request(app)
        .post('/recruits')
        .send(invalidData)
        .expect(400)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundRecruits = await Recruit.find();
            expect(foundRecruits.length).toBe(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('DELETE /recruits/:id', () => {
    it('should remove recruit with valid user id', done => {
      request(app)
        .delete(`/recruits/${recruits[0]._id.toHexString()}`)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) throw new Error(err);

            const foundRecruits = await Recruit.find();
            expect(foundRecruits.length).toBe(1);
            const user = await User.findById(users[1]._id);
            expect(user._recruit).toBeFalsy();
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should not remove recruit with absent user id', done => {
      request(app)
        .delete(`/recruits/${new ObjectID().toHexString()}`)
        .expect(400)
        .end(done);
    });

    it('should get 400 with invalid user id', done => {
      request(app)
        .delete('/recruits/123')
        .expect(400)
        .end(done);
    });
  });

  describe('PATCH /recruits/:id', () => {
    it('should update recruit with exist id', done => {
      const title = '수정된 타이틀';
      request(app)
        .patch(`/recruits/${recruits[0]._id}`)
        .send({ title })
        .expect(200)
        .expect(res => {
          expect(res.body.title).toBe(title);
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            Recruit.findById(recruits[0]._id)
              .then(foundRecruit => {
                expect(foundRecruit.title).toBe(title);
                done();
              })
              .catch(e => {
                done(e);
              });
          }
        });
    });

    it('should return 400 with absent id', done => {
      const title = '수정된 타이틀';
      request(app)
        .patch(`/recruits/${new ObjectID().toHexString()}`)
        .send({ title })
        .expect(400)
        .end(done);
    });

    it('should return 400 with invalid id', done => {
      const title = '수정된 타이틀';
      request(app)
        .patch('/recruits/12')
        .send({ title })
        .expect(400)
        .end(done);
    });
  });
});
