

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Amonkhet",

  pack_cards: () => 14,

  cube: cube.build,

  capabilities: {
    arena_decklists: false
  },


  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(booster.common, 10)
    );

    return cards;
  },

}




