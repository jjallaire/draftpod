import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'


// penalty for multi-color in early picks

// divide draft ai logic into buckets

// draft ai tier applying bonus to matters (i.e. sideboard before unplayable)

// test color distribution of bots

// setup units test for draft ai testing

// auto-lands are messed up in this deck: https://draftpod-c0eac.firebaseapp.com/draft/#a079f657-d399-4558-b119-8d017377be06

// smarter arrangement of sideboard (use main colors)

// some cards seem to show up a lot! (test distribution)

// use an actual cube and draw cards out of the cube:
//  https://www.channelfireball.com/articles/cube-design-set-cubes/
//    300 commons (3 of each)
//    120 uncommons (2 of each)
//    53 rares and 15 mythics (1 of each)

// sideboard to deck drop target isn't big enough

// TODO: initial draft ai (use for card preview)
//
//   consider adding a synergy field for archtypes
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


