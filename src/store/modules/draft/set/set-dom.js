

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Dominaria",

  pack_cards: 15,

  cube: cube.build,

  booster(selectCards) {

    // allocate rares and uncommons
    let rares_and_uncommons = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3)
    );

    // if there is no legendary then fill in legendary slot
    if (rares_and_uncommons.filter(legendary).length === 0) {
      rares_and_uncommons.pop();
      rares_and_uncommons.push(
        selectCards([filters.join(legendaryUncommon, filters.notOneOf(rares_and_uncommons))]
                     .concat(booster.uncommon), 1)[0]
      );
    }
  
    return [].concat(
      rares_and_uncommons,
      selectCards(booster.common, 11)
    );
  },
}

function legendary(card) {
  return card.type_line.startsWith("Legendary");
}

function legendaryUncommon(card) {
  return (legendary(card) && filters.uncommon(card));
}


