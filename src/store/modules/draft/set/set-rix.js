

import * as cube from './cube'
import * as booster from './booster'

export default {

  name: "Rivals of Ixalan",

  pack_cards: () => 15,

  cube: cube.build,

  booster(selectCards, numberOfPacks, packNumber) {

    let set = (packNumber % 2) ? 'rix' : 'xln';

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1, set),
      selectCards(booster.uncommon, 3, set),
      selectCards(booster.common, 11, set)
    );

    return cards;
  },

}


