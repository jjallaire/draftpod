
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import getters from './getters'
import mutations from './mutations'

import draftModule from './modules/draft'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'mtgdrafter-YYYYZZZZAAABBCCCCDDDEEEE',
  storage: window.localStorage
});


const store = new Vuex.Store({
  modules: {
    preferences: {
      state: {
        set_code: 'grn',
        pick_timer: true,
        pick_analysis: true
      }
    },
    drafts: { namespaced: true }
  },
  getters,
  mutations,
  plugins: [vuexPersist.plugin],
  strict: debug,
});

export default store;

export function useDraftModule(draft_id, options) {
  if (!store._modules.root._children["drafts"]._children[draft_id]) {
    store.registerModule(
      ["drafts", draft_id], 
      draftModule, 
      { namespaced: true, ...options }
     );
 }
}


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




