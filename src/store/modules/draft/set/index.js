

import dom from './set-dom'
import m19 from './set-m19'
import grn from './set-grn'

import axios from 'axios'

const sets = {
  dom,
  m19,
  grn
}

const cards_cache = {
  // download cards for set once per browser session
};

export function name(set_code) {
  return sets[set_code].name;
}

export function cards(set_code) {
  return new Promise((resolve) => {
    if (cards_cache[set_code]) {
      resolve(cards_cache[set_code]);
    } else {
      axios.get('/sets/' + set_code + '/cards.json')
        .then(response => {
          cards_cache[set_code] = response.data;
          resolve(cards_cache[set_code]);
        });
    }
  });
}

export function cube(set_code, cardsInSet, multiples) {
  return sets[set_code].cube(cardsInSet, multiples);
}

export function booster(set_code, cards) {
  return sets[set_code].booster(cards);
}


