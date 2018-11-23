import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import { store } from './store'



// TODO: initial draft ai (use for card preview)

// https://mtgjson.com/v4/docs.html
// https://docs.magicthegathering.io/

// https://mtgcollectionbuilder.com/
// https://www.mtggoldfish.com/

// TODO: add support for sentry: https://sentry.io/for/vue/
// TODO: flip cards

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
