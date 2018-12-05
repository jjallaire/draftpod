import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'


// TODO: ability to specify/upload custom cardpools
//   http://www.deckedbuilder.com/ (easy entry and exports w/ multiverse-id)
//   https://deckbox.org/ (imports from deckedbuilder)

// ratings needs to be a drop target for picks

// no colors for guildates!

// confirm that locket and gates have gotten their rating upgraded

// consider showing pick analysis (even for debugging)

// sideboard to deck drop target isn't big enough
// smarter arrangement of sideboard (use main colors)

// bug with holding drag target over picks during switchover (causes double add as we get
// the auto-pick as well as the dragged pick)

// configure sentry in production mode
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');


