

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Rivals of Ixalan",

  pack_cards: (numberOfPacks) => (numberOfPacks === 5) ? 13 : 15,

  cube: cube.build,

  booster(selectCards, numberOfPacks) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, (numberOfPacks === 5) ? 5 : 3),
      selectCards(booster.common, (numberOfPacks === 5) ? 7 : 11)
    );

    return cards;
  },

}


