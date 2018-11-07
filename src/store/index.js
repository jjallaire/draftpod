
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import * as utils from './utils'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'mtgdrafter-store',
  storage: window.localStorage
});


const store = new Vuex.Store({
  state: utils.initialState,
  plugins: [vuexPersist.plugin],
  getters,
  actions,
  mutations,
  strict: debug,
});

export default store;

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


