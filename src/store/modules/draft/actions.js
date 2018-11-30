
import axios from 'axios'

import { 
  ENTER_DRAFT,
} from './mutations';

import * as set from './set/'

export const START_DRAFT = 'START_DRAFT'

export default {

  [START_DRAFT]( { commit }, {set_code, cardpool, pick_timer, pick_analysis} ) {

    // eslint-disable-next-line
    return new Promise((resolve, reject) => {

      // download set data
      axios.get('/sets/' + set_code + '/cards.json')
        .then(response => {

          // all cards in the set
          let cardsInSet = response.data;

          // cardpool: either an explicit list or a generated cube
          let [ common, uncommon, mythic, rare ] = cardpool.split('/').map(Number);
          cardpool = set.cube(set_code, cardsInSet, {
            mythic: mythic,
            rare: rare,
            uncommon: uncommon,
            common: common
          });
          
          // initialize
          commit(ENTER_DRAFT, {
            set_code,
            cardpool: cardpool,
            options: {
              pick_timer,
              pick_analysis,
            }
          });

          // resolve promise
          resolve({});
        });
    });
  },
};



