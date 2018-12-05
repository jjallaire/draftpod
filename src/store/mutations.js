
import Vue from 'vue'
export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES'
export const REMOVE_DRAFTS = 'REMOVE_DRAFTS'

import _omit from 'lodash/omit'

export default {

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
    state.drafts = _omit(state.drafts, draft_ids);
  }
}