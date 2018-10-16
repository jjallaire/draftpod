

import axios from 'axios'
import uuidv4 from 'uuid'

import { 
  SET_CARDPOOL,
  OPEN_PACKS, 
  PACK_TO_PILE, 
  PILE_TO_PILE, 
  PASS_PACKS, 
  COMPLETE_DRAFT
} from './mutations';

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
    for (let i=0; i<state.players.length; i++) {
      if (i !== playerNumber) {
        let player = state.players[i];
        let card = player.pack[0];
        commit(PACK_TO_PILE, { playerNumber: i, card: card, pileNumber: 0, insertBefore: null } );
      }
    }

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
  let packs = [...Array(8)].map(() => generateBooster(state.cardpool));

  // set them
  commit(OPEN_PACKS, packs);

}

function generateBooster(cardpool) {

  // generate range of indexes then shuffle it
  let indexes = shuffleArray([...Array(cardpool.cards.length).keys()]);

  // function to draw next n cards of a rarity
  function drawCards(rarity, number) {
    let cards = [];
    for (let i=0; i<indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool.cards[index];
      if (rarity.indexOf(card.rarity) >= 0 && !card.type_line.startsWith("Basic Land"))
        cards.push({...card, 
          key: uuidv4(), 
          imageUrl: "sets/" + cardpool.set + "/" + card.id + ".png" }
        );
      if (cards.length >= number)
        break;
    }
    return cards;
  }

  return [].concat(
    drawCards(["mythic", "rare"], 1),
    drawCards(["uncommon"], 3),
    drawCards(["common"], 10)
  );
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


