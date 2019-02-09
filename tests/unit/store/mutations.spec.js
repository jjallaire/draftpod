


import { SET_PLAYER_INFO } from '@/store/mutations'

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
  

});