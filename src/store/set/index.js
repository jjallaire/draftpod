

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

export function booster(set_code, cards) {
  return sets[set_code].booster(cards);
}

export function pick(set_code, deck, pack) {
  return sets[set_code].pick(deck, pack);
}

