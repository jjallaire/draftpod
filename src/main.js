
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './components/App.vue'

import 'vue-material-design-icons/styles.css'

import './bootstrap/slate.min.css'

import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'

Vue.config.productionTip = false

// router
Vue.use(VueRouter)
var router = new VueRouter({
  mode: 'history',
  routes: []
});

// vue
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
