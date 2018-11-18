

import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import Table from './components/draft/table/Table.vue'
import Navigator from './components/draft/navigator/Navigator.vue'
import About from './components/About.vue'

import store from './store'
import { useDraftModule } from '@/store'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',
  
  routes: [
    { path: '/', component: Home },
    { path: '/draft/', component: Navigator },
    { path: '/draft/:draft_id', component: Table, props: true, 
      beforeEnter: (to, from, next) => {
        let draft_id = to.params.draft_id;
        if (draft_id in store.state.drafts) {
          useDraftModule(draft_id, { preserveState: true });
          next();
        } else {
          next("/draft/");
        }
      } 
    },
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

