

import Vue from 'vue'
Vue.config.productionTip = false

import '@/components/core/bootstrap.js'

import * as Sentry from '@sentry/browser';
import * as log from './log'

import firebase from 'firebase/app'
import 'firebase/auth'

import shortUuid from 'short-uuid'

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
  .catch((error) => {
    log.logException(error, "onAnonymousSignIn");
    initApp();
  });

function initApp(firebase_uid) {

  // attempt to use the firebase uid, fallback to whatever user_id
  // we might have already stored, then finally to a new randomly generated id
  let player_id = firebase_uid || store.getters.player.id || shortUuid().new();

  // write the player id
  store.commit(SET_PLAYER_INFO, { id: player_id } );

  // start the app
  new Vue({
    router,
    store,
    render: (h) => h('router-view')
  }).$mount('#app');  

}
