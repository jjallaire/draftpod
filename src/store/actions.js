


import uuidv4 from 'uuid'

import { START_DRAFT } from './modules/draft/mutations';

import * as set from './modules/draft/set/'
import { useDraftModule } from '@/store'
import { firestore } from './firebase'
import { CARDPOOL } from '@/store/constants'

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
          commit("drafts/" + draft_id + "/" + START_DRAFT, {
            player_id: state.player.id,
            set_code,
            cardpool,
            options
          });

          // write to firestore
          let draft = state.drafts[draft_id];
          firestore.collection('drafts').doc(draft_id).set({
            set: draft.set,
            options: draft.options,
            table: JSON.stringify(draft.table)
          }).then(function() {
            resolve({ draft_id });
          })
          .catch(function() {
            // TODO: reject promise
            resolve({ draft_id });
          });
        });
    });
  },
};



