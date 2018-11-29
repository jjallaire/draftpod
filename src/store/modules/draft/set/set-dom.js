

import * as filters from '../card-filters'
import * as cube from './cube'

export default {

  name: "Dominaria",

  cube: cube.build,

  booster(selectCards) {

    // allocate rares and uncommons
    let rares_and_uncommons = [].concat(
      selectCards(filters.packRareSlot, 1),
      selectCards(filters.uncommon, 3)
    );

    // if there is no legendary then fill in legendary slot
    if (rares_and_uncommons.filter(legendary).length === 0) {
      rares_and_uncommons.pop();
      rares_and_uncommons.push(
        selectCards(filters.join(legendaryUncommon, filters.notOneOf(rares_and_uncommons)), 1)[0]
      );
    }
  
    return [].concat(
      rares_and_uncommons,
      selectCards(filters.common, 11)
    );
  },
}

function legendary(card) {
  return card.type_line.startsWith("Legendary");
}

function legendaryUncommon(card) {
  return (legendary(card) && filters.uncommon(card));
}


