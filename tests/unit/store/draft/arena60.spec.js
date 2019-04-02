
import deck from '../../data/deck.json'

import * as selectors from '@/store/modules/draft/selectors'

import * as set from '@/store/modules/draft/set/'

describe('Arena 60 Card Decks', () => {

  test('can generate 60 card arena deck', () => {

    return set.cards('rna').then(() => {
      let decklist = selectors.arena60CardDeckList('rna', deck);
      expect(decklist).toContain('Plague Wight');
    })
    
  
  })

});