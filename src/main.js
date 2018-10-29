// core vue dependencies
import Vue from 'vue'
import VueRouter from 'vue-router'

// bootstrap
import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'

// main modes
import Home from './components/Home.vue'
import App from './components/App.vue'
import About from './components/About.vue'

// vuex store
import store from './store'

Vue.config.productionTip = false

const routes = [
  { path: '/', component: Home },
  { path: '/draft', component: App },
  { path: '/about', component: About },
];

// router
Vue.use(VueRouter)
var router = new VueRouter({
  mode: 'history',
  routes: routes
});

// vue
new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
