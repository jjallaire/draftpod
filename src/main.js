

import Vue from 'vue'
Vue.config.productionTip = false

import '@/components/core/browser-update.js'
import '@/components/core/bootstrap.js'
import '@/components/core/styles.css'

import * as Sentry from '@sentry/browser';
import VueAnalytics from 'vue-analytics'
import * as log from './core/log'

import shortUuid from 'short-uuid'

import router from './core/router'
import { initializeStore } from './store'
import { SET_PLAYER_INFO } from './store/mutations'

import config from './config'

// check for production mode
let production = process.env.NODE_ENV === 'production';

console.log(process.env.NODE_ENV);

// configure google analytics
Vue.use(VueAnalytics, {
  id: config.ga.id,
  router: router,
  debug: {
    sendHitTask: production
  }
});

// configure sentry in production mode
if (production) {
  Sentry.init({
    dsn: config.sentry.dsn,
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
  if (process.env.VUE_APP_BRANCH) {
    Sentry.configureScope((scope) => {
      scope.setTag("branch", process.env.VUE_APP_BRANCH);
    });
  }
}

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

  
