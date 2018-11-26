import Vue from 'vue'

import '@/components/core/bootstrap.js'

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

// TODO: investigate multi-page: 
//    https://cli.vuejs.org/config/#pages
//    https://cli.vuejs.org/guide/html-and-static-assets.html#building-a-multi-page-app
//    https://github.com/jantimon/html-webpack-plugin

// TODO: remove suppport for set icons and mana type icons

// TODO: add qualifier: http://company.wizards.com/fancontentpolicy

// TODO: add support for sentry: https://sentry.io/for/vue/

// TODO: flip cards

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
