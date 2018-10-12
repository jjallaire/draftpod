

import axios from 'axios';

import { CLEAR_ALL, SET_BOOSTER, ADD_CARD_TO_DECK } from './mutations';

export const BEGIN_DRAFT = 'BEGIN_DRAFT';
export const PICK_CARD = 'PICK_CARD';

export default {

  [BEGIN_DRAFT](context) {

    context.commit(CLEAR_ALL);

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



