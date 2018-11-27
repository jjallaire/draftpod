import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'



// TODO: initial draft ai (use for card preview)
//
//   https://www.mtgranks.com/
//   https://www.mtgcommunityreview.com/
//   http://www.draftaholicsanonymous.com/p1p1-guilds-of-ravnica/
//   https://docs.google.com/spreadsheets/d/1umtr9q6gg_5BGAWB0n-468RP5h4gcaFg98tW52GXrFE/edit#gid=2059761505
//
//   https://mtgjson.com/v4/docs.html
//   https://docs.magicthegathering.io/
//
//   http://www.deckedbuilder.com/ (easy entry and exports w/ multiverse-id)
//   https://deckbox.org/ (imports from deckedbuilder)
//

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


