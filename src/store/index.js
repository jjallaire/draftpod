
import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import * as set from './set/'
import * as utils from './utils'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


const store = new Vuex.Store({
  state: {
    set_code: null,
    cardpool: [],
    all_packs: [],
    current_pack: 0,
    current_pick: 0,
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
    }),
  },
  getters: {
    set_code: (state) => state.set_code,
    set_name: (state) => set.name(state.set_code),
    cardpool: (state) => state.cardpool,
    started: (state) => state.current_pack > 0,
    current_pack: (state) => state.current_pack,
    current_pick: (state) => state.current_pick,
    picks_complete: (state) => state.picks_complete,
    show_pick_analysis: (state) => state.show_pick_analysis,
    draft: (state) => (player) => state.players[player].draft,
    deck: (state) => (player) => state.players[player].deck,
    deck_lands: (state) => (player) => {
      let deck = state.players[player].deck;
      let basic_lands = deck.basic_lands;
      return deck.piles[6].length + utils.sumValues(basic_lands);
    },
    card_preview: (state) => (player) => state.players[player].card_preview,
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


