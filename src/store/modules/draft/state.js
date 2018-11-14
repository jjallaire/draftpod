

export default function() {
  return {

    // start time
    start_time: new Date().getTime(), 

    // options
    options: {
      set_code: null,
      set_name: null,
      pick_timer: false,
      pick_analysis: false,
    },

    // table
    table: {
      all_packs: [],
      current_pack: 0,
      current_pick: 0,
      picks_complete: false,
      picks: playerPicks(),
      deck: playerDeck(),
      players: [...Array(7)].map(function() {
        return {
          picks: playerPicks(),
          deck: playerDeck(),
        }
      }),
    },
  }
}

function playerPicks() {
  return {
    pack: [],
    piles: [...Array(8)].map(() => Array()),
  }
}

function playerDeck() {
  return {
    piles: [...Array(8)].map(() => Array()),
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