

import * as selectors from './modules/draft/selectors'

export default {

  draft: (state) => (id) => state.drafts[id],
  
  draft_history: function(state) {
    let drafts = Object.keys(state.drafts);
    return drafts
      .map((id) => {
        let draft = state.drafts[id];
        return {
          id: id,
          start_time: draft.start_time,
          set_code: draft.options.set_code,
          set_name: draft.options.set_name,
          current_pack: draft.table.current_pack,
          current_pick: draft.table.current_pick,
          picks_complete: draft.table.picks_complete,
          deck_total_cards: selectors.deckTotalCards(draft.table.deck),
          card_colors: selectors.cardColors(selectors.activeCards(draft.table))
                        .filter((color) => color.count > 0)
                        .slice(0,2),
        }
      })
      .filter((draft) => draft.current_pack > 0)
      .sort((a, b) => b.start_time - a.start_time);
  },

  draft_in_progress: function(state, getters) {
    // get the most recent draft
    let history = getters.draft_history;
    if (history.length > 0) {
      let last_draft = history[0];
      if (last_draft.deck_total_cards < 40)
        return last_draft;
      else
        return null;
    } else {
      return null;
    }
  },
};



