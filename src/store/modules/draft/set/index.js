

import dom from './set-dom'
import m19 from './set-m19'
import grn from './set-grn'
import ust from './set-ust'
import mma from './set-mma'

import axios from 'axios'

const sets = {
  dom,
  m19,
  grn,
  ust,
  mma
}

const cards_cache = {
  // download cards for set once per browser session
};

export function name(set_code) {
  return sets[set_code].name;
}

export function card_id_filter(set_code, id) {
  let filter = sets[set_code].card_id_filter;
  if (filter)
    return filter(id);
  else 
    return id;
}

export function pack_cards(set_code) {
  return sets[set_code].pack_cards;
}

export function cards(set_code) {
  return new Promise((resolve) => {
    if (cards_cache[set_code]) {
      setTimeout(() => {
        resolve(cards_cache[set_code]);
      }, 0);
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


