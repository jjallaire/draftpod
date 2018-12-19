
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
          name: null,
          next_key: 0,
          picks: playerPicks(),
          deck: playerDeck(),
        }
      }),
    },
  }
}

function playerPicks() {
  return {
    // packs that have been passed to me waiting for picks (FIFO)
    packs: [],

    // when does this pack end
    pick_end_time: null,

    // piles for cards + 1 pile for sideboard
    piles: [...Array(PICKS.PILES+1)].map(() => Array()),
  }
}

function playerDeck() {
  return {
    // piles for cards + 1 pile each for lands/sideboard
    piles: [...Array(DECK.PILES+2)].map(() => Array()),
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