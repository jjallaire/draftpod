

import { rarity } from './filters'

function guildgate(card) {
  let GUILDGATES =  ["Boros Guildgate", "Dimir Guildgate", "Golgari Guildgate",
                     "Izzet Guildgate", "Selesnya Guildgate"];
  return GUILDGATES.indexOf(card.name) >= 0;
}

export default {

  booster(cards) {

    return [].concat(
      cards(rarity(["mythic", "rare"]), 1),
      cards(rarity(["uncommon"]), 3),
      cards([rarity(["common"]), card => !guildgate(card)], 10),
      cards(guildgate, 1),
    );


  },

  pick(deck, pack) {

    return pack[0];

  }

}