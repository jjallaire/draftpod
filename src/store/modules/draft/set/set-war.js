

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

import { CARDPOOL } from '../../../constants'

export default {

  name: "War of the Spark",

  pack_cards: () => 13,

  cube: cube.build,

  default_cube: CARDPOOL.CUBE + '4/2/1/1',

  booster(selectCards) {

     // allocate rares and uncommons
     let rares_and_uncommons = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3)
    );

    // if there is no planeswalker then fill in planeswalker slot
    if (rares_and_uncommons.filter(plainswalker).length === 0) {
      rares_and_uncommons.pop();
      rares_and_uncommons.push(
        selectCards([filters.join(planeswalkerUncommon, filters.notOneOf(rares_and_uncommons))]
                     .concat(booster.uncommon), 1)[0]
      );
    }
  
    return [].concat(
      rares_and_uncommons,
      selectCards(booster.common, 9)
    );
  },
}


function plainswalker(card) {
  return card.type_line.startsWith("Legendary Planeswalker") ||
         card.type_line.startsWith("Planeswalker");
}

function planeswalkerUncommon(card) {
  return (plainswalker(card) && filters.uncommon(card));
}


