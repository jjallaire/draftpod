

export default function() {
  return {

    // cards
    cards: {
      set_code: null,
      set_name: null,
      all_packs: [],
    },

    // options
    options: {
      pick_timer: false,
      pick_analysis: false,
    },

    // status
    status: {
      current_pack: 0,
      current_pick: 0,
      pick_end_time: new Date().getTime(),
      picks_complete: false,
    },

    // players
    player_id: 0,
    players: [...Array(8)].map(function() {
      return {
        draft: {
          pack: [],
          piles: [...Array(8)].map(() => Array()),
        },
        deck: {
          piles: [...Array(8)].map(() => Array()),
          basic_lands: {
            R: 0,
            W: 0,
            U: 0,
            B: 0,
            G: 0
          },
          auto_lands: true
        },
      }
    })
  }
}