

import axios from 'axios';

import { GENERATE_BOOSTER, PICK_CARD } from './action-types';
import { SET_BOOSTER, ADD_CARD_TO_DECK } from './mutation-types';

export const actions = {

  [GENERATE_BOOSTER](context) {
    axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
    .then(response => {
      // generate a unique index/key for each card
      let key=1;
      let booster = response.data.cards.map(card => {
        return { ...card, key: key++ };
      });
      context.commit(SET_BOOSTER, booster);
    });
  },

  [PICK_CARD](context, card) {
    context.commit(ADD_CARD_TO_DECK, card);
  }
};

