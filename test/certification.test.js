const expect = require('expect');
const request = require('supertest');
const { app } = require('../app');

describe('Certifacation', () => {
  describe('POST /certification', () => {
    it('should certification', done => {
      request(app)
        .post('/certification')
        .send({ imp_uid: '12345' })
        .expect(400)
        .end(done);
    });
  });
});
