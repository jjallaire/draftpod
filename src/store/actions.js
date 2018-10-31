

import axios from 'axios'

import { 
  INITIALIZE,
  OPEN_PACKS, 
  PACK_TO_PICK, 
  PASS_PACKS, 
  SET_PICKS_COMPLETE,
  MOVE_PICKS_TO_DECK,
  SET_CARD_PREVIEW
} from './mutations';

import * as set from './set/'

export const START_DRAFT = 'START_DRAFT'
export const NEXT_PACK = 'NEXT_PACK';
export const PICK_CARD = 'PICK_CARD';

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

  [PICK_CARD]({ commit, state }, payload) {
    
    // alias player
    let playerNumber = payload.playerNumber;
    let player = state.players[playerNumber];

    // write the pick 
    commit(PACK_TO_PICK, payload);

    // have other players make their picks
    aiPicks(commit, state, playerNumber);

    // check whether the pack is completed
    if (player.draft.pack.length === 0) {

      // if we still have packs to go then create the next pack
      if (state.current_pack < 1)
        nextPack(commit, state, playerNumber);
      else {
        // move picks to deck
        commit(MOVE_PICKS_TO_DECK, { playerNumber });

        // delay to allow UI state to update before starting
        // completion-based animations
        setTimeout(()=> { commit(SET_PICKS_COMPLETE); }, 100)
      }

    // pass the packs
    } else {
      commit(PASS_PACKS);
    }
  },
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
    card: state.players[playerNumber].draft.pack[0],
  });

}

function aiPicks(commit, state, playerNumber) {
  for (let i=0; i<state.players.length; i++) {
    if (i !== playerNumber) {
      let player = state.players[i];
      let draft = player.draft;
      let card = set.pick(state.set_code, draft.piles[0], draft.pack);
      commit(PACK_TO_PICK, { 
        playerNumber: i, 
        card: card, 
        pile: state.players[i].draft.piles[0], 
        insertBefore: null 
      });
    }
  }
}



