

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Aether Revolt",

  pack_set: pack_number => {
    return ((pack_number % 3) === 0) ? 'kld' : 'aer'
  },

  pack_cards: () => 14,

  capabilities: {
    arena_decklists: false
  },

  cube: cube.build,

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(booster.common, 10)
    );

    return cards;
  },

}


