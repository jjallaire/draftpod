
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from '../components/HomePage.vue'
import DraftTable from '../components/draft/table/DraftTable.vue'
import SealedTable from '../components/draft/table/SealedTable.vue'
import JoinPage from '../components/JoinPage.vue'
import NavigatorPage from '../components/navigator/NavigatorPage.vue'
import SimulatorPage from '../components/SimulatorPage.vue'
import SealedPoolPage from '../components/SealedPoolPage.vue'
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
    { path: '/draft/:draft_id', component: DraftTable, props: true, 
      beforeEnter: (to, from, next) => {
        
        // if the draft exists
        let draft_id = to.params.draft_id;
        if (draft_id in store.state.drafts) {

          // bind draft module
          useDraftModule(draft_id, { preserveState: true });

          // check if this is draft or sealed
          let format = selectors.draftFormat(store.state.drafts[draft_id]);
          let sealed = format === 'sealed';

          // helper to advance to the appropriate next page
          const nextPage = () => {
            if (sealed)
              next(`/sealed/${draft_id}`)
            else
              next();
          };

          // sync from firestore if this is a multi-player draft
          if (store.state.drafts[draft_id].options.multi_player) {

            progress.start(350);
            firestore.getDraft(draft_id).then(draft => {
              
              // sync draft to local store if it was found
              if (draft)
                store.commit(SET_DRAFT, { draft_id, draft });

              // convert any draft not found to single player, also
              // convert type=sealed to single player (as no coordination
              // is needed between players in sealed mode
              if (!draft || sealed) {
                store.commit("drafts/" + draft_id + "/" + CONVERT_TO_SINGLE_PLAYER, { 
                  player_id: store.state.player.id
                });
              }

              // advance to the appropriate page
              nextPage();
              
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
            nextPage();
          }

        // draft doesn't exist so navigate to the draft not found page
        } else {
          draftNotFound(next, draft_id);
        }
      } 
    },
    { path: '/sealed/:draft_id', component: SealedTable, props: true,
      beforeEnter: (to, from, next) => {
        let draft_id = to.params.draft_id;
        if (draft_id in store.state.drafts) {
          useDraftModule(draft_id, { preserveState: true });
          next();
        } else {
          draftNotFound(next, draft_id);
        }
      }
    },
    { path: '/guide/', component: GuidePage },
    { path: '/simulator/', component: SimulatorPage },
    { path: '/sealedpool/', component: SealedPoolPage },
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


