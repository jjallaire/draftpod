
import Vue from 'vue'
import Vuex from 'vuex'

import LocalForage from 'localforage'
import MobileDetect from 'mobile-detect'

import _merge from 'lodash/merge'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import draftModule from './modules/draft'

import * as serializer from './modules/draft/serializer'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)


// LocalForage driver (force localStorage on iOS due to buggy indexeddb)
let md = new MobileDetect(window.navigator.userAgent);
let driver = md.os() === "iOS" ? 
  [LocalForage.LOCALSTORAGE] : 
  [LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE];

// Initialize LocalForage
LocalForage.config({
  driver      : driver,
  name        : 'Draftpod',
  version     : 1.0,
  storeName   : 'draftpod-beta12'
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
      set_code: 'rna',
      pick_timer: false,
      pick_ratings: false,
      sets: {}
    },
    cardpools: {
      
    },
    firebase_error: null
  };

  // plugin to persist state to LocalForage
  const persistPlugin = store => {

    store.subscribe((mutations, state) => {

      // save cards using ids rather than full data
      let drafts = {};
      let serializers = Object.keys(state.drafts).map(draft_id => {
        let draft = state.drafts[draft_id];
        return serializer.serializeDraftTable(draft.table, false).then(table => {
          drafts[draft_id] = {
            ...draft, 
            table: table
          }
        });
      });

      // write state
      Promise.all(serializers).then(() => {
        LocalForage.setItem(
          "state",
          {
            ...state,
            drafts
          }
        );
      });
    })
  };
  
  // read from LocalForage then return store
  return LocalForage.getItem("state")
    .then(savedState => {

      // default empty saved state
      savedState = savedState || {};

      // unroll card ids into cards
      let drafts = {};
      let unserializers = [];
      if (savedState.drafts) {
        unserializers = Object.keys(savedState.drafts).map(draft_id => {
          let draft = savedState.drafts[draft_id];
          return serializer.unserializeDraftTable(draft, false).then(table => {
              drafts[draft.id] = {
                ...draft,
                table: table
              };
          });
        });
      }

      // read into state
      return Promise.all(unserializers).then(() => {
        savedState = {
          ...savedState,
          drafts
        };

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

        return store;
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




