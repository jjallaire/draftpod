

import axios from 'axios'

import { 
  ENTER_DRAFT,
  UPDATE_CURRENT_TIME,
  OPEN_PACKS, 
  PACK_TO_PICK, 
  PASS_PACKS, 
  SET_PICKS_COMPLETE,
  MOVE_PICKS_TO_DECK,
  APPLY_AUTO_LANDS,
  SET_CARD_PREVIEW
} from './mutations';

import * as set from './set/'

export const INITIALIZE_STORE = 'INITIALIZE_STORE'
export const START_DRAFT = 'START_DRAFT'
export const NEXT_PACK = 'NEXT_PACK';
export const PICK_CARD = 'PICK_CARD';
export const PICK_TIMER = 'PICK_TIMER'

export default {

  [INITIALIZE_STORE]( { dispatch }, { playerNumber }) {
    
    // arrange for pick timer tick
    setInterval(() => dispatch(PICK_TIMER, { playerNumber }), 1000);

  },

  [START_DRAFT]( { commit, state }, {playerNumber, set_code, pick_timer, pick_analysis} ) {

    // download cardpool
    axios.get('sets/' + set_code + '/cards.json')
      .then(response => {

        // initialize
        commit(ENTER_DRAFT, {
          set_code,
          cardpool: response.data,
          pick_timer,
          pick_analysis,
        });

        // distribute next pack
        nextPack(commit, state, playerNumber);
      });


  },

  [PICK_TIMER]({commit, state, getters}, { playerNumber }) {
    
      // first update the current time
      commit(UPDATE_CURRENT_TIME);

      // auto-pick if we ran out of time  
      if (getters.pick_time_expired) {

        // let the ai make the pick
        let draft = getters.draft(playerNumber);
        let card = set.pick(state.set_code, draft.piles[0], draft.pack);

        // dispatch it and move on to the next pick
        pickCard(commit, state, {
          playerNumber: playerNumber,
          card: card,
          pile: draft.piles[0], 
          insertBefore: null
        });
      }  
  },

  [PICK_CARD]({ commit, state }, pick) {
    pickCard(commit, state, pick);
  },
};


function pickCard(commit, state, pick) {

  // alias player
  let playerNumber = pick.playerNumber;
  let player = state.players[playerNumber];

  // write the pick 
  commit(PACK_TO_PICK, pick);

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

      // apply auto lands
      commit(APPLY_AUTO_LANDS, { playerNumber });

      // delay to allow UI state to update before starting
      // completion-based animations
      setTimeout(()=> { commit(SET_PICKS_COMPLETE, { playerNumber }); }, 100)
    }

  // pass the packs
  } else {
    commit(PASS_PACKS);
  }
}

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





