import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import store from './store'

// TODO: color_order should be stored with the deck in DeckLands 
// (currently doesn't survive reload)

// TODO: drag feedback and insert loc on sideboard

// TODO: flicker when pack is loading

// TODO: cleanup Pile (code too intermingled)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
