import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'


// UI for specifying cube quantities



// docs: http://www.metamox.com/blog/9-things-you-need-to-know-about-how-to-make-a-set-cube/
// (help w/ how to acquire a cube)

// filter out card images from deploy then always download images
// implement local images elsewhere

// ranking of older sets: http://draft.bestiaire.org/

// penalty for multi-color in early picks
// divide draft ai logic into buckets
// draft ai tier applying bonus to matters (i.e. sideboard before unplayable)
// test color distribution of bots

// smarter arrangement of sideboard (use main colors)

// some cards seem to show up a lot! (test distribution)

// 1M 1R 2U 4C tends to be a common distribution, though you might also 
// see 1M 2R 3U 4C, or any number of other weird distributions so you have 
// a bit more variance in what cards you might get each draft

// use an actual cube and draw cards out of the cube:
//  https://www.channelfireball.com/articles/cube-design-set-cubes/
//    300 commons (3 of each)
//    120 uncommons (2 of each)
//    53 rares and 15 mythics (1 of each), we expect to open 7 mythics over 60 packs (occur 1/7 times)
// To make it more realistic:
//    600 commons (6 of each)
//    240 uncommons (4 of each)
//    106 rares and 30 mythics (2 of each)



//  4x Commons, 3x Uncommons, 2x Rares, 1x Mythics.

// 12x Commons
//  6x Uncommons
//  2x Rares
//  1x Mythics

// The actual ratio for a retail set is actually about 6/3/1 if you do them 
// regular cube style (just shuffle up one big pile) and requires about 900 cards.

// Keep in mind that by increasing the number of the cards in the cube 
// (e.g., 2x of each rare, 3-4 of each uncommon, 5-6 of each common),
// you increase the variance of the cube.

// Most people run 4 commons, 2 uncommons, and then 1 of each rare and mythic. 
// Sure, you can run 4/4/2/2, but commons are usually the limiting factor on 
// how many people your cube can support.

// 1 out of 8 have a mythic

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


