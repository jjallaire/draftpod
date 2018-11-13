import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import store from './store'


// TODO: bigger drag target for picks (more depth or maybe entire area & calc pile?)

// TODO: implement separate piles for instants and sorceries in deck

// TOO: color_order should be stored with the deck in DeckLands 
// (currently doesn't survive reload)

// TODO: flicker when pack is loading
// TODO: card preview targets after drag and pass pack are off

// TODO: handle failed axios call / promise

// TODO: cleanup Pile (code too intermingled)
// TODO: try smaller card sizes

// TODO: resume/new/recent (navigator)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
