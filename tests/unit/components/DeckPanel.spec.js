



import { mount } from '@vue/test-utils'
import DeckPanel from '../../../src/components/draft/deck/DeckPanel.vue'

import deck from '../../data/deck.json'

import providers from '../../util/providers'

describe('DeckPanel.vue', () => {

  test('displays deck', () => {
    const wrapper = mount(DeckPanel, {
      propsData: { 
        set_name: "Ravnica Allegiance",
        deck 
      },
      provide: providers
    });

    // check for deck piles
    const deckPiles = wrapper.findAll('.pile');
    expect(deckPiles).toHaveLength(17);

    // check for cards in land pile
    let landCards = deckPiles.at(7).findAll('.mtgcard');
    expect(landCards).toHaveLength(5);

  });
  
});

