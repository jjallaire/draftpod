
import Vue from 'vue'
import Vuex from 'vuex'

import LocalForage from 'localforage'
import 'localforage-getitems'
import 'localforage-setitems'

import _merge from 'lodash/merge'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import draftModule from './modules/draft'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

// Configure localforage
LocalForage.config({
  driver      : [LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE],
  name        : 'Draftpod',
  version     : 1.0,
  storeName   : 'draftpod-beta1'
});


export var store = null;

export function initializeStore() {

  // initial (default) state
  const initialState = {
    player: {
      id: null,
      name: null
    },
    preferences: {
      set_code: 'grn',
      pick_timer: false,
      pick_ratings: false,
      sets: {}
    },
    cardpools: {
      
    }
  };

  // plugin to persist state to LocalForage
  const persistPlugin = store => {
    store.subscribe((mutations, state) => {
      LocalForage.setItems(state);
    })
  };
  
  // read from LocalForage then return store
  return new Promise((resolve) => {
    return LocalForage.getItems().then(savedState => {
      const mergedStates = _merge({}, initialState, savedState);
      store = new Vuex.Store({
        plugins: [persistPlugin],
        state: mergedStates,
        getters,
        mutations,
        actions,
        strict: debug,
      });

      // register drafts module
      useDraftsModule();

      resolve(store);
    });
  });
}

function useDraftsModule() {
  if (!store._modules.root._children["drafts"]) {
    let preserveState = store.state.drafts !== undefined;
    store.registerModule(
      "drafts", 
      { 
        namespaced: true, 
        state: {} 
      }, 
      { 
        preserveState: preserveState 
      });
  }
}

export function useDraftModule(draft_id, options) {

  // register draft sub-module on demand
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
  module.hot.accept(['./getters', './mutations', './actions'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newGetters = require('./getters').default
    const newMutations = require('./mutations').default
    const newActions = require('./actions').default
    // swap in the new actions and mutations
    store.hotUpdate({
      getters: newGetters,
      mutations: newMutations,
      actions: newActions,
    });
  })
}




