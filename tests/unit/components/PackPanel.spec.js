

import { mount } from '@vue/test-utils'
import PackPanel from '../../../src/components/draft/pack/PackPanel.vue'

import cards from '../data/cards.json'

import providers from '../util/providers'

describe('PackPanel.vue', () => {

  test('displays cards', () => {
    const wrapper = mount(PackPanel, {
      propsData: { pack: cards },
      provide: providers
    });
    const cardSpans = wrapper.findAll('.card-select-container .mtgcard');
    expect(cardSpans).toHaveLength(cards.length);

    // do a snapshot test
    expect(wrapper.element).toMatchSnapshot();
  });

});

