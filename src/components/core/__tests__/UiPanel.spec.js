


import { mount } from '@vue/test-utils'
import UiPanel from '../UiPanel.vue'


describe('UiPanel.vue', () => {

  test('renders panel', () => {
    const wrapper = mount(UiPanel);
    const caption = "Test Caption";
    wrapper.setProps({ caption });
    expect(wrapper.text()).toContain(caption);
    expect(wrapper.html()).toContain('card-header');
  });

});