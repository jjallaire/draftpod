


import { testStore } from '../../util/test-store'

describe('Store Getters', () => {

  let store = testStore();

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

  test('orphaned drafts', () => {
    let orphaned = store.getters.orphaned_drafts;
    expect(orphaned.length).toBe(0);
  });

  test('cardpools', () => {

    // enumeration
    expect(store.getters.cardpools.length).toBe(1);
    
    // select a cardpool
    let cardpool = store.getters.cardpool('rna', 'RNA Cube');
    expect(cardpool.name).toBe('RNA Cube');

    // get cardpool options
    let options = store.getters.cardpool_options('rna');
    expect(options.custom.length).toBe(1);

  });

});