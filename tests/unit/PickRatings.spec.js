

import { mount } from '@vue/test-utils'
import PickRatings from '../../src/components/draft/pick/PickRatings.vue'

import ratings from './data/ratings.json'

describe('PickRatings.vue', () => {

  test('displays ratings', () => {
    const wrapper = mount(PickRatings, {
      propsData: { pick_ratings: ratings },
      provide: {
        touchDragManager: {
          registerDropTarget() {}
        }
      }
    });
    const ratingRows = wrapper.findAll('.ratings-table tbody>tr');
    expect(ratingRows).toHaveLength(ratings.length);
  });

});

