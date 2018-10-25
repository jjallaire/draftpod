export const INITIALIZE = 'INITIALIZE'
export const OPEN_PACKS = 'OPEN_PACKS'
export const SET_CARD_PREVIEW = 'SET_CARD_PREVIEW'
export const PACK_TO_PICK = 'PACK_TO_PICK'
export const MOVE_CARD_TO_PILE = 'MOVE_CARD_TO_PILE'
export const PASS_PACKS = 'PASS_PACKS'
export const MOVE_PICKS_TO_DECK = 'MOVE_PICKS_TO_DECK'
export const SET_DRAFT_COMPLETE = 'SET_DRAFT_COMPLETE'

import Vue from 'vue'

export default {

  [INITIALIZE](state, { set_code, cardpool }) {
    state.set_code = set_code;
    state.cardpool = cardpool;
  },

  [OPEN_PACKS](state, packs) {
    
    // distribute packs
    for (let i=0; i<packs.length; i++)
      state.players[i].pack = packs[i];
    
    // update current pack/pick
    state.current_pack++;
    state.current_pick = 1;
  },

  [SET_CARD_PREVIEW](state, { playerNumber, card } ) {
    let player = state.players[playerNumber];
    player.card_preview = card;
  },

  [PACK_TO_PICK](state, { playerNumber, card, pile, insertBefore }) {

    // alias player and pile
    let player = state.players[playerNumber];
    let pack = player.pack;
   
    // remove from pack
    pack.splice(pack.indexOf(card), 1);

    // add to pile
    addCardToPile(pile, card, insertBefore);
  },

  [MOVE_CARD_TO_PILE](state, { card, pile, piles, insertBefore }) {

    // remove from existing pile if necessary (if it came from a
    // pack then we won't need to do this)
    piles.forEach(function (p) {

      let index = p.indexOf(card);
      if (index !== -1) {

        // remove the card
        p.splice(index, 1);

        // if this is a re-order within the same pile then
        // we may need to offset the insertBefore index to 
        // reflect the removed card. 
        if (p === pile &&
          insertBefore !== null &&
          insertBefore > index) {
          insertBefore = insertBefore - 1;
        }
      }
    });

    // add to new pile
    addCardToPile(pile, card, insertBefore);
  },

  [PASS_PACKS](state) {

    // copy existing packs
    let packs = state.players.map((player) => player.pack);

    // pass pack
    if (state.current_pack === 2) {
      // pass right
      for (let i=(packs.length-1); i>0; i--)
        passPack(packs[i-1], state.players[i].pack);
      passPack(packs[packs.length-1], state.players[0].pack);

    } else {
      // pass left
      for (let i=0; i<(packs.length-1); i++)
        passPack(packs[i+1], state.players[i].pack);
      passPack(packs[0], state.players[packs.length-1].pack)
    }
    
    // increment pick
    state.current_pick++;
  },

  [MOVE_PICKS_TO_DECK](state, { playerNumber }) {
    let pick_piles = state.players[playerNumber].pick_piles;
    let deck_piles = state.players[playerNumber].deck_piles;
    let lands = deck_piles[6];
    pick_piles.slice(0, 7).forEach(function(pile) {
      pile.forEach(function(card) {
        if (card.type_line.includes("Land"))
          lands.push(card);
        else if (card.cmc <= 1)
          deck_piles[0].push(card);
        else if (card.cmd >= 6)
          deck_piles[6].push(card);
        else
          deck_piles[card.cmc-1].push(card);
      });
    });

    // sideboard
    deck_piles[7] = pick_piles[7].slice();
  },

  [SET_DRAFT_COMPLETE](state) {
    state.complete = true;
  }
};


function passPack(from, to) {
  for (let i = 0; i<from.length; i++) {
    Vue.set(to, i, from[i]);
  }
}

function addCardToPile(pile, card, insertBefore) {
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card);
  else
    pile.push(card);
}



