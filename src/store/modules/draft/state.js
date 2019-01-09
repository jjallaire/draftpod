
import shortUuid from 'short-uuid'

import { PICKS, DECK } from './constants'

export default function() {
  return {

    // id
    id: null,

    // set 
    set: {
      code: null,
      name: null,
      pack_cards: null
    },

    // options
    options: {
      pick_timer: false,
      pick_ratings: false,
      multi_player: false
    },

    // packs for this draft
    packs: null,

    // are we connected to the backend? (i.e. should we be
    // peforming auto-picks)
    connected: true,

    // table
    table: {
      start_time: null,
      update_version: shortUuid().new(),
      all_packs: [],
      current_pack: 0,
      picks_complete: false,
      players: [...Array(8)].map(function() {
        return {
          id: null,
          client_id: null,
          name: null,
          packs: [],
          pick_end_time: null,
          picks: playerPicks(),
          deck: playerDeck(),
        }
      }),
    },
  }
}

function playerPicks() {
  return {
    // piles for cards + 1 pile for sideboard
    piles: [...Array(PICKS.PILES+1)].map(() => Array()),

    // pick order
    pick_order: []
  }
}

function playerDeck() {
  return {
    // piles for cards + 1 pile each for lands/sideboard/unused
    piles: [...Array(DECK.PILES+3)].map(() => Array()),
    lands: {
      basic: {
        R: 0,
        W: 0,
        U: 0,
        B: 0,
        G: 0
      },
      auto: true,
      color_order: null
    }
  }
}