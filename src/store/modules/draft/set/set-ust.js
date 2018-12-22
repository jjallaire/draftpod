

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Unstable",

  pack_cards: 14,

  cube: cube.build,

  booster(selectCards) {

    let cards = [].concat(
      selectCards(contraption, 2),
      selectCards(packRateSlotNotContraption, 1),
      selectCards(uncommonNotContraption, 3),
      selectCards(commonNotContraption, 8)
    );

    return cards;
  },

}

export function contraption(card) {
  return card.type_line.includes("Contraption");
}

const packRateSlotNotContraption = filters.join(filters.packRareSlot, card => !contraption(card));
const uncommonNotContraption = filters.join(filters.uncommon, card => !contraption(card));
const commonNotContraption = filters.join(filters.common, card => !contraption(card));




