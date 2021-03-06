

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Rivals of Ixalan",

  expansion_set: true,

  pack_set: pack_number => {
    return ((pack_number % 3) === 0) ? 'xln' : 'rix'
  },

  pack_cards: () => 15,

  cube: cube.build,

  capabilities: {
    arena_decklists: false
  },


  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(booster.common, 11)
    );

    return cards;
  },

}


