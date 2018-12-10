

import * as selectors from './modules/draft/selectors'
import { CARDPOOL } from './constants'

export default {

  player: (state) => state.player,

  draft: (state) => (id) => state.drafts[id],
  
  draft_history: function(state, getters) {
    let drafts = Object.keys(state.drafts);
    return drafts
      .map((id) => {
        let draft = state.drafts[id];

        // get the active player -- if we don't yet have one then this should be 
        // execluded from the history
        let active_player = selectors.activePlayer(getters.player.id, draft.table);
        if (!active_player)
          return null;

        return {
          id: id,
          start_time: draft.start_time,
          set_code: draft.options.set_code,
          set_name: draft.options.set_name,
          current_pack: draft.table.current_pack,
          current_pick: draft.table.current_pick,
          picks_complete: draft.table.picks_complete,
          deck_total_cards: selectors.deckTotalCards(active_player.deck),
          card_colors: selectors.cardColors(selectors.activeCards(getters.player.id, draft.table))
                        .filter((color) => color.count > 0)
                        .slice(0,2),
        }
      })
      .filter((draft) => draft !== null && draft.current_pack > 0)
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
          value: CARDPOOL.CUBE + '4/4/1/1',
          caption: '4x Common, 4x Uncommon, 1x Rare, 1x Mythic'
        },
        {
          value: CARDPOOL.CUBE + '4/4/2/1',
          caption: '4x Common, 4x Uncommon, 2x Rare, 1x Mythic'
        },
        {
          value: CARDPOOL.CUBE + '3/2/1/1',
          caption: '3x Common, 2x Uncommon, 1x Rare, 1x Mythic'
        },
        {
          value: CARDPOOL.CUBE + '4/4/0/0',
          caption: '4x Common, 4x Uncommon'
        }
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



