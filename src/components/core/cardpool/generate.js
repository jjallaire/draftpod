

import * as set from '@/store/modules/draft/set/'

import { store } from '@/store'

import { CARDPOOL } from '@/store/constants'

export function generateCardpool(set_code, cardpool) {

  return set.cards(set_code)
    .then(set_cards => {

      // resolve the cardpool
      if (cardpool.startsWith(CARDPOOL.CUSTOM)) {
        
        // lookup named cardpool
        let custom = cardpool.replace(CARDPOOL.CUSTOM, '');
        let cardpool_cards = store.getters.cardpool(set_code,custom).cards;
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

      return cardpool;
    });
}