
import { PICKS, DECK } from './constants'


// - ui needs to gracefully handle no packs (waiting....)

// - how to implement pick timer? (perhaps the host forces picks?). or perhaps
//    there is a scheduled server-side function? maybe all clients can 
//    be responsible for noticing the pick_timer and forcing the picks
//    via a call to a firebase function
// 

// - sync the table to firestore

// - when writing / reading to firestore, "compress" the cards by just including
//   the multiverse id

export default function() {
  return {

    // start time
    start_time: new Date().getTime(), 

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
    },

    // table
    table: {
      all_packs: [],
      current_pack: 0,
      picks_complete: false,
      players: [...Array(8)].map(function() {
        return {
          id: null,
          picks: playerPicks(),
          deck: playerDeck(),
        }
      }),
    },
  }
}

function playerPicks() {
  return {
    packs: [],
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