

import { mount } from '@vue/test-utils'
import ManaColors from '../../../src/components/draft/infobar/ManaColors.vue'

import cards from '../data/cards.json'

describe('ManaColors.vue', () => {

  test('displays all colors', () => {
    const wrapper = mount(ManaColors, {
      propsData: { cards }
    });
    const colorRows = wrapper.findAll('.deck-colors tbody>tr');
    expect(colorRows).toHaveLength(6);

    // do a snapshot test
    expect(wrapper.element).toMatchSnapshot();
  });

});




