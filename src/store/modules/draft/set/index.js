

import dom from './set-dom'
import m19 from './set-m19'
import grn from './set-grn'


const sets = {
  dom,
  m19,
  grn
}

export function name(set_code) {
  return sets[set_code].name;
}

export function cube(set_code, cardsInSet, multiples) {
  return sets[set_code].cube(cardsInSet, multiples);
}

export function booster(set_code, cards) {
  return sets[set_code].booster(cards);
}


