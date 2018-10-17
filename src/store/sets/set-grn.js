

import * as filters from './card-filters'
import * as ai from './draft-ai'

export default {

  booster(cards) {

    return [].concat(
      cards(filters.rarity(["mythic", "rare"]), 1),
      cards(filters.rarity(["uncommon"]), 3),
      cards([filters.rarity(["common"]), card => !guildgate(card)], 10),
      cards(guildgate, 1),
    );


  },

  pick(deck, pack) {

    return ai.pick(deck, pack);

  }

}

function guildgate(card) {
  const GUILDGATES =  ["Boros Guildgate", "Dimir Guildgate", "Golgari Guildgate",
                       "Izzet Guildgate", "Selesnya Guildgate"];
  return GUILDGATES.indexOf(card.name) >= 0;
}
