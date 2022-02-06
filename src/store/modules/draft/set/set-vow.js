import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Innistrad: Crimson Vow",

  pack_cards: () => 14,

  cube: cube.build,

  set_basics: false,

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

    return cards;
  },

  // plus full art basic lands
}



export function doubleFaced(card) {
  return card.multiverse_ids.length === 2;
}

export function doubleFacedUncommon(card) {
  return (doubleFaced(card) && filters.uncommon(card));
}

export function singleFacedUncommon(card) {
  return (!doubleFaced(card) && filters.uncommon(card));
}

export function doubleFacedCommon(card) {
  return (doubleFaced(card) && filters.common(card));
}

export function singleFacedCommon(card) {
  return (!doubleFaced(card) && filters.common(card) && !filters.basicLand(card));
}





