

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Kaldheim",

  pack_cards: () => 15,

  cube: cube.build,

  booster(selectCards) {

    const cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotSnowLand, 10),
    );

    if (Math.random() <= (5/12)) {
      // fallback to basic snow if there aren't enough dual snow lands
      const dualLand = [dualSnowLand, basicSnowLand, filters.basicLand];
      return cards.concat(selectCards(dualLand, 1));
    } else {
      // fallback to basic if there aren't enough basic snow lands
      return cards.concat(selectCards([basicSnowLand, filters.basicLand], 1));
    }
    
  },
}

const commonNotSnowLand = filters.join(
  filters.common, 
  card => !basicSnowLand(card), 
  card => !dualSnowLand(card)
)

function basicSnowLand(card) {
  return card.type_line.startsWith("Basic Snow Land");
}

function dualSnowLand(card) {
  return card.type_line.startsWith("Snow Land —");
}



