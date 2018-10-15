

export const SET_PACK = 'SET_PACK'
export const PACK_TO_PILE = 'PACK_TO_PILE'
export const PILE_TO_PILE = 'PILE_TO_PILE'

export default {

  [SET_PACK](state, cards) {
    state.players[0].pack = cards;
  },

  [PACK_TO_PILE](state, { card, pileNumber, insertBefore }) {

    // alias target pile
    let pile = state.players[0].piles[pileNumber];

    // remove from pack
    state.players[0].pack.splice(state.players[0].pack.indexOf(card), 1);

    // add to pile
    addCardToPile(pile, card, insertBefore);
  },

  [PILE_TO_PILE](state, { card, pileNumber, insertBefore }) {

    // alias target pile
    let pile = state.players[0].piles[pileNumber];

    // remove from existing pile if necessary (if it came from a
    // pack then we won't need to do this)
    state.players[0].piles.forEach(function (p) {

      let index = p.indexOf(card);
      if (index !== -1) {

        // remove the card
        p.splice(index, 1);

        // if this is a re-order within the same pile then
        // we may need to offset the insertBefore index to 
        // reflect the removed card. 
        if (p === pile &&
          insertBefore !== null &&
          insertBefore > index) {
          insertBefore = insertBefore - 1;
        }
      }
    });

    // add to new pile
    addCardToPile(pile, card, insertBefore);
  },
};

function addCardToPile(pile, card, insertBefore) {
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card);
  else
    pile.push(card);
}



