

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

import { CARDPOOL } from '../../../constants'

export default {

  name: "War of the Spark",

  pack_cards: () => 15,

  capabilities: {
    custom_cardpool: false
  },

  cube: cube.build,

  default_cube: CARDPOOL.CUBE + '4/2/1/1',

  booster(selectCards) {

    // allocate rares
    let rares = [].concat(selectCards(booster.packRareSlot, 1));

    // add uncommon plainswalker if we don't have a rare one
    let uncommons = [];
    if (rares.filter(plainswalker).length === 0) {
      uncommons.push(selectCards(planeswalkerUncommon, 1)[0]);
    }

    // fill in uncommons
    uncommons = uncommons.concat(
      selectCards([filters.join(filters.uncommon, notPlaneswalker)].concat(booster.uncommon), 3 - uncommons.length)
    );  
  
    return [].concat(
      rares,
      uncommons,
      selectCards(booster.common, 11)
    );
  },
}


function plainswalker(card) {
  return card.type_line.startsWith("Legendary Planeswalker") ||
         card.type_line.startsWith("Planeswalker");
}

function notPlaneswalker(card) {
  return !plainswalker(card);
}


function planeswalkerUncommon(card) {
  return (plainswalker(card) && filters.uncommon(card));
}



