

import * as filters from '../card-filters'
import * as ai from './draft-ai'
import * as cube from './draft-cube'

export default {

  name: "Core Set 2019",

  cube: function(cardsInSet, multiples) {

    // generate default cube
    let cards = cube.build(cardsInSet, multiples);

    // generate additional basic lands (for filling in slots 
    // occupied by dual lands in 5/12 packs)
    return cards.concat(
      cube.select(cardsInSet, filters.basicLand, multiples.common * 2)
    );
    
  },

  booster(cards) {

    let booster = [].concat(
      cards(filters.packRareSlot, 1),
      cards(filters.uncommon, 3),
      cards(filters.join(filters.common, card => !dualLand(card)), 10)
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


