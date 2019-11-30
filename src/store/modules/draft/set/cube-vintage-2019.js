

import * as cube from './cube'
import { CARDPOOL } from '../../../constants'



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
    return selectCards(() => true, 15);
  },

}



