

export const SET_BOOSTER = 'SET_BOOSTER'
export const ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK'

export default {

  [SET_BOOSTER](state, cards) {
    state.booster = cards;
  },
  
  [ADD_CARD_TO_DECK](state, {card, pile}) {
    state.booster.splice(state.booster.indexOf(card), 1);
    state.deck.piles[pile].push(card);
  }
};



