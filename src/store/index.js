
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import getters from './getters'
import mutations from './mutations'

import draftModule from './modules/draft'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'draftpod-ABC123',
  storage: window.localStorage
});


export const store = new Vuex.Store({
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
  module.hot.accept(['./getters', './mutations'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newGetters = require('./getters').default
    const newMutations = require('./mutations').default
    // swap in the new actions and mutations
    store.hotUpdate({
      getters: newGetters,
      mutations: newMutations,
    });
  })
}




