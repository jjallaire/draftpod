

export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES'
export const REMOVE_DRAFTS = 'REMOVE_DRAFTS'

import _omit from 'lodash/omit'

export default {

  [UPDATE_PREFERENCES](state, prefs) {
    state.preferences = { ...state.preferences, ...prefs };
  },

  [REMOVE_DRAFTS](state, { draft_ids }) {
    state.drafts = _omit(state.drafts, draft_ids);
  }
}