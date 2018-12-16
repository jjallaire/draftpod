

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

// instead of "Waiting for Pack" at end of pack/draft maybe "Waiting for other players to pick"
// appearance of hourglass in ux

// ensure trailing slash on /draft URL (othwerise join link is bad!)

// move immediately to deck building even if other players haven't finished picking

// TOOD: general cleanup of JoinPage / router / multiplayer

// TODO: disconnect from firestore after we get into deck building

// TODO: get stuck waiting for a pack at startup????



// TODO: we removed the side-effect of draft purging in SET_PLAYER_INFO. Here is the code
// (we need to bring it back somewhere else)
/*
    // remove drafts that don't have this player id
    let drafts = Object.keys(state.drafts);
    let stranded_drafts = drafts.filter((id) => {
      let draft = state.drafts[id];
      return selectors.activePlayer(state.player.id, draft.table) === undefined;
    });
    removeDrafts(state, stranded_drafts);
*/

// TODO: validate that we have a name before joining the draftix

// TODO: if we show up at a draft and we are already in it (and it's started)
// then just navigate to it

// TODO: handle removal of a pending multiplayer draft

// TODO: can we get some improved code re-use around firestore subscribe (we always write the table)

// TODO: handle started draft that we haven't joined (too late)

// TODO: handle full table of drafters

// TODO: warn when starting a draft with no other players joined

// TODO: what happens when the same player id attempts to join / sync to updates
// within the same browser domain (i.e. another window)

// when writing / reading to firestore, "compress" the cards by just including
// the multiverse id

// error if we attempt to initialize firebase and can't (i.e. when offline)
// generally, what happens to our firebase code when we are offline?

// generally, how do we manifest firebase errors in the UI?

// TODO: don't allow resetting pick timer in multi-user drafts?

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

// TODO: purging drafts w/ start_time: null could cause a new pageload
// of the navigator page load to purge a draft from underneath another
// instance of the navigator page. maybe we don't write the draft 
// locally until the draft page loads?

// TODO: sane tablet experience


