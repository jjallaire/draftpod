

export const CLEAR_ALL = 'CLEAR_ALL'
export const SET_BOOSTER = 'SET_BOOSTER'
export const ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK'

export default {

  [CLEAR_ALL](state) {
    state.booster = [];
    state.cards = [];
  },

  [SET_BOOSTER](state, cards) {
    state.booster = cards;
  },
  
  [ADD_CARD_TO_DECK](state, card) {
    state.booster.splice(state.booster.indexOf(card), 1);
    state.deck.push(card);
  }
};



