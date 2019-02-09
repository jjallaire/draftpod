

import state from './data/state.json'

import _cloneDeep from 'lodash/cloneDeep'

import { createTestStore } from '../../src/store'

describe('Store Getters', () => {

  let store = createTestStore(_cloneDeep(state));

  test('player info', () => {
    let player = store.getters.player;
    expect(player.id).toBe('fWXbfdsCXaGusUmxN1CzkA');
    expect(player.name).toBe('Linda');
  });

  test('draft history', () => {
    let history = store.getters.draft_history;
    expect(history.length).toBe(3);
  });

  test('draft in progress', () => {
    let draft = store.getters.draft_in_progress;
    expect(draft.id).toBe('2me2Q4mvbpQEJVeMKkuk3y');
  });

});