export const INITIALIZE = 'INITIALIZE'
export const OPEN_PACKS = 'OPEN_PACKS'
export const SET_CARD_PREVIEW = 'SET_CARD_PREVIEW'
export const PACK_TO_PICK = 'PACK_TO_PICK'
export const MOVE_TO_PILE = 'MOVE_TO_PILE'
export const PASS_PACKS = 'PASS_PACKS'
export const MOVE_PICKS_TO_DECK = 'MOVE_PICKS_TO_DECK'
export const SET_PICKS_COMPLETE = 'SET_PICKS_COMPLETE'
export const MOVE_TO_DECK = 'MOVE_TO_DECK'

import Vue from 'vue'

import uuidv4 from 'uuid'
import * as set from './set/'
import * as filters from './card-filters'

const local_images = false

export default {

  [INITIALIZE](state, { set_code, cardpool }) {
    state.set_code = set_code;
    state.cardpool = cardpool;
    state.all_packs = [...Array(24)].map(function() {
      return booster(state.set_code, state.cardpool);
    });
  },

  [OPEN_PACKS](state, packs) {
    
    // distribute packs
    for (let i=0; i<packs.length; i++)
      state.players[i].draft.pack = packs[i];
    
    // update current pack/pick
    state.current_pack++;
    state.current_pick = 1;
  },

  [SET_CARD_PREVIEW](state, { playerNumber, card } ) {
    let player = state.players[playerNumber];
    player.card_preview = card;
  },

  [PACK_TO_PICK](state, { playerNumber, card, pile, insertBefore }) {

    // alias player and pile
    let player = state.players[playerNumber];
    let pack = player.draft.pack;
   
    // remove from pack
    pack.splice(pack.indexOf(card), 1);

    // add to pile
    addCardToPile(pile, card, insertBefore);
  },

  [MOVE_TO_PILE](state, { card, pile, piles, insertBefore }) {

    // remove from existing pile if necessary (if it came from a
    // pack then we won't need to do this)
    piles.forEach(function (p) {

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


  // TODO: auto lands not computed when moving to sidebaord


  [PASS_PACKS](state) {

    // copy existing packs
    let packs = state.players.map((player) => player.draft.pack);

    // pass pack
    if (state.current_pack === 2) {
      // pass right
      for (let i=(packs.length-1); i>0; i--)
        passPack(packs[i-1], state.players[i].draft.pack);
      passPack(packs[packs.length-1], state.players[0].draft.pack);

    } else {
      // pass left
      for (let i=0; i<(packs.length-1); i++)
        passPack(packs[i+1], state.players[i].draft.pack);
      passPack(packs[0], state.players[packs.length-1].draft.pack)
    }
    
    // increment pick
    state.current_pick++;
  },

  [MOVE_PICKS_TO_DECK](state, { playerNumber }) {
    let draft = state.players[playerNumber].draft;
    let deck = state.players[playerNumber].deck;
    draft.piles.slice(0, 7).forEach(function(pile) {
      pile.forEach((c) => cardToDeckPile(c, deck));
    });

    // sideboard
    deck.piles[7] = draft.piles[7].slice();

    // clear out draft piles
    draft.piles = [...Array(8)].map(() => Array());

    // sort all deck piles
    deck.piles.forEach((pile) => pile.sort(orderCards));

    // auto-lands if necessary
    if (deck.auto_lands)
      deck.basic_lands = computeAutoLands(deck);
  },

  [SET_PICKS_COMPLETE](state) {
    state.picks_complete = true;
  },

  [MOVE_TO_DECK](state, { card, playerNumber }) {
    // remove from sideboard
    let deck = state.players[playerNumber].deck;
    let sideboard = deck.piles[7];
    sideboard.splice(sideboard.indexOf(card), 1);

    // card to deck pile
    let pile = cardToDeckPile(card, deck);
    pile.sort(orderCards);

    // auto-lands if necessary
    if (deck.auto_lands)
      deck.basic_lands = computeAutoLands(deck);
  }
};


function cardToDeckPile(c, deck) {

  // add card to pile
  let card = {...c, key: uuidv4()};
  let deck_piles = deck.piles;
  let pile = null;
  if (filters.land(card))
    pile = deck_piles[6];
  else if (card.cmc <= 1)
    pile = deck_piles[0];
  else if (card.cmc>= 6)
    pile = deck_piles[5];
  else
    pile = deck_piles[card.cmc-1];
  pile.push(card);

  // return the pile
  return pile;
}

// TODO: main deck to sideboard recompute
// TODO: compute based on many symbols
// TODO: sort mana by total
// TODO: show total up top
// TODO: nerfs and buffs if we don't hit target

function computeAutoLands(deck) {

  // some shared reducers
  function countReducer(accumulator, count) {
    return accumulator + count;
  }
  function colorReducer(accumulator, card) {
    for (let i=0; i<card.colors.length; i++) 
      accumulator[card.colors[i]]++;
    return accumulator;
  }

  // first count the cards in each color
  let cards = deck.piles.slice(0, 6).flat();
  let card_colors = { R: 0, W: 0, B: 0, U: 0, G: 0 };
  card_colors = cards.reduce(colorReducer, card_colors);

  // compute the target number of mana sources we need in our mana base
  const total_land_cards = 17;
  let total_card_colors = Object.keys(card_colors).map(val => card_colors[val]).reduce(countReducer, 0);
  let mana_targets = {};
  Object.keys(card_colors).map(
    (color) => mana_targets[color] = (card_colors[color]/total_card_colors) * total_land_cards
  );

  // now count existing sources of mana (e.g. dual lands)
  let lands = deck.piles[6];
  let mana_existing = { R: 0, W: 0, B: 0, U: 0, G: 0 };
  mana_existing = lands.reduce(colorReducer, mana_existing);

  // adjust for existing mana sources 
  let mana_required = {};
  Object.keys(mana_targets).map(
    (color) => mana_required[color] = Math.max(mana_targets[color] - mana_existing[color], 0)
  )

  // take total after adjustment (used to calculate new % values)
  let total_mana_required = Object.keys(mana_required)
    .map(color => mana_required[color])
    .reduce(countReducer, 0);

  // yield basic lands
  let land_cards_remaining = total_land_cards - lands.length;
  let basic_lands = {};
  Object.keys(mana_required).map(
    (color) => basic_lands[color] = Math.round((mana_required[color]/total_mana_required) * land_cards_remaining)
  );
  
  return basic_lands;
}

function orderCards(a, b) {

  let aIsCreature = filters.creature(a);
  let bIsCreature = filters.creature(b);

  if (aIsCreature === bIsCreature) {
    if (a.name < b.name)
      return -1;
    else if (b.name < a.name)
      return 1;
    else
      return 0;
  } else if (aIsCreature && !bIsCreature)
    return -1;
  else if (bIsCreature && !aIsCreature)
    return 1;
}

function passPack(from, to) {
  for (let i = 0; i<from.length; i++) {
    Vue.set(to, i, from[i]);
  }
}

function addCardToPile(pile, card, insertBefore) {
  let card_copy = { ...card, key: uuidv4() };
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card_copy);
  else
    pile.push(card_copy);
}

function booster(set_code, cardpool) {

  // generate range of indexes then shuffle it
  let indexes = shuffleArray([...Array(cardpool.length).keys()]);

  // function to draw next n cards that pass a set of filters
  function cards(filters, number) {
    if (!Array.isArray(filters))
      filters = [filters];
    let cards = [];
    for (let i=0; i<indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool[index];
      let passed = true;
      for (let f=0; f<filters.length; f++) {
        if (!filters[f](card)) {
          passed = false;
          break;
        }
      }
      if (passed) {
        cards.push({...card, 
          key: uuidv4(), 
          image: local_images ? 
                  'sets/' + set_code + '/' + card.id + '.png' :
                  card.image_uri,
        });
      }
      if (cards.length >= number)
        break;
    }
    return cards;
  }

  return set.booster(set_code, cards);
}


function shuffleArray(a) {
  let array = a.slice();
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


