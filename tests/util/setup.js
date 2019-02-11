


// mock the set module to read card json directly from disk
// (otherwise the http call would have failed entirely)
jest.mock('../../src/store/modules/draft/set', () => {
  return {
    ...(jest.requireActual('../../src/store/modules/draft/set')),
    cards: set_code => {
      let cards = require('../../public/sets/' + set_code + '/cards.json');
      return Promise.resolve(cards);
    }
  }
});