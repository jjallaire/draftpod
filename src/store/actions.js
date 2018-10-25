

import axios from 'axios'

import { 
  INITIALIZE,
  OPEN_PACKS, 
  PACK_TO_PICK, 
  MOVE_CARD_TO_PILE, 
  PASS_PACKS, 
  SET_DRAFT_COMPLETE,
  MOVE_PICKS_TO_DECK,
  SET_CARD_PREVIEW
} from './mutations';

import * as set from './set/'

export const START_DRAFT = 'START_DRAFT'
export const NEXT_PACK = 'NEXT_PACK';
export const PICK_CARD = 'PICK_CARD';
export const MOVE_CARD = 'MOVE_CARD';
export const COMPLETE_DRAFT = 'COMPLETE_DRAFT';

export default {

  [START_DRAFT]( { commit, state }, {playerNumber, set_code} ) {

    // download cardpool
    axios.get('sets/' + set_code + '/cards.json')
      .then(response => {

        // initialize
        commit(INITIALIZE, {
          set_code: set_code,
          cardpool: response.data
        });

        // distribute next pack
        nextPack(commit, state, playerNumber);
      });


  },

  [PICK_CARD]({ commit, dispatch, state }, payload) {
    
    // alias player
    let playerNumber = payload.playerNumber;
    let player = state.players[playerNumber];

    // write the pick 
    commit(PACK_TO_PICK, payload);

    // have other players make their picks
    aiPicks(commit, state, playerNumber);

    // check whether the pack is completed
    if (player.pack.length === 0) {

      // if we still have packs to go then create the next pack
      if (state.current_pack < 3)
        nextPack(commit, state, playerNumber);
      else {
        // otherwise the draft is done!
        commit(MOVE_PICKS_TO_DECK, { playerNumber });
        dispatch(COMPLETE_DRAFT);
      }

    // pass the packs
    } else {
      commit(PASS_PACKS);
    }
  },

  [MOVE_CARD]({ commit }, payload) {
    commit(MOVE_CARD_TO_PILE, payload);
  },

  [COMPLETE_DRAFT]({ commit }) {

    // delay to allow UI state to update before starting
    // completion-based animations
    setTimeout(()=> { commit(SET_DRAFT_COMPLETE); }, 100)
    
  }
};

function nextPack(commit, state, playerNumber) {

  // grab next set of packs
  let pack_begin = state.current_pack * 8;
  let pack_end = pack_begin + 8;
  let packs = state.all_packs.slice(pack_begin, pack_end);

  // set them
  commit(OPEN_PACKS, packs);

  // set the current preview to the first card in the pack
  commit(SET_CARD_PREVIEW, {
    playerNumber: playerNumber,
    card: state.players[playerNumber].pack[0],
  });

}

function aiPicks(commit, state, playerNumber) {
  for (let i=0; i<state.players.length; i++) {
    if (i !== playerNumber) {
      let player = state.players[i];
      let card = set.pick(state.set_code, player.pick_piles[0], player.pack);
      commit(PACK_TO_PICK, { 
        playerNumber: i, 
        card: card, 
        pile: state.players[i].pick_piles[0], 
        insertBefore: null 
      });
    }
  }
}



