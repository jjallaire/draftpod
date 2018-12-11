
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import draftModule from './modules/draft'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

// firestore
import firebase from 'firebase/app'
import 'firebase/firestore'

// initialize firebase
firebase.initializeApp({
  apiKey: "AIzaSyABxin54k8yFGsJa5YRofmvLOntb7shpAk",
  authDomain: "draftpod-5da26.firebaseapp.com",
  projectId: "draftpod-5da26",
  storageBucket: "draftpod-5da26.appspot.com",
  messagingSenderId: "979913671141"
});
let db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});


const vuexPersist = new VuexPersist({
  key: 'draftpod-ABC1231231234567891112223334445556667777',
  storage: window.localStorage
});

export const store = new Vuex.Store({
  state: {
    player: {
      id: null
    },
    preferences: {
      set_code: 'grn',
      pick_timer: true,
      pick_ratings: false,
      sets: {}
    },
    cardpools: {
      
    }
  },
  modules: {
    drafts: { namespaced: true }
  },
  getters,
  mutations,
  actions,
  plugins: [vuexPersist.plugin],
  strict: debug,
  db
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




