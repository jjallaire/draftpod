import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import store from './store'

Vue.config.productionTip = false

// TODO: card_preview provided via events / event bus? 
// (would allow us to avoid passing draft/player to card)

// TODO: player_id rather than player

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
