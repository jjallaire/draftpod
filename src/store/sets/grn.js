

import { rarityFilter } from './filters'

function guildgateFilter(card) {
  let GUILDGATES =  ["Boros Guildgate", "Dimir Guildgate", "Golgari Guildgate",
                     "Izzet Guildgate", "Selesnya Guildgate"];
  return "common" === card.rarity && GUILDGATES.indexOf(card.name) >= 0;
}

export default {

  generateBooster(drawCards) {


    return [].concat(
      drawCards(rarityFilter(["mythic", "rare"]), 1),
      drawCards(rarityFilter(["uncommon"]), 3),
      drawCards([rarityFilter(["common"]), card => !guildgateFilter(card)], 10),
      drawCards(guildgateFilter, 1),
    );


  },

  draftPick(deck, pack) {

    return pack[0];

  }

}