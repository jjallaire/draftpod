

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Kaldheim",

  pack_cards: () => 15,

  cube: cube.build,

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotLand, 10),
      selectCards(snowLand, 1)
    );
    
    return cards;
  },
}

const commonNotLand = filters.join(
  filters.common, 
  card => !filters.basicLand(card), 
  card => !snowLand(card)
)

function snowLand(card) {
  return card.type_line.startsWith("Basic Snow Land") ||
         card.type_line.startsWith("Snow Land —");
}

