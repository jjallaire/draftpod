
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from '../components/HomePage.vue'
import TablePage from '../components/draft/table/TablePage.vue'
import JoinPage from '../components/JoinPage.vue'
import NavigatorPage from '../components/navigator/NavigatorPage.vue'
import SimulatorPage from '../components/SimulatorPage.vue'
import GuidePage from '../components/guide/GuidePage.vue'
import NotFoundPage from '../components/NotFoundPage.vue'
import DraftNotFoundPage from '../components/draft/DraftNotFoundPage.vue'

import { store, useDraftModule } from '../store'
import { SET_DRAFT, REMOVE_DRAFTS, SET_FIREBASE_ERROR } from '../store/mutations'
import firestore from '../store/modules/draft/firestore'
import { CONVERT_TO_SINGLE_PLAYER } from '../store/modules/draft/mutations'
import * as log from './log'
import progress from './progress'
import * as selectors from '../store/modules/draft/selectors'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',
  
  routes: [
    { path: '/', component: HomePage },
    { path: '/draft/', component: NavigatorPage },
    { path: '/draft/:draft_id/join', component: JoinPage, props: true,
      beforeEnter: (to, from, next) => {

        // alias ids
        let player_id = store.state.player.id;
        let draft_id = to.params.draft_id;

        // sync from firestore
        progress.start(350);
        firestore.getDraft(draft_id).then(draft => {

          if (draft) {
            // write locally
            store.commit(SET_DRAFT, { draft_id, draft });

            // bind draft module
            useDraftModule(draft_id, { preserveState: true });

            // if the draft is already started and we are in it then navigate to it (skip join)
            if (selectors.isStarted(draft.table) && selectors.hasPlayer(player_id, draft.table))
              next("/draft/" + draft_id);
            // otherwise continue to join ui
            else
              next();
          } else {
            draftNotFound(next, draft_id);
          }
        })
        .catch(error => {
          // log error 
          if (shouldLogError(error))
            log.logException(error, "onGetDraftBeforeJoin");

          // clear any residual draft data
          store.commit(REMOVE_DRAFTS, [draft_id]);

          // set the router error so the join page can display it
          store.commit(SET_FIREBASE_ERROR, error);

          // on to the join page
          next();
        })
        .finally(() => {
          progress.stop();
        });
      }
    },
    { path: '/draft/:draft_id/not-found', component: DraftNotFoundPage, props: true },
    { path: '/draft/:draft_id', component: TablePage, props: true, 
      beforeEnter: (to, from, next) => {
        
        // if the draft exists
        let draft_id = to.params.draft_id;
        if (draft_id in store.state.drafts) {

          // bind draft module
          useDraftModule(draft_id, { preserveState: true });

          // sync from firestore if this is a multi-player draft
          if (store.state.drafts[draft_id].options.multi_player) {

            progress.start(350);
            firestore.getDraft(draft_id).then(draft => {
              
              // sync draft to local store if it was found
              if (draft) {
                store.commit(SET_DRAFT, { draft_id, draft });

              // if not found then it was likely removed from the server
              // in that case, downgrade to a single-player draft
              } else {
                store.commit("drafts/" + draft_id + "/" + CONVERT_TO_SINGLE_PLAYER, { 
                  player_id: store.state.player.id
                });
              }

              // advance to the page
              next();
              
            })
            .catch(error => {
              // log error
              if (shouldLogError(error))
                log.logException(error, "onGetDraftBeforeDraft");

              // set the router error so the table page can display it
              store.commit(SET_FIREBASE_ERROR, error);

              // on to page
              next();
            })
            .finally(() => {
              progress.stop();
            });
           
          // single player draft, proceed without syncing
          } else {
            next();
          }

        // draft doesn't exist so navigate to the draft not found page
        } else {
          draftNotFound(next, draft_id);
        }
      } 
    },
    { path: '/guide/', component: GuidePage },
    { path: '/simulator/', component: SimulatorPage },
    { path: '*', component: NotFoundPage }
  ],
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
});


function draftNotFound(next, draft_id) {
  next("/draft/" + draft_id + "/not-found"); 
}

function shouldLogError(error) {
  return !firestore.isConnectivityError(error);
}


