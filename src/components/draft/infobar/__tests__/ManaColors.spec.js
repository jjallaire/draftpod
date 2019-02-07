

import { mount } from '@vue/test-utils'
import ManaColors from '../ManaColors.vue'

import cards from './cards.json'

describe('ManaColors.vue', () => {

  test('displays all colors', () => {
    const wrapper = mount(ManaColors, {
      propsData: { cards }
    });
    const colorRows = wrapper.findAll('.deck-colors tbody>tr');
    expect(colorRows).toHaveLength(6);
  });

});




