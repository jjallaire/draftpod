

import { mount } from '@vue/test-utils'
import PickRatings from '../../../src/components/draft/pick/PickRatings.vue'

import ratings from '../../data/ratings.json'

import providers from '../../util/providers'

describe('PickRatings.vue', () => {

  test('displays ratings', () => {
    const wrapper = mount(PickRatings, {
      propsData: { pick_ratings: ratings },
      provide: providers
    });
    const ratingRows = wrapper.findAll('.ratings-table tbody>tr');
    expect(ratingRows).toHaveLength(ratings.length);

    // do a snapshot test
    expect(wrapper.element).toMatchSnapshot();
  });

});

