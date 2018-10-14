

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

    // move/relocate in existing pile if necessary
    state.deck.piles.forEach(function(pile) {
      let index = pile.indexOf(card);
      if (index !== -1) {

        // remove the card
        pile.splice(index, 1);
        
        // if there is an insertBefore and it's gt the index 
        // then subtract 1 from the index to relfect the 
        // removed card
        if (insertBefore !== null && insertBefore > index)
          insertBefore--;
      }
    });    

    // add to new pile
    addCardToPile(targetPile, card, insertBefore);
  },
};

function addCardToPile(pile, card, insertBefore) {
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card);
  else
    pile.push(card);
}



