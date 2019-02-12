
import { DECK } from '@/store/modules/draft/constants'

import { RESUME_DRAFT, SIMULATE_DRAFT, PICK_TIMER_PICK, PACK_TO_PICK, PICK_TO_PILE,
         DECK_TO_SIDEBOARD, DECK_TO_UNUSED, SIDEBOARD_TO_DECK, SIDEBOARD_TO_UNUSED,
         UNUSED_TO_DECK, UNUSED_TO_SIDEBOARD, DISABLE_AUTO_LANDS, SET_BASIC_LANDS,
        } from '@/store/modules/draft/actions';

import { testStore } from '../../util/test-store'

describe('Draft Store Actions', () => {

  let store = testStore();
  let player_id = store.getters.player.id;
  let draft_id = store.getters.draft_in_progress.id;

  function table(store) {
    return store.state.drafts[draft_id].table;
  }

  function player(store) {
    return table(store).players[0];
  }

  function deck(store) {
    return player(store).deck;
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

  test('simulate draft', () => {
    return dispatch(SIMULATE_DRAFT, { player_id }).then(() => {
      expect(table(store).picks_complete).toBe(true);
    });
  });

  test('deck to sideboard', () => {
    let card = deck(store).piles[2][0];
    return dispatch(DECK_TO_SIDEBOARD, { player_id, card }).then(() => {
      let sideboard = deck(store).piles[DECK.SIDEBOARD];
      expect(sideboard).toEqual(expect.arrayContaining([card]));
    });
  });

  test('sideboard to unused', () => {
    let card = deck(store).piles[DECK.SIDEBOARD][0];
    return dispatch(SIDEBOARD_TO_UNUSED, { player_id, card }).then(() => {
      let unused = deck(store).piles[DECK.UNUSED];
      expect(unused).toEqual(expect.arrayContaining([card]));
    });
  });

  test('unused to sideboard', () => {
    let card = deck(store).piles[DECK.UNUSED][0];
    return dispatch(UNUSED_TO_SIDEBOARD, { player_id, card }).then(() => {
      let sideboard = deck(store).piles[DECK.SIDEBOARD];
      expect(sideboard).toEqual(expect.arrayContaining([card]));
    });
  });

  test('sideboard to deck', () => {
    let card = deck(store).piles[DECK.SIDEBOARD][0];
    return dispatch(SIDEBOARD_TO_DECK, { player_id, card }).then(() => {
      let cardPile = deck(store).piles[card.cmc - 1];
      expect(cardPile).toEqual(expect.arrayContaining([card]));
    });
  });

  test('deck to unused', () => {
    let card = deck(store).piles[2][0];
    return dispatch(DECK_TO_UNUSED, { player_id, card }).then(() => {
      let unused = deck(store).piles[DECK.UNUSED];
      expect(unused).toEqual(expect.arrayContaining([card]));
    });
  });

  test('unused to deck', () => {
    let card = deck(store).piles[DECK.UNUSED][0];
    return dispatch(UNUSED_TO_DECK, { player_id, card }).then(() => {
      let cardPile = deck(store).piles[card.cmc - 1];
      expect(cardPile).toEqual(expect.arrayContaining([card]));
    });
  });

  test('disable auto-lands', () => {
    let color_order = ['B', 'W', 'U', 'R', 'G'];
    return dispatch(DISABLE_AUTO_LANDS, { player_id, color_order }).then(() => {
      expect(deck(store).lands.auto).toBe(false);
      expect(deck(store).lands.color_order).toBe(color_order);
    });
  });

  test('set basic lands', () => {
    let color = 'R';
    let lands = 5;
    return dispatch(SET_BASIC_LANDS, { player_id, color, lands }).then(() => {
      expect(deck(store).lands.basic[color]).toBe(lands);
    });
  });


});