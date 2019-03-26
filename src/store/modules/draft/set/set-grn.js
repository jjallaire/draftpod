

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Guilds of Ravnica",

  capabilities: {
    arena_draft: true
  },

  card_id_filter: function(id) {
    // we don't endup importing the (b) guildgates from scryfall
    if ([452994,452996,452999,453002,453006, // Mvid
         244, 246, 249, 252, 256]            // Collector Number
      .indexOf(id) !== -1)
      return id-1;
    else
      return id;
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
  const GUILDGATES =  ["Boros Guildgate", "Dimir Guildgate", "Golgari Guildgate",
                       "Izzet Guildgate", "Selesnya Guildgate"];
  return GUILDGATES.indexOf(card.name) >= 0;
}


const commonNotGuildgate = filters.join(filters.common, card => !guildgate(card));


