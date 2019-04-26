
import { mount } from '@vue/test-utils'
import DraftTable from '../../../src/components/draft/table/DraftTable.vue'

import { testStore } from '../util/test-store'

import { RouterLinkStub } from '@vue/test-utils'

import flushPromises from 'flush-promises'

describe('DraftTable.vue', () => {

  test('draft table displays', () => {

    // mount the page
    const wrapper = mount(DraftTable, {
      sync: false,
      propsData: { draft_id: "2me2Q4mvbpQEJVeMKkuk3y" },
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
      const deckPiles = wrapper.findAll('.pick-list .pile');
      expect(deckPiles).toHaveLength(9);
    });

    
  });

});
