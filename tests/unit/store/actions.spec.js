
import { CARDPOOL } from '@/store/constants'
import { INIT_DRAFT } from '@/store/actions'
import { START_DRAFT } from '@/store/modules/draft/actions'

import { testStore } from '../../util/test-store'

describe('Store Actions', () => {

  test('init draft', () => {

    let store = testStore();

    let new_draft_id = null;

    return store.dispatch(INIT_DRAFT, {
      set_code: 'rna', 
      cardpool: CARDPOOL.CUBE + '3/2/1/1',
      options: {},
      targetStore: store
    }).then(draft_id => {
      
      new_draft_id = draft_id;
      return store.dispatch("drafts/" + draft_id + "/" + START_DRAFT);

    }).then(() => {

      expect(new_draft_id).not.toBe(null);
      expect(store.getters.draft_in_progress.id).toBe(new_draft_id);

    });

  });

 

});