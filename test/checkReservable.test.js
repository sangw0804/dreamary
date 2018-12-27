const expect = require('expect');

const { checkReservable } = require('../scripts/checkReservable');
const { Card } = require('../model/card');
const { populateUsers } = require('./seed/userSeed');
const { populateRecruits } = require('./seed/recruitSeed');
const { populateCards } = require('./seed/cardSeed');

beforeEach(populateUsers);
beforeEach(populateRecruits);
beforeEach(populateCards);

describe('CheckReservable', () => {
  it('should change reservable to false if date is tomorrow', async done => {
    try {
      const reservableCardsNumBefore = await Card.find({ reservable: true }).count();
      await checkReservable();
      const reservableCardsNumAfter = await Card.find({ reservable: true }).count();
      expect(reservableCardsNumAfter).toBe(reservableCardsNumBefore - 1);
      done();
    } catch (e) {
      done(e);
    }
  });
});
