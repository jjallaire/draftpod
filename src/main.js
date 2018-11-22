import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import { store } from './store'


// TODO: look at alignment, sizes in draft resume panel

// TODO: initial draft ai (use for card preview)

// TODO: register domain and firebase config

// TODO: add support for sentry: https://sentry.io/for/vue/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
