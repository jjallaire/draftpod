// core vue dependencies
import Vue from 'vue'
import VueRouter from 'vue-router'

// bootstrap
import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'

// main app
import App from './components/App.vue'

// vuex store
import store from './store'

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
