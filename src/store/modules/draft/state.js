
import { PICKS, DECK } from './constants'
import * as draftbot from './draftbot'


export default function() {
  return {

    // id
    id: null,

    // format (draft or sealed)
    format: 'draft',

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
      multi_player: false,
      show_bot_colors: false,
      number_of_packs: 3,
      sealed_number_of_packs: 6,
      deck_size: 40,
      deck_list_format: 'normal'
    },

    // packs for this draft
    packs: null,

    // are we connected to the backend? (i.e. should we be
    // peforming auto-picks)
    connected: true,

    // are we currently waiting for a back-end transaction
    waiting: null,

    // table
    table: {
      start_time: null,
      all_packs: [],
      current_pack: 0,
      picks_complete: false,
      players: [...Array(8)].map(function() {
        return {
          id: null,
          name: null,
          bot: draftbot.create(),
          packs: [],
          pick_end_time: null,
          picks: playerPicks(),
          deck: playerDeck(),
          saved_decks: {
            active: null,
            decks: {}
          },
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
    pick_order: [],

    // colors (computed after all picks are complete)
    colors: []
  }
}

export function playerDeck() {
  return {
    // piles for cards + 1 pile each for lands/sideboard/unused
    options: {
      compact_arrange_by_cost: false
    },
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