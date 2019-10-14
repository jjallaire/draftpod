

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Core Set 2019",

  pack_cards: () => 15,

  cube: cube.build,

  cardpool_basics: [447398,447402,447406,447410,447414],

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotDualLand, 10)
    );

    if (Math.random() <= (5/12)) {
      // fallback to basic if there aren't enough dual lands
      const dualLand = [m19DualLand, filters.basicLand];
      return cards.concat(selectCards(dualLand, 1));
    } else {
      return cards.concat(selectCards(filters.basicLand, 1));
    }
  },

}

export function m19DualLand(card) {
  const DUAL_LANDS =  ['Cinder Barrens', 'Forsaken Sanctuary', 'Foul Orchard', 
                       'Highland Lake', 'Meandering River', 'Stone Quarry', 
                       'Submerged Boneyard', 'Timber Gorge', 'Tranquil Expanse', 
                       'Woodland Stream'];
  return DUAL_LANDS.indexOf(card.name) >= 0;
}

const commonNotDualLand = filters.join(filters.common, card => !m19DualLand(card));




