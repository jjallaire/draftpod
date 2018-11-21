import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import { store } from './store'


// TODO: take another shot at scoped css

// TODO: look at alignment, sizes in draft resume panel

// TODO: evaluate static content options (prerender w/ # and v-show?)

// TODO: initial draft ai (use for card preview)

// TODO: add support for sentry: https://sentry.io/for/vue/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
