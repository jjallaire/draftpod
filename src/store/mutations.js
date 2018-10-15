

export const SET_NEXT_PACK = 'SET_NEXT_PACK'
export const PACK_TO_PILE = 'PACK_TO_PILE'
export const PILE_TO_PILE = 'PILE_TO_PILE'

export default {

  [SET_NEXT_PACK](state, packs) {
    
    // distribute packs
    for (let i=0; i<packs.length; i++)
      state.players[i].pack = packs[i];
    
    // update current pack/pick
    state.current_pack++;
    state.current_pick = 1;
  },

  [PACK_TO_PILE](state, { playerNumber, card, pileNumber, insertBefore }) {

    // alias player and pile
    let player = state.players[playerNumber];
    let pack = player.pack;
    let pile = player.piles[pileNumber];
   
    // remove from pack
    pack.splice(pack.indexOf(card), 1);

    // add to pile
    addCardToPile(pile, card, insertBefore);
  },

  [PILE_TO_PILE](state, { playerNumber, card, pileNumber, insertBefore }) {

    // alias player and pile
    let player = state.players[playerNumber];
    let pile = player.piles[pileNumber];

    // remove from existing pile if necessary (if it came from a
    // pack then we won't need to do this)
    player.piles.forEach(function (p) {

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



