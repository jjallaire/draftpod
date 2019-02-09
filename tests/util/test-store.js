
import state from '../data/state.json'

import _cloneDeep from 'lodash/cloneDeep'

import { createTestStore } from '../../src/store'

export function testStore() {
  return createTestStore(_cloneDeep(state));
}

