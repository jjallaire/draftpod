

import * as filters from '../card-filters'
import * as cube from './cube'

export default {

  name: "Guilds of Ravnica",

  cube: function(cardsInSet, multiples) {

    // generate default cube
    let cards = cube.build(cardsInSet, multiples);

    // generate additional guildgates (since 1 appears in every
    // pack we need roughly 2x the multiple of commons)
    return cards.concat(
      cube.select(cardsInSet, guildgate, multiples.common)
    );
    
  },

  booster(cards) {

    return [].concat(
      cards(filters.packRareSlot, 1),
      cards(filters.uncommon, 3),
      cards(filters.join(filters.common, card => !guildgate(card)), 10),
      cards(guildgate, 1),
    );


  },

}

function guildgate(card) {
  const GUILDGATES =  ["Boros Guildgate", "Dimir Guildgate", "Golgari Guildgate",
                       "Izzet Guildgate", "Selesnya Guildgate"];
  return GUILDGATES.indexOf(card.name) >= 0;
}
