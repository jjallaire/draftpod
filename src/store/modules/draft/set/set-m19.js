

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Core Set 2019",

  cube: cube.build,

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotDualLand, 10)
    );

    if (Math.random() <= (5/12)) {
      return cards.concat(selectCards(dualLand, 1));
    } else {
      return cards.concat(selectCards(filters.basicLand, 1));
    }
  },

}

function dualLand(card) {
  const DUAL_LANDS =  ['Cinder Barrens', 'Forsaken Sanctuary', 'Foul Orchard', 
                       'Highland Lake', 'Meandering River', 'Stone Quarry', 
                       'Submerged Boneyard', 'Timber Gorge', 'Tranquil Expanse', 
                       'Woodland Stream'];
  return DUAL_LANDS.indexOf(card.name) >= 0;
}

const commonNotDualLand = filters.join(filters.common, card => !dualLand(card));




