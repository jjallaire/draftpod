import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import store from './store'

// TODO: some JS exceptions during the transition from picks to deck (cards in ManaColors are empty/null)

// TODO: update_current_time dominating vuex store

// TODO: event bus: https://alligator.io/vuejs/global-event-bus/
// TODO: https://medium.com/vuejobs/create-a-global-event-bus-in-vue-js-838a5d9ab03a
// pass ids throughout components
// pass object directly to mutations (as we do now)
// emit events up to broker (either one hop at a time or via global event bus)

// or some boilerplate like this: https://github.com/vuejs/vuex/issues/863#issuecomment-329510765

// TODO: color_order should be stored with the deck in DeckLands 
// (currently doesn't survive reload)

// TODO: drag feedback and insert loc on sideboard

// TODO: flicker when pack is loading

// TODO: cleanup Pile (code too intermingled)


// TODO: unhandled exception when running out of time?

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
