

import { RESUME_DRAFT, SIMULATE_DRAFT, PICK_TIMER_PICK, PACK_TO_PICK,
         /*
         , , PICK_TO_PILE, 
         DECK_TO_SIDEBOARD, DECK_TO_UNUSED, 
         SIDEBOARD_TO_DECK, SIDEBOARD_TO_UNUSED, 
         UNUSED_TO_DECK, UNUSED_TO_SIDEBOARD,
         DISABLE_AUTO_LANDS, SET_BASIC_LANDS,
         REMOVE_PLAYER 
         */
        } from '@/store/modules/draft/actions';

import { testStore } from '../../../util/test-store'
import { PICK_TO_PILE } from '../../../../src/store/modules/draft/actions';

describe('Draft Store Actions', () => {

  test('simulate draft', () => {
    let simulateStore = testStore();
    simulateStore.dispatch("drafts/" + draft_id + "/" + SIMULATE_DRAFT, { player_id });
    expect(simulateStore.state.drafts[draft_id].table.picks_complete).toBe(true);
  });

  let store = testStore();
  let draft_id = store.getters.draft_in_progress.id;
  let player_id = store.getters.player.id;

  function table(store) {
    return store.state.drafts[draft_id].table;
  }

  function player(store) {
    return table(store).players[0];
  }

  function dispatch(action, payload) {
    return store.dispatch("drafts/" + draft_id + "/" + action, payload);
  }

  test('resume draft', () => {
    return dispatch(RESUME_DRAFT, { player_id }).then(() => {
      expect(player(store).id).toBe(player_id);
    });
  });

  test('pick timer pick', () => {
    let picksBefore = player(store).picks.pick_order.length;
    return dispatch(PICK_TIMER_PICK, { player_id }).then(() => {
      expect(player(store).picks.pick_order.length).toBe(picksBefore + 1);
    });
  });
  
  test('pack to pick', () => {
    let picksBefore = player(store).picks.pick_order.length;
    let card = player(store).packs[0][0];
    return dispatch(PACK_TO_PICK, { player_id, card, pile_number: 0 }).then(() => {
      expect(player(store).picks.pick_order.length).toBe(picksBefore + 1);
    });
  });

  test('pick to pile', () => {
    let pile1Before = player(store).picks.piles[1].length;
    let card = player(store).picks.piles[0].slice(-1)[0];
    return dispatch(PICK_TO_PILE, { player_id, card, pile_number: 1 }).then(() => {
      expect(player(store).picks.piles[1].length).toBe(pile1Before + 1);
    });
  });



});