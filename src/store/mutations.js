

export const SET_BOOSTER = 'SET_BOOSTER'
export const BOOSTER_TO_PILE = 'BOOSTER_TO_PILE'
export const PILE_TO_PILE = 'PILE_TO_PILE'

export default {

  [SET_BOOSTER](state, cards) {
    state.booster = cards;
  },
  
  [BOOSTER_TO_PILE](state, {card, pileNumber, insertBefore}) {
    
    // remove from booster
    state.booster.splice(state.booster.indexOf(card), 1);
    
    // add to pile
    addCardToPile(state.deck.piles[pileNumber], card, insertBefore);
  },

  [PILE_TO_PILE](state, {card, pileNumber, insertBefore}) {

    // alias target pile
    let targetPile = state.deck.piles[pileNumber];

    // remove from existing pile if necessary (if it came from a
    // booster then we won't need to do this)
    state.deck.piles.forEach(function(pile) {
      
      let index = pile.indexOf(card);
      if (index !== -1) {

        // remove the card
        pile.splice(index, 1);
        
        // if this is a re-order within the same pile then
        // we may need to offset the insertBefore index to 
        // reflect the removed card. 
        if (pile === targetPile && 
            insertBefore !== null && 
            insertBefore > index) {
          insertBefore = insertBefore - 1;
        }
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



