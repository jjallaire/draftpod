


export const REMOVE_DRAFTS = 'REMOVE_DRAFTS'

import _omit from 'lodash/omit'

export default {
  [REMOVE_DRAFTS](state, { draft_ids }) {
    state.drafts = _omit(state.drafts, draft_ids);
  }
}