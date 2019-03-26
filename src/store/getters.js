

import * as selectors from './modules/draft/selectors'
import { CARDPOOL } from './constants'

export default {

  player: (state) => state.player,

  firebase_error: (state) => state.firebase_error,

  draft: (state) => (id) => state.drafts[id],
  
  orphaned_drafts: function(state, getters) {
    let drafts = Object.keys(state.drafts);
    return drafts
      .filter(id => isOrphanedDraft(getters.player.id, state.drafts[id]));
  },

  draft_history: function(state, getters) {
    let drafts = Object.keys(state.drafts);
    return drafts
      .map((id) => {
        try {
          let draft = state.drafts[id];

          // don't return orphans
          if (isOrphanedDraft(getters.player.id, draft))
            return null;

          // get options
          let options = selectors.draftOptions(draft);

          // alias player
          let player = selectors.activePlayer(getters.player.id, draft.table);

          return {
            id: id,
            start_time: draft.table.start_time,
            set_code: draft.set.code,
            set_name: draft.set.name,
            current_pack: selectors.currentPack(getters.player.id, draft.set.code, draft.table),
            current_pick: selectors.currentPick(getters.player.id, draft.set.code, draft.table),
            picks_complete: selectors.picksComplete(getters.player.id, draft.set.code, options, draft.table),
            deck_total_cards: selectors.deckTotalCards(player.deck),
            card_colors: selectors.playerColors(getters.player.id, draft.table),
          }
        } catch(e) {
          // if the draft is corrupt then exclude it
          return null;
        }
      })
      .filter((draft) => draft !== null)
      .sort((a, b) => b.start_time - a.start_time);
  },

  draft_in_progress: function(state, getters) {
    // get the most recent draft
    let history = getters.draft_history;
    if (history.length > 0) {
      let last_draft = history[0];
      let options = selectors.draftOptions(getters.draft(last_draft.id));
      if (last_draft.deck_total_cards < options.deck_size)
        return last_draft;
      else
        return null;
    } else {
      return null;
    }
  },

  cardpool: (state) => (set_code, name) => {
    return {
      name,
      ...state.cardpools[set_code][name]
    }
  },

  cardpools: (state) => (set_code) => {
    if (state.cardpools[set_code]) {
      let set_cardpools = state.cardpools[set_code];
      return Object.keys(set_cardpools)
        .map((name) => {
          return { name, ...set_cardpools[name] };
        })
        .sort((a, b) => b.updated - a.updated);
    } else {
      return [];
    }
  },

  cardpool_options: (state, getters) => (set_code) => {
    return {
      cubes: [
        {
          value: CARDPOOL.CUBE + '6/3/1/1',
          caption: '6x Common, 3x Uncommon, 1x Rare, 1x Mythic'
        },
        {
          value: CARDPOOL.CUBE + '4/2/1/1',
          caption: '4x Common, 2x Uncommon, 1x Rare, 1x Mythic'
        },
        {
          value: CARDPOOL.CUBE + '3/2/1/1',
          caption: '3x Common, 2x Uncommon, 1x Rare, 1x Mythic'
        },
      ],
      custom: getters.cardpools(set_code).map(cardpool => {
        return {
          value: CARDPOOL.CUSTOM + cardpool.name,
          caption: cardpool.name
        };
      })
    }
  },
};

function isOrphanedDraft(player_id, draft) {
  return draft.table.start_time === null ||
         !selectors.activePlayer(player_id, draft.table);
}



