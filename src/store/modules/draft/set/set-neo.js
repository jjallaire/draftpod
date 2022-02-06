

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

import { 
  // doubleFaced, 
  doubleFacedUncommon, 
  singleFacedUncommon, 
  doubleFacedCommon, 
  singleFacedCommon 
} from './set-vow';

import {
  m21DualLand
} from './set-m21';

export default {

  name: "Kamigawa: Neon Dynasty",

  pack_cards: () => 15,

  cube: cube.build,

  booster(selectCards) {

    // start with rare slot
    let cards = selectCards(booster.packRareSlot, 1);

    // select single faced cards
    cards.push(...selectCards(singleFacedUncommon, 3));
    cards.push(...selectCards(singleFacedCommonNotDualLand, 9));

    // double faced common or uncommon
    cards.push(...selectCards(card => doubleFacedCommon(card) || doubleFacedUncommon(card),1));

    // half of packs will have dual lands
    // (see https://twitter.com/wizards_magic/status/1488914393677144080)
    if (Math.random() <= (6/12)) {
      // fallback to basic if there aren't enough dual lands
      const dualLand = [m21DualLand, filters.basicLand];
      return cards.concat(selectCards(dualLand, 1));
    } else {
      return cards.concat(selectCards(filters.basicLand, 1));
    }
  },
}

const singleFacedCommonNotDualLand = filters.join(singleFacedCommon, 
                                                  card => !m21DualLand(card));


