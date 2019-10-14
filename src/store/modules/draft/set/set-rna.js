

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Ravnica Allegiance",

  card_id_filter: function(id) {
    // convert temporariy decked builder ids to mvid
    if (id >= 1235178 && id <= 1235436)
      id = 457145 + (id - 1235178);
   
    // we don't end up importing the (b) guildgates from scryfall
    if ([457388,457394,457397,457400,457402, // Mvid
         244, 250, 253, 256, 258]            // Collector Number
        .indexOf(id) !== -1)
      return id-1;
    else
      return id;
  },

  pack_cards: () => 15,

  cube: function(cardsInSet, multiples) {

    // generate default cube
    let cards = cube.build(cardsInSet, multiples);

    // generate additional guildgates (since 1 appears in every
    // pack we need roughly 2x the multiple of commons)
    return cards.concat(
      cube.select(cardsInSet, guildgate, multiples.common)
    );
    
  },

  cardpool_basics: [459994,459995,459996,459997,459998],

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


