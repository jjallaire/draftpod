

import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import Draft from './components/draft/Draft.vue'
import About from './components/About.vue'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',
  
  routes: [
    { path: '/', component: Home },
    { path: '/draft', component: Draft },
    { path: '/about', component: About },
  ],
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }

});

