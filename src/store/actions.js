


import uuidv4 from 'uuid'

import { START_DRAFT } from './modules/draft/mutations';

import * as set from './modules/draft/set/'
import { useDraftModule } from '@/store'

export const CREATE_DRAFT = 'CREATE_DRAFT'

export default {

  [CREATE_DRAFT]( { commit, state }, { set_code, cardpool, options } ) {

    // create a new draft module
    let draft_id = uuidv4();
    useDraftModule(draft_id);

    // download/generate cardpool and return draft_id
    return new Promise((resolve) => {

      // download set data
      set.cards(set_code)
        .then(set_cards => {

          // resolve the cardpool
          if (cardpool.startsWith('cardpool:')) {
            
            // lookup named cardpool
            let name = cardpool.replace(/^cardpool:/, '');
            let cardpool_cards = state.cardpools[set_code][name].cards;
            cardpool = [];
            cardpool_cards.forEach((cardpool_card) => {
              let card = set_cards.find((set_card) => set_card.id === cardpool_card.id);
              if (card)
                cardpool.push(...new Array(cardpool_card.quantity).fill(card));
            });

          } else {
            
            // generated cube
            let [ common, uncommon, mythic, rare ] = cardpool.split('/').map(Number);
            cardpool = set.cube(set_code, set_cards, {
              mythic: mythic,
              rare: rare,
              uncommon: uncommon,
              common: common
            });

          }

          // initialize
          commit("drafts/" + draft_id + "/" + START_DRAFT, {
            set_code,
            cardpool,
            options
          });

          // resolve promise
          resolve({ draft_id });
        });
    });
  },
};



