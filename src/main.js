import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'


// TODO: ability to specify/upload custom cardpools
//   http://www.deckedbuilder.com/ (easy entry and exports w/ multiverse-id)
//   https://deckbox.org/ (imports from deckedbuilder)


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

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');


