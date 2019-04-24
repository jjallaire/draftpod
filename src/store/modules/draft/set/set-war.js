

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "War of the Spark",

  pack_cards: () => 15,

  capabilities: {
    custom_cardpool: false
  },

  cube: cube.build,

  booster(selectCards) {

    // allocate rares
    let rares = [].concat(selectCards(booster.packRareSlot, 1));

    // add uncommon plainswalker if we don't have a rare one
    let uncommons = [];
    if (rares.filter(planeswalker).length === 0) {
      uncommons.push(selectCards(planeswalkerUncommon, 1)[0]);
    }

    // fill in uncommons
    uncommons = uncommons.concat(
      selectCards([uncommonNotPlainswalker].concat(booster.uncommon), 3 - uncommons.length)
    );  
  
    return [].concat(
      rares,
      uncommons,
      selectCards(booster.common, 11)
    );
  },
}


function planeswalker(card) {
  return card.type_line.startsWith("Legendary Planeswalker") ||
         card.type_line.startsWith("Planeswalker");
}

function notPlaneswalker(card) {
  return !planeswalker(card);
}


function planeswalkerUncommon(card) {
  return planeswalker(card) && filters.uncommon(card);
}

function uncommonNotPlainswalker(card) {
  return filters.uncommon(card) && notPlaneswalker(card);
}


