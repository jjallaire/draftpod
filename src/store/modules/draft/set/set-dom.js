

import * as filters from '../card-filters'
import * as ai from './draft-ai'
import * as cube from './draft-cube'

export default {

  name: "Dominaria",

  cube: cube.defaultCube,

  booster(cards) {

    // allocate rares and uncommons
    let rares_and_uncommons = [].concat(
      cards(filters.packRareSlot, 1),
      cards(filters.uncommon, 3)
    );

    // if there is no legendary then fill in legendary slot
    if (rares_and_uncommons.filter(legendary).length === 0) {
      rares_and_uncommons.pop();
      rares_and_uncommons.push(
        cards(filters.join(legendaryUncommon, filters.notOneOf(rares_and_uncommons)), 1)[0]
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


