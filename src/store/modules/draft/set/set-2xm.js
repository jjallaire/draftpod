

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Double Masters",

  pack_cards: () => 15,

  cube: cube.build,

  capabilities: {
    arena_decklists: false
  },


  booster(selectCards) {
    let cards = [].concat(
      selectCards(booster.packRareSlot, 2),
      selectCards(booster.uncommon, 4),
      selectCards(booster.common, 9)
    );
    return cards;
  },
}


