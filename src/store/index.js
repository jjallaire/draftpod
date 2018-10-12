
import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


const store = new Vuex.Store({
  state: {
    booster: [],
    deck: {
      piles: [...Array(7)].map(() => Array()),
      sideboard: []
    }
  },
  getters: {
    booster: (state) => state.booster,
    piles: (state) => state.deck.piles,
    pile: (state) => (index) => state.deck.piles[index],
    sideboard: (state) => state.deck.sideboard,
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


