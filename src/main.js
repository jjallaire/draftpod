import Vue from 'vue'

import '@/components/core/bootstrap.js'

import * as Sentry from '@sentry/browser';

import firebase from 'firebase/app'
import 'firebase/auth'

import uuidv4 from 'uuid'

import router from './router'
import { store } from './store'
import { SET_PLAYER_ID } from './store/mutations'


// TODO: firebase:

//   - https://www.smashingmagazine.com/2018/04/vuejs-firebase-firestore/
//    (describes how to setup security)

//    Use onSnapshot to detect writes by other users

//   - https://vuejsdevelopers.com/2017/10/16/vue-js-firestore/



//   - https://medium.com/js-dojo/build-a-realtime-chat-app-with-vuejs-vuex-and-firestore-32d081668709
//   - https://medium.com/@amenallah.hsoumi/building-a-progressive-quiz-app-with-vue-vuex-and-firestore-part-1-ce73c7ba695d

// a library (but we should probably learn the low-level basics first):
//    - https://mesqueeb.github.io/vuex-easy-firestore/
// another library:
//    - https://github.com/fiery-data/fiery-vuex


// TODO: draft_history purging should get entries that don't match the 
// current player_id (otherwise they could accumulate forever)

// TODO: at larger deck sizes during building it's possible for a color
// to be auto-assigned 0 mana even though there is a card in that color
// (fraction is likely too small)

// TODO: favicon

// TODO: remove mana and set symbols?

// TODO: import Decked Builder YAML (.coll2)

// TODO: sideboard:
//    - automatic ordering?
//    - drop targets to deck not big enough
//    - trash/hide/second pile (pile which won't be in decklist) 


// configure sentry in production mode
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

Vue.config.productionTip = false

// initialize firebase
firebase.initializeApp({
  apiKey: "AIzaSyABxin54k8yFGsJa5YRofmvLOntb7shpAk",
  authDomain: "draftpod-5da26.firebaseapp.com",
  databaseURL: "https://draftpod-5da26.firebaseio.com",
  projectId: "draftpod-5da26",
  storageBucket: "draftpod-5da26.appspot.com",
  messagingSenderId: "979913671141"
});

firebase.auth().signInAnonymously()
  .then(response => {
    initApp(response.user.uid);
  })
  .catch(() => {
    initApp();
  });


function initApp(firebase_uid) {

  // attempt to use the firebase uid, fallback to whatever user_id
  // we might have already stored, then finally to a new randomly generated id
  let player_id = firebase_uid || store.getters.player.id || uuidv4();

  // write the player id
  store.commit(SET_PLAYER_ID, player_id);

  // start the app
  new Vue({
    router,
    store,
    render: (h) => h('router-view')
  }).$mount('#app');  

}

