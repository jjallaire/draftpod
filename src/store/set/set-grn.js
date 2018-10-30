

import * as filters from '../card-filters'
import * as ai from './draft-ai'

export default {

  name: "Guilds of Ravnica",

  booster(cards) {

    return [].concat(
      cards(filters.rare, 1),
      cards(filters.uncommon, 3),
      cards([filters.common, card => !guildgate(card)], 10),
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
