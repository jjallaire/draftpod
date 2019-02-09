

import { CARDPOOL } from '@/store/constants'
import { SET_PLAYER_INFO, UPDATE_PREFERENCES } from '@/store/mutations'

import { testStore } from '../../util/test-store'

import shortUuid from 'short-uuid'

describe('Store Mutations', () => {

  let store = testStore();

  test('set player info', () => {
   
    let newId = shortUuid().new();
    let newName = "Fred";
    store.commit(SET_PLAYER_INFO, {
      id: newId,
      name: newName
    });

    expect(store.getters.player.id).toBe(newId);
    expect(store.getters.player.name).toBe(newName);

  });

  test('update preferences', () => {

    let newSet = 'dom';
    let newCardpool = CARDPOOL.CUBE + '3/2/1/1';
    store.commit(UPDATE_PREFERENCES, {
      set_code: newSet,
      cardpool: newCardpool,
      pick_timer: true,
      pick_ratings: true
    });

    expect(store.state.preferences.set_code).toBe(newSet);
    expect(store.state.preferences.sets.dom.cardpool).toBe(newCardpool);
    expect(store.state.preferences.pick_timer).toBe(true);
    expect(store.state.preferences.pick_ratings).toBe(true);

  });
  

});