
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from './components/HomePage.vue'
import TablePage from './components/draft/table/TablePage.vue'
import JoinPage from './components/JoinPage.vue'
import NavigatorPage from './components/navigator/NavigatorPage.vue'
import SimulatorPage from './components/SimulatorPage.vue'
import AboutPage from './components/AboutPage.vue'

import { store, useDraftModule } from './store'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',
  
  routes: [
    { path: '/', component: HomePage,
      beforeEnter: (to, from, next) => {
        next("/draft/");
      } 
    },
    { path: '/draft/', component: NavigatorPage },
    { path: '/draft/:draft_id', component: TablePage, props: true, 
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
    { path: '/draft/:draft_id/join', component: JoinPage, props: true,
      beforeEnter: (to, from, next) => {
        let draft_id = to.params.draft_id;
        let preserve = draft_id in store.state.drafts;
        useDraftModule(draft_id, { preserveState: preserve });
        next();
      }
    },
    { path: '/simulator/', component: SimulatorPage },
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

