

import axios from 'axios'
import uuidv4 from 'uuid'

const debug = process.env.NODE_ENV !== 'production'
const local_images = debug

import { 
  SET_CARDPOOL,
  OPEN_PACKS, 
  PACK_TO_PILE, 
  PILE_TO_PILE, 
  PASS_PACKS, 
  COMPLETE_DRAFT
} from './mutations';

import sets from './sets/'

export const START_DRAFT = 'START_DRAFT'
export const NEXT_PACK = 'NEXT_PACK';
export const PICK_CARD = 'PICK_CARD';
export const MOVE_CARD = 'MOVE_CARD';

export default {

  [START_DRAFT]( { commit, state }, payload ) {

    // determine set
    let set = payload.set;

    // download cardpool
    axios.get('sets/' + set + '/cards.json')
      .then(response => {

        // set the cardpool
        commit(SET_CARDPOOL, {
          set: set,
          cards: response.data
        });

        // distribute next pack
        nextPack(commit, state);
      });


  },

  [PICK_CARD]({ commit, state }, payload) {
    
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
        nextPack(commit, state);
      else {
        // otherwise the draft is done!
        commit(COMPLETE_DRAFT);
      }

    // pass the packs
    } else {
      commit(PASS_PACKS);
    }
  },

  [MOVE_CARD]({ commit }, payload) {
    commit(PILE_TO_PILE, payload);
  }
};

function nextPack(commit, state) {

  // generate 8 boosters
  let packs = [...Array(8)].map(() => booster(state.cardpool));

  // set them
  commit(OPEN_PACKS, packs);

}

function aiPicks(commit, state, playerNumber) {
  let set = sets[state.cardpool.set];
  for (let i=0; i<state.players.length; i++) {
    if (i !== playerNumber) {
      let player = state.players[i];
      let card = set.pick(player.piles[0], player.pack);
      commit(PACK_TO_PILE, { 
        playerNumber: i, 
        card: card, 
        pileNumber: 0, 
        insertBefore: null 
      });
    }
  }
}

function booster(cardpool) {

  // generate range of indexes then shuffle it
  let indexes = shuffleArray([...Array(cardpool.cards.length).keys()]);

  // function to draw next n cards that pass a set of filters
  function cards(filters, number) {
    if (!Array.isArray(filters))
      filters = [filters];
    let cards = [];
    for (let i=0; i<indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool.cards[index];
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
                  'sets/' + cardpool.set + '/' + card.id + '.png' :
                  card.image_uris.png,
        });
      }
      if (cards.length >= number)
        break;
    }
    return cards;
  }

  let set = sets[cardpool.set];
  return set.booster(cards);
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

