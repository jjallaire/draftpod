
import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


const store = new Vuex.Store({
  state: {
    set_code: null,
    cardpool: [],
    current_pack: 0,
    current_pick: 0,
    pick_analysis: false,
    players: [...Array(8)].map(function() {
      return {
        pack: [],
        pick_piles: [...Array(8)].map(() => Array()),
        deck: {
          creature_piles: [...Array(6)].map(() => Array()),
          other_piles: [...Array(6)].map(() => Array()),
          lands: Array(),
          sideboard: Array()
        },
        card_preview: null
      }
    }),
    complete: false
  },
  getters: {
    set_code: (state) => state.set_code,
    cardpool: (state) => state.cardpool,
    started: (state) => state.current_pack > 0,
    current_pack: (state) => state.current_pack,
    current_pick: (state) => state.current_pick,
    pick_analysis: (state) => state.pick_analysis,
    pack: (state) => (player) => state.players[player].pack,
    pick_piles: (state) => (player) => state.players[player].pick_piles,
    deck: (state) => (player) => state.players[player].deck,
    card_preview: (state) => (player) => state.players[player].card_preview,
    complete: (state) => state.complete,
  },
  actions,
  mutations,
  strict: debug,
});

export default store;

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./mutations', './actions'], () => {
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


