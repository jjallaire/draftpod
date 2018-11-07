

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const namespaced = true;

const state = function() {
  return {
    set_code: null,
    all_packs: [],
    current_pack: 0,
    current_pick: 0,
    current_time: new Date().getTime(),
    pick_timer: false,
    pick_end_time: new Date().getTime(),
    picks_complete: false,
    show_pick_analysis: false,
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
        card_preview: null
      }
    })
  }
}

export default {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./mutations', './actions', './getters'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newMutations = require('./mutations').default
    const newActions = require('./actions').default
    // swap in the new actions and mutations
    store.hotUpdate({
      mutations: newMutations,
      actions: newActions
    });
  })
}


