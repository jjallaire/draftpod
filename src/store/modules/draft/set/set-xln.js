

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Ixalan",

  pack_cards: (numberOfPacks) => (numberOfPacks === 5) ? 14: 15,

  cube: cube.build,

  booster(selectCards, numberOfPacks) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(booster.common, (numberOfPacks === 5) ? 10: 11)
    );

    return cards;
  },

}


