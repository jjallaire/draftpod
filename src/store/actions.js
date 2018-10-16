

import axios from 'axios'
import uuidv4 from 'uuid'

import { 
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

  [START_DRAFT]( { commit }) {
    nextPack(commit);
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
        nextPack(commit);
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

function nextPack(commit) {

  // create promises for booster generation requests
  let packs = Array(8);
  let promises = [];
  for (let i = 0; i<packs.length; i++) {
    promises.push(
      axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
        .then(response => {
          packs[i] = response.data.cards.filter((card) => {
            return card.rarity !== "Basic Land";
          });
          packs[i] = packs[i].map((card) => {
            return { ...card, key: uuidv4() };
          });
        })
    );
  }

  // make the requests then distribute the packs
  axios.all(promises).then(() =>
    commit(OPEN_PACKS, packs)
  );
}


