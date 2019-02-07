

import { mount } from '@vue/test-utils'
import PickTimer from '../../src/components/draft/pick/PickTimer.vue'

import providers from './util/providers'

describe('PickTimer.vue', () => {

  function pickTimerOptions(secondsRemaining) {
    return {
      propsData: { pick_end_time: new Date().getTime() + (1000 * secondsRemaining) },
      provide: providers
    }
  }

  test('displays time remaining', () => {
    const wrapper = mount(PickTimer, pickTimerOptions(20));
    expect(wrapper.text()).toContain('0:');
    expect(wrapper.classes()).toContain('badge-transparent');
  });

  test('displays red background', () => {
    const wrapper = mount(PickTimer, pickTimerOptions(9));
    expect(wrapper.classes()).toContain('badge-danger');
  });

});




