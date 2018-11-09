
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import draft from './modules/draft'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'mtgdrafter-E4BDCBCEFFFBTTT',
  storage: window.localStorage
});

const store = new Vuex.Store({
  modules: {
    draft: draft
  },
  plugins: [vuexPersist.plugin],
  strict: debug,
});

export default store;

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./modules/draft/mutations', './modules/draft/actions'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newMutations = require('./modules/draft/mutations').default
    const newActions = require('./modules/draft/actions').default
    // swap in the new actions and mutations
    store.hotUpdate({
      mutations: newMutations,
      actions: newActions
    });
  })
}




