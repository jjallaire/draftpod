

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Guilds of Ravnica",

  card_id_filter: function(id) {
    // scryfall doesn't have all of the guildgates (a & b)
    if ([452994,452996,452999,453002,453006].indexOf(id) !== -1)
      return id-1;
    else
      return id;
  },

  pack_cards: 15,

  cube: cube.build,

  booster(selectCards) {
    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotGuildgate, 10),
      selectCards([guildgate, filters.basicLand], 1),
    );

    /*
    if (cards.length === 14) {
      debugger;
      selectCards([guildgate, filters.basicLand], 1);
    }
    */

    return cards;
  },

}

function guildgate(card) {
  const GUILDGATES =  ["Boros Guildgate", "Dimir Guildgate", "Golgari Guildgate",
                       "Izzet Guildgate", "Selesnya Guildgate"];
  return GUILDGATES.indexOf(card.name) >= 0;
}


const commonNotGuildgate = filters.join(filters.common, card => !guildgate(card));


