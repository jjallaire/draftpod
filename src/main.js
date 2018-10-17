
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './components/App.vue'

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
