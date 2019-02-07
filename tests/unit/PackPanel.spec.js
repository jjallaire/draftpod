

import { mount } from '@vue/test-utils'
import PackPanel from '../../src/components/draft/pack/PackPanel.vue'

import cards from './data/cards.json'

describe('PackPanel.vue', () => {

  test('displays cards', () => {
    const wrapper = mount(PackPanel, {
      propsData: { pack: cards },
      provide: {
        touchDragManager: null,
        setCardPreview() {}
      }
    });
    const cardSpans = wrapper.findAll('.pack-container .mtgcard');
    expect(cardSpans).toHaveLength(cards.length);
  });

});

