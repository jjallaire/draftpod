
import { mount } from '@vue/test-utils'
import NavigatorPage from '../../../src/components/navigator/NavigatorPage.vue'

import { testStore } from '../../util/test-store'

import { RouterLinkStub } from '@vue/test-utils'

import flushPromises from 'flush-promises'

describe('NavigatorPage.vue', () => {

  test('navigator page displays', () => {

    // mount the page
    const wrapper = mount(NavigatorPage, {
      sync: false,
      mocks: {
        $store: testStore()
      },
      stubs: {
        RouterLink: RouterLinkStub
      }
    });

    return flushPromises().then(() => {

      // do a nominal check for some content (this test is really intended to
      // see whether the page renders at all)
      const recentDrafts = wrapper.findAll('.recent-drafts .card-body .row');
      expect(recentDrafts).toHaveLength(3);

    });

    
  });

});
