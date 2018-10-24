

import axios from 'axios'
import uuidv4 from 'uuid'

const local_images = true

import { 
  INITIALIZE,
  OPEN_PACKS, 
  PACK_TO_PILE, 
  PILE_TO_PILE, 
  PASS_PACKS, 
  SET_DRAFT_COMPLETE,
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
    commit(PACK_TO_PILE, payload);

    // have other players make their picks
    aiPicks(commit, state, playerNumber);

    // check whether the pack is completed
    if (player.pack.length === 0) {

      // if we still have packs to go then create the next pack
      if (state.current_pack < 3)
        nextPack(commit, state, playerNumber);
      else {
        // otherwise the draft is done!
        dispatch(COMPLETE_DRAFT);
      }

    // pass the packs
    } else {
      commit(PASS_PACKS);
    }
  },

  [MOVE_CARD]({ commit }, payload) {
    commit(PILE_TO_PILE, payload);
  },

  [COMPLETE_DRAFT]({ commit }) {

    // delay to allow UI state to update before starting
    // completion-based animations
    setTimeout(()=> { commit(SET_DRAFT_COMPLETE); }, 100)
    
  }
};

function nextPack(commit, state, playerNumber) {

  // generate 8 boosters
  let packs = [...Array(8)].map(() => booster(state.set_code, state.cardpool));

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
      let card = set.pick(state.set_code, player.picks.piles[0], player.pack);
      commit(PACK_TO_PILE, { 
        playerNumber: i, 
        card: card, 
        pileNumber: 0, 
        insertBefore: null 
      });
    }
  }
}

function booster(set_code, cardpool) {

  // generate range of indexes then shuffle it
  let indexes = shuffleArray([...Array(cardpool.length).keys()]);

  // function to draw next n cards that pass a set of filters
  function cards(filters, number) {
    if (!Array.isArray(filters))
      filters = [filters];
    let cards = [];
    for (let i=0; i<indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool[index];
      let passed = true;
      for (let f=0; f<filters.length; f++) {
        if (!filters[f](card)) {
          passed = false;
          break;
        }
      }
      if (passed) {
        cards.push({...card, 
          key: uuidv4(), 
          image: local_images ? 
                  'sets/' + set_code + '/' + card.id + '.png' :
                  card.image_uri,
        });
      }
      if (cards.length >= number)
        break;
    }
    return cards;
  }

  return set.booster(set_code, cards);
}


function shuffleArray(a) {
  let array = a.slice();
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

