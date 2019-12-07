

import * as cube from './cube'
import { CARDPOOL } from '../../../constants'

import _orderBy from 'lodash/orderBy'


export default {

  name: "Vintage (2019)",

  capabilities: {
    arena_decklists: false,
  },

  pack_cards: () => 15,

  cube: cube.build,

  default_cube: CARDPOOL.CUBE + '1/1/1/1',

  is_custom_cube: true,

  booster(selectCards) {
    const cards = selectCards(() => true, 15);
    return _orderBy(cards, ["collector_number"], ["asc"]); 
  },

}



