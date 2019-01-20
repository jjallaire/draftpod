

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Ravnica Allegiance",

  capabilities: {
    custom_cardpool: false
  },

  pack_cards: 15,

  cube: function(cardsInSet, multiples) {

    // generate default cube
    let cards = cube.build(cardsInSet, multiples);

    // generate additional guildgates (since 1 appears in every
    // pack we need roughly 2x the multiple of commons)
    return cards.concat(
      cube.select(cardsInSet, guildgate, multiples.common)
    );
    
  },

  booster(selectCards) {
    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotGuildgate, 10),
      selectCards([guildgate, filters.basicLand], 1),
    );

    return cards;
  },

}

function guildgate(card) {
  const GUILDGATES =  ["Azorius Guildgate", "Gruul Guildgate", "Orzhov Guildgate",
                       "Rakdos Guildgate", "Simic Guildgate"];
  return GUILDGATES.indexOf(card.name) >= 0;
}

const commonNotGuildgate = filters.join(filters.common, card => !guildgate(card));


