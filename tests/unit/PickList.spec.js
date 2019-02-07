



import { mount } from '@vue/test-utils'
import PickList from '../../src/components/draft/pick/PickList.vue'

import piles from './data/piles.json'

import providers from './util/providers'

describe('PickList.vue', () => {

  test('displays picks', () => {
    const wrapper = mount(PickList, {
      propsData: { 
        piles
      },
      provide: providers
    });

    // check for deck piles
    const deckPiles = wrapper.findAll('.pile');
    expect(deckPiles).toHaveLength(9);

    // check for cards in sideboard
    let landCards = deckPiles.at(8).findAll('.mtgcard');
    expect(landCards).toHaveLength(6);
  });
  
});

