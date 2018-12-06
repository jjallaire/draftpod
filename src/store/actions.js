


import uuidv4 from 'uuid'

import { START_DRAFT } from './modules/draft/mutations';

import * as set from './modules/draft/set/'
import { useDraftModule } from '@/store'

export const CREATE_DRAFT = 'CREATE_DRAFT'

export default {

  [CREATE_DRAFT]( { commit }, { set_code, cardpool, options } ) {

    // create a new draft module
    let draft_id = uuidv4();
    useDraftModule(draft_id);

    // download/generate cardpool and return draft_id
    return new Promise((resolve) => {

      // download set data
      set.cards(set_code)
        .then(cards => {

          // cardpool: either an explicit list or a generated cube
          let [ common, uncommon, mythic, rare ] = cardpool.split('/').map(Number);
          cardpool = set.cube(set_code, cards, {
            mythic: mythic,
            rare: rare,
            uncommon: uncommon,
            common: common
          });
          
          // initialize
          commit("drafts/" + draft_id + "/" + START_DRAFT, {
            set_code,
            cardpool,
            options
          });

          // resolve promise
          resolve({ draft_id });
        });
    });
  },
};



