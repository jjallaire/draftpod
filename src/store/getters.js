

import * as selectors from './modules/draft/selectors'

export default {
  
  recent_drafts: function(state) {
    let drafts = Object.keys(state.drafts);
    return drafts
      .map((id) => {
        let draft = state.drafts[id];
        return {
          id: id,
          start_time: draft.start_time,
          set_name: draft.options.set_name,
          current_pack: draft.table.current_pack,
          current_pick: draft.table.current_pick,
          picks_complete: draft.table.picks_complete,
          deck_total_cards: selectors.deckTotalCards(draft.table.deck),
        }
      })
      .sort((a, b) => b.start_time - a.start_time);
  },

  draft_in_progress: function(state, getters) {
    // get the most recent draft
    let recent = getters.recent_drafts;
    if (recent.length > 0) {
      let last_draft = recent[0];
      if (last_draft.deck_total_cards < 40)
        return last_draft;
      else
        return null;
    } else {
      return null;
    }
  },
};

