
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
          
          if (cardpool !== null) {
            
            // note: a custom cardpool needs to operate just off of multiverse ids
            // and quantities

          } else {

            cardpool = set.cube(set_code, cardsInSet, {
              mythic: 1,
              rare: 2,
              uncommon: 3,
              common: 4
            });

          }
          
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



