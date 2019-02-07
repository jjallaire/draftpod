


import { shallowMount } from '@vue/test-utils'

import ErrorPage from '../ErrorPage.vue'

describe('ErrorPage.vue', () => {

  test('renders page', () => {
    const title = "Test Error";
    const wrapper = shallowMount(ErrorPage, {
      propsData: {
        title
      }
    });
    expect(wrapper.text()).toContain(title);
  });

});