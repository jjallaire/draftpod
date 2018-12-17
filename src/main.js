

import Vue from 'vue'
Vue.config.productionTip = false

import '@/components/core/bootstrap.js'

import * as Sentry from '@sentry/browser';

import firebase from 'firebase/app'
import 'firebase/auth'

import uuidv4 from 'uuid'
import router from './router'
import { store } from './store'
import { SET_PLAYER_INFO } from './store/mutations'

// configure sentry in production mode
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

// attempt to login to firebase
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
  store.commit(SET_PLAYER_INFO, { id: player_id } );

  // start the app
  new Vue({
    router,
    store,
    render: (h) => h('router-view')
  }).$mount('#app');  

}

// TODO: handle started draft that we haven't joined (too late)

// TODO: handle full table of drafters

// TODO: what happens when the same player id attempts to join / sync to updates
// within the same browser domain (i.e. another window)

// TOOD: general cleanup of JoinPage / router / multiplayer

// TODO: disconnect from firestore after we get into deck building?



// when writing / reading to firestore, "compress" the cards by just including
// the multiverse id. could also be used for local storage?

// error if we attempt to initialize firebase and can't (i.e. when offline)
// generally, what happens to our firebase code when we are offline?

// generally, how do we manifest firebase errors in the UI?

// TODO: take some air out of the select boxes in start UI

// TODO: at larger deck sizes during building it's possible for a color
// to be auto-assigned 0 mana even though there is a card in that color
// (fraction is likely too small)

// TODO: add 404 handler

// TODO: favicon

// TODO: remove mana and set symbols?

// TODO: import Decked Builder YAML (.coll2)

// TODO: sideboard:
//    - automatic ordering?
//    - drop targets to deck not big enough
//    - trash/hide/second pile (pile which won't be in decklist) 

// TODO: purging drafts w/ no start_time: null could cause a new pageload
// of the navigator page load to purge a draft from underneath another
// instance of the navigator page. maybe we don't write the draft 
// locally until the draft page loads?

// TODO: sane tablet experience

// TODO: links:
//   Ben Stark "Drafting the Hard Way"
//   Reid Duke: "Draft Signals"
