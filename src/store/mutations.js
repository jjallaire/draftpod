

import Vue from 'vue'

export const SET_BOOSTER = 'SET_BOOSTER'
export const ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK'
export const MOVE_CARD_TO_PILE = 'MOVE_CARD_TO_PILE'

export default {

  [SET_BOOSTER](state, cards) {
    state.booster = cards;
  },
  
  [ADD_CARD_TO_DECK](state, {card, pileNumber, insertBefore}) {
    
    // remove from booster
    state.booster.splice(state.booster.indexOf(card), 1);
    
    // add to pile
    addCardToPile(state.deck.piles[pileNumber], card, insertBefore);
  },

  [MOVE_CARD_TO_PILE](state, {card, pileNumber, insertBefore}) {

    // alias target pile
    let targetPile = state.deck.piles[pileNumber];

    // update source location (if the source pile is the same
    // as the destination pile then we insert a clone which
    // we then delete after the update
    let insertPlaceholder = null;
    state.deck.piles.forEach(function(pile) {
      let index = pile.indexOf(card);
      if (index !== -1) {

        // if this came from a different pile then remove the card
        if (pile !== targetPile) {
          pile.splice(index, 1);
        


        // otherwise if it came from the same pile then insert 
        // a temporary clone which will remove after the add
        // (this is so we can use any passed insertBefore value
        // and have the indexes line up)
        } else {
          insertPlaceholder = Object.assign({}, card);
          Vue.set(pile, index, insertPlaceholder);
        }
      }
    });    

    // add to new pile
    addCardToPile(targetPile, card, insertBefore);

    // remove insertPlaceholder if we had one
    if (insertPlaceholder)
      targetPile.splice(targetPile.indexOf(insertPlaceholder), 1);

  },
};

function addCardToPile(pile, card, insertBefore) {
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card);
  else
    pile.push(card);
}



