
import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


const store = new Vuex.Store({
  state: {
    cardpool: {
      set: '',
      cards: []
    },
    current_pack: 0,
    current_pick: 0,
    players: [...Array(8)].map(function() {
      return {
        pack: [],
        piles: [...Array(8)].map(() => Array()),
        card_preview: null
      }
    }),
    complete: false
  },
  getters: {
    cardpool: (state) => state.cardpool,
    started: (state) => state.current_pack > 0,
    current_pack: (state) => state.current_pack,
    current_pick: (state) => state.current_pick,
    pack: (state) => (player) => state.players[player].pack,
    piles: (state) => (player) => state.players[player].piles,
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


