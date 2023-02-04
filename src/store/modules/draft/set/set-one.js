

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Phyrexia: All Will Be One",

  pack_cards: () => 14,

  capabilities: {
    arena_decklists: false,
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


