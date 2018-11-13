
import axios from 'axios'

import { 
  ENTER_DRAFT,
  PICK_CARD,
} from './mutations';

import * as set from './set/'

export const START_DRAFT = 'START_DRAFT'
export const CHECK_PICK_TIME = 'CHECK_PICK_TIME'

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

  [CHECK_PICK_TIME]({ state, commit }) {
    
      // auto-pick if we ran out of time 
      if (pickTimeExpired(state)) {

        // let the ai make the pick
        let draft = state.draft;
        let card = set.pick(state.cards.set_code, draft.piles[0], draft.pack);

        // dispatch it and move on to the next pick
        commit(PICK_CARD, {
          card: card,
          pile_number: 0, 
          insertBefore: null
        });
      }  
  },
};


function pickTimeExpired(state) {
  let status = state.status;
  let time_remaining = Math.round((status.pick_end_time - new Date().getTime()) / 1000);
  return state.options.pick_timer &&
          !status.picks_complete &&
          status.current_pack > 0 && 
          status.current_pick > 0 &&
          time_remaining < 0;
}


