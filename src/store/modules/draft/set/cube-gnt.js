

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

import { m19DualLand } from './set-m19'
 
import { CARDPOOL } from '../../../constants'

export default {

  name: "Game Night Cube",

  pack_cards: 15,

  cube: cube.build,

  default_cube: CARDPOOL.CUBE + '3/2/1/1',

  booster(selectCards) {

    let cards = [].concat(
      selectCards(booster.packRareSlot, 1),
      selectCards(booster.uncommon, 3),
      selectCards(commonNotDualLandOrColorlessCommon, 10)
    );

    if (Math.random() <= 0.5) {
      return cards.concat(selectCards(m19DualLand, 1));
    } else {
      return cards.concat(selectCards(colorlessCommon, 1));
    }
  },

}

function colorlessCommon(card) {
  return card.colors.length === 0 && filters.common(card);
}

const commonNotDualLandOrColorlessCommon = filters.join(
  filters.common, 
  card => !m19DualLand(card), 
  card => !colorlessCommon(card)
);




