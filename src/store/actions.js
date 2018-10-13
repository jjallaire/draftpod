

import axios from 'axios';

import { SET_BOOSTER, ADD_CARD_TO_DECK, MOVE_CARD_TO_PILE } from './mutations';

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
        context.commit(SET_BOOSTER, booster);
      });
  },

  [PICK_CARD](context, { card, pile }) {
    context.commit(ADD_CARD_TO_DECK, { card, pile });
  },

  [MOVE_CARD](context, { card, pile }) {
    context.commit(MOVE_CARD_TO_PILE, {card, pile});
  }
};



