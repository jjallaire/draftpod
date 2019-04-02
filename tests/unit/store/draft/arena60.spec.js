
import deck from '../../data/deck.json'

import * as selectors from '@/store/modules/draft/selectors'

describe('Arena 60 Card Decks', () => {

  let deck60 = selectors.arena60CardDeck('rna', deck);
  let decklist60 = selectors.arena60CardDeckList('rna', deck);

  test('Generates 60 card arena deck', () => {
    expect(decklist60).toContain('Plague Wight')
  })

  test('Fills in a 3rd copy of special land', () => {
    expect(decklist60).toContain('3 Rakdos Guildgate')
  })

  test('Truncates incoming cards to 4x', () => {
    expect(decklist60).toContain('4 Macabre Mockery')
  })

  test('Prevents addition of cards that already have 4x', () => {
    expect(decklist60).toContain('4 Ghor-Clan Wrecker')
  }),

  test('Excludes cards from sideboard that already have 4 in the main deck', () => {
    expect(decklist60).toEqual(expect.not.stringContaining('1 Macabre Mockery'))
  })

  test('Basic lands are projected correctly onto 60 cards', () => {
    expect(deck60.lands.basic.B).toBeGreaterThan(7);
    expect(deck60.lands.basic.R).toBeGreaterThan(8);
  })

});