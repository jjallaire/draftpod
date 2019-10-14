

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
        
        // add basics if the set requires them for boosters (e.g. M19, M20)
        // (users don't typically explicitly add basics for custom pools)
        cardpool_cards = cardpool_cards.concat(
          set.cardpool_basics(set_code).map(id => ({
            id,
            quantity: 10
          }))
        );
        
        // add cards from pool
        cardpool = [];
        cardpool_cards.forEach((cardpool_card) => {
          let card = set_cards.find((set_card) => set_card.id === cardpool_card.id);
          if (card)
            cardpool.push(...new Array(cardpool_card.quantity).fill(card));
        });

      } else if (cardpool.startsWith(CARDPOOL.CUBE)) {
        
        // generated cube
        let cube = cardpool.replace(CARDPOOL.CUBE, '');
        let [ common, uncommon, rare, mythic ] = cube.split('/').map(Number);
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