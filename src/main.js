

import Vue from 'vue'
Vue.config.productionTip = false

import '@/components/core/browser-update.js'
import '@/components/core/bootstrap.js'
import '@/components/core/styles.css'

import * as Sentry from '@sentry/browser';
import VueAnalytics from 'vue-analytics'
import * as log from './core/log'
import progress from './core/progress'

import firebase from 'firebase/app'
import 'firebase/auth'

import shortUuid from 'short-uuid'

import router from './core/router'
import { initializeStore } from './store'
import { SET_PLAYER_INFO } from './store/mutations'

// check for production mode
let production = process.env.NODE_ENV === 'production';

// configure google analytics
Vue.use(VueAnalytics, {
  id: 'UA-20375833-22',
  router: router,
  debug: {
    sendHitTask: production
  }
});

// configure sentry in production mode
if (production) {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

// login to firebase
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    initApp();
  } else {
    progress.start();
    firebase.auth().signInAnonymously()
      .then(() => {
        initApp();
      })
      .catch(error => {
        log.logException(error, "onAnonymousSignIn");
        initApp();
      })
      .finally(() => {
        progress.stop();
      });
  }
});

function initApp() {

  // initialize the store then the app
  initializeStore()
    .then(store => {
      
      // determine player_id
      let player_id = store.getters.player.id || shortUuid().new();

      // write the player id
      store.commit(SET_PLAYER_INFO, { id: player_id } );

      // start the app
      new Vue({
        router,
        store,
        render: (h) => h('router-view')
      }).$mount('#app');  
    })
  .catch(error => {
    log.logException(error, "onInitializeStore");
  });

  
}
