
import axios from 'axios'

import { 
  ENTER_DRAFT,
} from './mutations';

export const START_DRAFT = 'START_DRAFT'

export default {

  [START_DRAFT]( { commit }, {set_code, pick_timer, pick_analysis} ) {

    // eslint-disable-next-line
    return new Promise((resolve, reject) => {

      // download cardpool
      axios.get('/sets/' + set_code + '/cards.json')
        .then(response => {

          // initialize
          commit(ENTER_DRAFT, {
            set_code,
            cardpool: response.data,
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



