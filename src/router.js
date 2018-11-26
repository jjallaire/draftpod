

import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from './components/HomePage.vue'
import DraftPage from './components/draft/DraftPage.vue'
import AboutPage from './components/AboutPage.vue'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',
  
  routes: [
    { path: '/', component: HomePage },
    { path: '/draft/', component: DraftPage },
    { path: '/about', component: AboutPage },
  ],
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }

});

