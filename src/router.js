
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from './components/HomePage.vue'
import TablePage from './components/draft/table/TablePage.vue'
import JoinPage from './components/JoinPage.vue'
import NavigatorPage from './components/navigator/NavigatorPage.vue'
import SimulatorPage from './components/SimulatorPage.vue'
import AboutPage from './components/AboutPage.vue'

import { store, useDraftModule } from './store'
import { SET_DRAFT } from './store/mutations'
import firestore from './store/modules/draft/firestore'
import * as selectors from './store/modules/draft/selectors'

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

          if (store.state.drafts[draft_id].options.multi_player) {
            firestore.getDraft(draft_id).then(draft => {
              store.commit(SET_DRAFT, { draft_id, draft });
              next();
            });
          } else {
            next();
          }
        } else {
          next("/draft/");
        }
      } 
    },
    { path: '/draft/:draft_id/join', component: JoinPage, props: true,
      beforeEnter: (to, from, next) => {
        
        let player_id = store.state.player.id;
        let draft_id = to.params.draft_id;

        firestore.getDraft(draft_id).then(draft => {
          store.commit(SET_DRAFT, { draft_id, draft });
          useDraftModule(draft_id, { preserveState: true });

          // if the draft is already started and we are in it then
          // navigate to it directly
          let table = draft.table;
          if (selectors.isStarted(table) && selectors.hasPlayer(player_id, table))
            next("/draft/" + draft_id);
          // otherwise continue to join ui
          else
            next();
        });
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

