


import shortUuid from 'short-uuid'

import { CREATE_DRAFT } from './modules/draft/mutations';

import * as set from './modules/draft/set/'
import firestore from './modules/draft/firestore'
import { useDraftModule } from '@/store'
import { CARDPOOL } from '@/store/constants'

export const INIT_DRAFT = 'INIT_DRAFT'

export default {

  [INIT_DRAFT]( { commit, state }, { set_code, cardpool, options } ) {

    // create a new draft module
    let draft_id = shortUuid().new();
    useDraftModule(draft_id);

    // download/generate cardpool and return draft_id
    return new Promise((resolve, reject) => {

      // download set data
      set.cards(set_code)
        .then(set_cards => {

          // resolve the cardpool
          if (cardpool.startsWith(CARDPOOL.CUSTOM)) {
            
            // lookup named cardpool
            let custom = cardpool.replace(CARDPOOL.CUSTOM, '');
            let cardpool_cards = state.cardpools[set_code][custom].cards;
            cardpool = [];
            cardpool_cards.forEach((cardpool_card) => {
              let card = set_cards.find((set_card) => set_card.id === cardpool_card.id);
              if (card)
                cardpool.push(...new Array(cardpool_card.quantity).fill(card));
            });

          } else if (cardpool.startsWith(CARDPOOL.CUBE)) {
            
            // generated cube
            let cube = cardpool.replace(CARDPOOL.CUBE, '');
            let [ common, uncommon, mythic, rare ] = cube.split('/').map(Number);
            cardpool = set.cube(set_code, set_cards, {
              mythic: mythic,
              rare: rare,
              uncommon: uncommon,
              common: common
            });

          }

          // initialize
          commit("drafts/" + draft_id + "/" + CREATE_DRAFT, {
            id: draft_id,
            player: state.player,
            set_code,
            cardpool,
            options
          });

          // write to firestore if requested
          if (options.multi_player) {
            firestore.createDraft(draft_id, state.drafts[draft_id])
              .then(function() {
                resolve({ draft_id });
              })
              .catch(function(error) {
                reject(error);
              });
          } else {
            resolve({ draft_id });
          }      
        });
    });
  },
};



