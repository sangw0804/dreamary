const expect = require('expect');
const request = require('supertest');
const { app } = require('../app');

describe('Certifacation', () => {
  describe('POST /certification', () => {
    it('should certification', done => {
      request(app)
        .post('/certification')
        .send({ imp_uid: 'imp_448280090638' })
        .expect(400)
        .end(done);
    });
  });
});
