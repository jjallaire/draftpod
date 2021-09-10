

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Innistrad: Midnight Hunt",

  pack_cards: () => 15,

  cube: cube.build,

  booster(selectCards) {

    // start with rare slot
    let cards = selectCards(booster.packRareSlot, 1);

    // make sure there is at least 1 double faced rare or uncommon
    if (!doubleFaced(cards[0])) {
      cards.push(...selectCards(doubleFacedUncommon, 1));
    } 

    // fill out uncommons
    cards.push(...selectCards(singleFacedUncommon, 4 - cards.length));
    
    // commons (1 double faced)
    cards.push(...selectCards(doubleFacedCommon, 1));
    cards.push(...selectCards(singleFacedCommon, 9));

    // basic land
    cards.push(...selectCards(filters.basicLand, 1));

    return cards;
  },

  // plus full art basic lands
}



function doubleFaced(card) {
  return card.multiverse_ids.length === 2;
}

function doubleFacedUncommon(card) {
  return (doubleFaced(card) && filters.uncommon(card));
}

function singleFacedUncommon(card) {
  return (!doubleFaced(card) && filters.uncommon(card));
}

function doubleFacedCommon(card) {
  return (doubleFaced(card) && filters.common(card));
}

function singleFacedCommon(card) {
  return (!doubleFaced(card) && filters.common(card) && !filters.basicLand(card));
}





