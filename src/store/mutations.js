
import Vue from 'vue'
export const SET_PLAYER_ID = 'SET_PLAYER_ID'
export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES'
export const REMOVE_DRAFTS = 'REMOVE_DRAFTS'
export const SET_CARDPOOL = 'SET_CARDPOOL'
export const REMOVE_CARDPOOL = 'REMOVE_CARDPOOL'

import _omit from 'lodash/omit'

import * as selectors from './modules/draft/selectors'

export default {

  [SET_PLAYER_ID](state, player_id) {
    
    // update the player id
    state.player.id = player_id;

    // remove drafts that don't have this player id
    let drafts = Object.keys(state.drafts);
    let stranded_drafts = drafts.filter((id) => {
      let draft = state.drafts[id];
      return selectors.activePlayer(player_id, draft.table) === undefined;
    });
    removeDrafts(state, stranded_drafts);
  },

  [UPDATE_PREFERENCES](state, prefs) {
    
    // global preferences
    state.preferences.set_code = prefs.set_code;
    state.preferences.pick_timer = prefs.pick_timer;
    state.preferences.pick_ratings = prefs.pick_ratings;

    // set preferences
    if (!state.preferences.sets[prefs.set_code])
      Vue.set(state.preferences.sets, prefs.set_code, {});
    Vue.set(state.preferences.sets[prefs.set_code], "cardpool", prefs.cardpool);  
  },

  [REMOVE_DRAFTS](state, draft_ids) {
    removeDrafts(state, draft_ids);
  },

  [SET_CARDPOOL](state, { set_code, name, cards }) {

    // ensure we have a key for this set
    if (!state.cardpools[set_code])
      Vue.set(state.cardpools, set_code, {});

    // set the cardpool
    Vue.set(state.cardpools[set_code], name, {
      cards,
      updated: new Date().getTime()
    })
  },

  [REMOVE_CARDPOOL](state, { set_code, name }) {
    Vue.delete(state.cardpools[set_code], name);
  },

}

function removeDrafts(state, draft_ids) {
  state.drafts = _omit(state.drafts, draft_ids);
}