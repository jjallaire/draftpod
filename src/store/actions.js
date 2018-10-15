

import axios from 'axios';

import { SET_NEXT_PACK, PACK_TO_PILE, PILE_TO_PILE } from './mutations';

export const NEXT_PACK = 'NEXT_PACK';
export const PICK_CARD = 'PICK_CARD';
export const MOVE_CARD = 'MOVE_CARD';

export default {

  [NEXT_PACK](context) {

    // create promises for booster generation requests
    let key = 1;
    let packs = Array(8);
    let promises = [];
    for (let i = 0; i<packs.length; i++) {
      promises.push(
        axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
          .then(response => {
            packs[i] = response.data.cards.map((card) => {
              return { ...card, key: key++ };
            });
          })
      );
    };

    // make the requests then distribute the packs
    axios.all(promises).then(() =>
      context.commit(SET_NEXT_PACK, packs)
    );
  },

  [PICK_CARD](context, payload) {
    context.commit(PACK_TO_PILE, payload);
  },

  [MOVE_CARD](context, payload) {
    context.commit(PILE_TO_PILE, payload);
  }
};



