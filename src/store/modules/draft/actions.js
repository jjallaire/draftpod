

import axios from 'axios'

import { 
  ENTER_DRAFT,
  NEXT_PACK, 
  PACK_TO_PICK, 
  AI_PICKS,
  PASS_PACKS, 
  SET_PICKS_COMPLETE,
  MOVE_PICKS_TO_DECK,
} from './mutations';

import * as set from './set/'

export const START_DRAFT = 'START_DRAFT'
export const PICK_CARD = 'PICK_CARD';
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

          // distribute next pack
          commit(NEXT_PACK);

          // resolve promise
          resolve({});
        });
    });
  },

  [CHECK_PICK_TIME]({state, dispatch}) {
    
      // auto-pick if we ran out of time 
      let player_id = state.player_id; 
      if (pickTimeExpired(state)) {

        // let the ai make the pick
        let draft = state.players[player_id].draft;
        let card = set.pick(state.cards.set_code, draft.piles[0], draft.pack);

        // dispatch it and move on to the next pick
        dispatch(PICK_CARD, {
          card: card,
          pile_number: 0, 
          insertBefore: null
        });
      }  
  },

  [PICK_CARD]({ commit, state }, pick) {

    // alias player
    let player_id = state.player_id;
    let player = state.players[player_id];
    
    // write the pick 
    commit(PACK_TO_PICK, { player_id: player_id, ...pick });

    // have other players make their picks
    commit(AI_PICKS, { player_id })

    // check whether the pack is completed
    if (player.draft.pack.length === 0) {

      // if we still have packs to go then create the next pack
      if (state.status.current_pack < 1)
        commit(NEXT_PACK);
      else {
        // move picks to deck
        commit(MOVE_PICKS_TO_DECK);

        // set picks complete
        commit(SET_PICKS_COMPLETE);
      }

    // pass the packs
    } else {
      commit(PASS_PACKS);
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


