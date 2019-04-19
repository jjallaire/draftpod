


window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});

// mock the set module to read card json directly from disk
// (otherwise the http call would have failed entirely)
jest.mock('../../../src/store/modules/draft/set', () => {
  return {
    ...(jest.requireActual('../../../src/store/modules/draft/set')),
    cards: set_code => {
      let cards = require('../../../public/sets/' + set_code + '/cards.json');
      return Promise.resolve(cards);
    },
    cards_cached: set_code => {
      let cards = require('../../../public/sets/' + set_code + '/cards.json');
      return cards;
    },
    is_custom_cube: set_code => false
  }
});

import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
