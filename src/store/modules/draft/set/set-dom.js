

import * as filters from '../card-filters'
import * as ai from './draft-ai'

export default {

  name: "Dominaria",

  booster(cards) {

    // allocate rares and uncommons
    let rares_and_uncommons = [].concat(
      cards(filters.rare, 1),
      cards(filters.uncommon, 3)
    );

    // if there is no legendary then fill in legendary slot
    if (rares_and_uncommons.filter(legendary).length === 0) {
      rares_and_uncommons.pop();
      rares_and_uncommons.push(
        cards([legendaryUncommon, filters.notOneOf(rares_and_uncommons)], 1)[0]
      );
    }
  
    return [].concat(
      rares_and_uncommons,
      cards(filters.common, 11)
    );
  },

  pick(deck, pack) {

    return ai.pick(deck, pack);

  }

}

function legendary(card) {
  return card.type_line.startsWith("Legendary");
}

function legendaryUncommon(card) {
  return (legendary(card) && filters.uncommon(card));
}


