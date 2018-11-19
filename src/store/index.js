
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

  module.hot.accept(['./getters', './mutations',
                     './modules/draft/actions', './modules/draft/mutations'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    
    // base modules
    const newGetters = require('./getters').default
    const newMutations = require('./mutations').default

    // dynamically registered modules
    const draftModules = store._modules.root._children["drafts"];                  
    const draftKeys = Object.keys(draftModules);
    let drafts = {};
    for (let key in draftKeys) {
      drafts[key] = {
        ...draftModules[key],
        actions: require('./modules/draft/actions').default,
        muations: require('./modules/draft/mutations').default
      };
    }

    // swap in the new modules
    store.hotUpdate({
      getters: newGetters,
      mutations: newMutations,
      modules: {
        drafts: drafts
      }
    });
  })
}




