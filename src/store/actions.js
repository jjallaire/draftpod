


import shortUuid from 'short-uuid'

import { CREATE_DRAFT } from './modules/draft/mutations';

import * as set from './modules/draft/set/'
import firestore from './modules/draft/firestore'
import { useDraftModule } from '@/store'
import { CARDPOOL } from '@/store/constants'

export const INIT_DRAFT = 'INIT_DRAFT'

export default {

  [INIT_DRAFT]( { commit, state }, { set_code, cardpool, options = {}, targetStore = null }  ) {

    // create a new draft module
    let draft_id = shortUuid().new();
    useDraftModule(draft_id, {}, targetStore);

    // download set data
    return set.cards(set_code)
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

        // fail if we didn't get enough cards per pack
        let draft = state.drafts[draft_id];
        if (draft.table.all_packs.find(pack => pack.length !== set.pack_cards(set_code, options.number_of_packs))) {
          return Promise.reject(
            new Error("The cardpool did not have enough cards to make " + 
                      (draft.options.number_of_packs) * 8 + " booster packs.")
          );
        }

        // write to firestore if requested
        if (options.multi_player) {
          return firestore.createDraft(draft_id, state.drafts[draft_id]);
        } else {
          return draft_id ;
        }      
      });
  },
};



