import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import store from './store'


// do we need to tear down the pick_timer when exiting or somehow make it global?

// overly chatty PACK_TO_PICK (AI ends up calling it as well)

// Scoped dynamic NS: https://github.com/vuejs/vuex/issues/863#issuecomment-329510765

// TODO: some JS exceptions during the transition from picks to deck (cards in ManaColors are empty/null)

// TODO: implement separate piles for instants and sorceries in deck

// TODO: event bus: https://alligator.io/vuejs/global-event-bus/
// TODO: https://medium.com/vuejobs/create-a-global-event-bus-in-vue-js-838a5d9ab03a
// pass ids throughout components
// pass object directly to mutations (as we do now)
// emit events up to broker (either one hop at a time or via global event bus)

// or some boilerplate like this: https://github.com/vuejs/vuex/issues/863#issuecomment-329510765

// TODO: color_order should be stored with the deck in DeckLands 
// (currently doesn't survive reload)

// TODO: flicker when pack is loading

// TODO: cleanup Pile (code too intermingled)

// TODO: some additional gradiants

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
