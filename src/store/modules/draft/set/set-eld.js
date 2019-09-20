

import * as cube from './cube'
import * as booster from './booster'


export default {

  name: "Throne of Eldraine",

  pack_cards: () => 15,

  cube: cube.build,

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(booster.common, 11)
    );

    return cards;
  },

}



