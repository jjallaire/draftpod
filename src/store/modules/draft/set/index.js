

import dom from './set-dom'
import m19 from './set-m19'
import grn from './set-grn'
import rna from './set-rna'
import ust from './set-ust'
import xln from './set-xln'
import rix from './set-rix'

import axios from 'axios'

const sets = {
  dom,
  m19,
  grn,
  rna,
  ust,
  xln,
  rix
}

const cards_cache = {
  // download cards for set once per browser session
};

export function name(set_code) {
  return sets[set_code].name;
}

export function is_edition(set_code, edition) {
  let is_edition = sets[set_code].is_edition;
  if (is_edition)
    return is_edition(edition);
  else
    return name(set_code) === edition;
}

export function capabilities(set_code) {
  return sets[set_code].capabilities || {
    custom_cardpool: true
  };
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
  if (cards_cache[set_code]) {
    return Promise.resolve(cards_cache[set_code]);
  } else {
    return axios.get('/sets/' + set_code + '/cards.json')
      .then(response => {
        cards_cache[set_code] = response.data;
        return cards_cache[set_code];
      });
  }
}

export function cube(set_code, cardsInSet, multiples) {
  return sets[set_code].cube(cardsInSet, multiples);
}

export function booster(set_code, cards) {
  return sets[set_code].booster(cards);
}


