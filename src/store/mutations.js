

export const SET_BOOSTER = 'SET_BOOSTER'
export const ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK'
export const MOVE_CARD_TO_PILE = 'MOVE_CARD_TO_PILE'

export default {

  [SET_BOOSTER](state, cards) {
    state.booster = cards;
  },
  
  [ADD_CARD_TO_DECK](state, {card, pile}) {
    // remove from booster
    state.booster.splice(state.booster.indexOf(card), 1);
    // add to pile
    state.deck.piles[pile].push(card);
  },

  [MOVE_CARD_TO_PILE](state, {card, pile}) {
    // remove from any existing pile
    state.deck.piles.forEach(function(pile) {
      let index = pile.indexOf(card);
      if (index !== -1)
        pile.splice(index, 1);
    });    
    // add to new pile
    state.deck.piles[pile].push(card);
  }
};



