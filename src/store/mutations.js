

import { SET_BOOSTER, ADD_CARD_TO_DECK } from './mutation-types'

export const mutations = {

  [SET_BOOSTER](state, cards) {
    state.booster = cards;
  },
  
  [ADD_CARD_TO_DECK](state, card) {
    state.booster.splice(state.booster.indexOf(card), 1);
    state.deck.push(card);
  }
};



