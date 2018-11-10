

import axios from 'axios'

import { 
  ENTER_DRAFT,
  OPEN_PACKS, 
  PACK_TO_PICK, 
  PASS_PACKS, 
  SET_PICKS_COMPLETE,
  MOVE_PICKS_TO_DECK,
} from './mutations';

import * as set from './set/'

export const START_DRAFT = 'START_DRAFT'
export const NEXT_PACK = 'NEXT_PACK';
export const PICK_CARD = 'PICK_CARD';
export const PICK_TIMER = 'PICK_TIMER'

export default {

  [START_DRAFT]( { commit, state }, {set_code, pick_timer, pick_analysis} ) {

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
          nextPack(commit, state);

          // resolve promise
          resolve({});
        });
    });
  },

  [PICK_TIMER]({commit, state}, { player_id }) {
    
      // auto-pick if we ran out of time  
      if (pickTimeExpired(state)) {

        // let the ai make the pick
        let draft = state.players[player_id].draft;
        let card = set.pick(state.cards.set_code, draft.piles[0], draft.pack);

        // dispatch it and move on to the next pick
        pickCard(commit, state, {
          player_id: player_id,
          card: card,
          pile_number: 0, 
          insertBefore: null
        });
      }  
  },

  [PICK_CARD]({ commit, state }, pick) {
    pickCard(commit, state, pick);
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

function pickCard(commit, state, pick) {

  // alias player
  let player_id = pick.player_id;
  let player = state.players[player_id];
  
  // write the pick 
  commit(PACK_TO_PICK, pick);

  // have other players make their picks
  aiPicks(commit, state, player_id);

  // check whether the pack is completed
  if (player.draft.pack.length === 0) {

    // if we still have packs to go then create the next pack
    if (state.status.current_pack < 1)
      nextPack(commit, state);
    else {
      // move picks to deck
      commit(MOVE_PICKS_TO_DECK, { player_id });

      // delay to allow UI state to update before starting
      // completion-based animations
      setTimeout(()=> { commit(SET_PICKS_COMPLETE, { player_id }); }, 100)
    }

  // pass the packs
  } else {
    commit(PASS_PACKS);
  }
}

function nextPack(commit, state) {

  // grab next set of packs
  let pack_begin = state.status.current_pack * 8;
  let pack_end = pack_begin + 8;
  let packs = state.cards.all_packs.slice(pack_begin, pack_end);

  // set them
  commit(OPEN_PACKS, packs);
}

function aiPicks(commit, state, player_id) {
  for (let i=0; i<state.players.length; i++) {
    if (i !== player_id) {
      let player = state.players[i];
      let draft = player.draft;
      let card = set.pick(state.cards.set_code, draft.piles[0], draft.pack);
      commit(PACK_TO_PICK, { 
        player_id: i, 
        card: card, 
        pile_number: 0, 
        insertBefore: null 
      });
    }
  }
}





