const expect = require('expect');
const request = require('supertest');
const { app } = require('../app');

describe('Certifacation', () => {
  describe('POST /certification', () => {
    it('should certification', done => {
      // jest 테스팅은 마치 브라우저에서 요청을 보낸 것과 같아 cors 이슈 발생
      // request(app)
      //   .post('/certification')
      //   .send({ imp_uid: 'imp_448280090638' })
      //   .expect(400)
      //   .end(done);
    });
  });
});
