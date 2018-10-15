

import axios from 'axios';

import { INITIALIZE_BOOSTER, BOOSTER_TO_PILE, PILE_TO_PILE } from './mutations';

export const BEGIN_DRAFT = 'BEGIN_DRAFT';
export const PICK_CARD = 'PICK_CARD';
export const MOVE_CARD = 'MOVE_CARD';

export default {

  [BEGIN_DRAFT](context) {

    axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
      .then(response => {
        // generate a unique index/key for each card
        let key=1;
        let booster = response.data.cards.map(card => {
          return { ...card, key: key++ };
        });
        context.commit(INITIALIZE_BOOSTER, booster);
      });
  },

  [PICK_CARD](context, payload) {
    context.commit(BOOSTER_TO_PILE, payload);
  },

  [MOVE_CARD](context, payload) {
    context.commit(PILE_TO_PILE, payload);
  }
};



