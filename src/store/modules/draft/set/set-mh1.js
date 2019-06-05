

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Modern Horizons",

  pack_cards: () => 15,


  cube: function(cardsInSet, multiples) {

    // generate default cube
    let cards = cube.build(cardsInSet, multiples);

    // generate additional guildgates (since 1 appears in every
    // pack we need roughly 2x the multiple of commons)
    return cards.concat(
      cube.select(cardsInSet, snowLand, multiples.common)
    );
    
  },

  capabilities: {
    arena_decklists: false,
    custom_cardpool: false
  },

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotSnowLand, 10),
      selectCards(snowLand, 1)
    );

    return cards;

  },

}

function snowLand(card) {
  return card.type_line.startsWith("Basic Snow Land");
}

const commonNotSnowLand = filters.join(filters.common, card => !snowLand(card));



