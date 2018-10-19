

import * as filters from './card-filters'
import * as ai from './draft-ai'

export default {

  booster(cards) {

    let booster = [].concat(
      cards(filters.rare, 1),
      cards(filters.uncommon, 3),
      cards([filters.common, card => !dualLand(card)], 10)
    );

    if (Math.random() <= (5/12)) {
      return booster.concat(cards(dualLand, 1));
    } else {
      return booster.concat(cards(filters.basicLand, 1));
    }
  },

  pick(deck, pack) {

    return ai.pick(deck, pack);

  }

}

function dualLand(card) {
  const DUAL_LANDS =  ['Cinder Barrens', 'Forsaken Sanctuary', 'Foul Orchard', 
                       'Highland Lake', 'Meandering River', 'Stone Quarry', 
                       'Submerged Boneyard', 'Timber Gorge', 'Tranquil Expanse', 
                       'Woodland Stream'];
  return DUAL_LANDS.indexOf(card.name) >= 0;
}


