
export const ENTER_DRAFT = 'ENTER_DRAFT'
export const UPDATE_CURRENT_TIME = 'UPDATE_CURRENT_TIME'
export const OPEN_PACKS = 'OPEN_PACKS'
export const SET_CARD_PREVIEW = 'SET_CARD_PREVIEW'
export const PACK_TO_PICK = 'PACK_TO_PICK'
export const PILE_TO_PILE = 'PILE_TO_PILE'
export const PASS_PACKS = 'PASS_PACKS'
export const MOVE_PICKS_TO_DECK = 'MOVE_PICKS_TO_DECK'
export const APPLY_AUTO_LANDS = 'APPLY_AUTO_LANDS'
export const SET_PICKS_COMPLETE = 'SET_PICKS_COMPLETE'
export const SIDEBOARD_TO_DECK = 'SIDEBOARD_TO_DECK'
export const DISABLE_AUTO_LANDS = 'DISABLE_AUTO_LANDS'
export const SET_BASIC_LANDS = 'SET_BASIC_LANDS'
export const EXIT_DRAFT = 'EXIT_DRAFT'

import uuidv4 from 'uuid'
import * as set from './set/'
import * as filters from './card-filters'
import * as utils from './utils'

const local_images = true

export const mutations = {

  [ENTER_DRAFT](state, { set_code, cardpool }) {
  
    // set cardpool and packs
    state.set_code = set_code;
    state.cardpool = cardpool;
    state.all_packs = [...Array(24)].map(function() {
      return booster(state.set_code, state.cardpool);
    });
  },

  [UPDATE_CURRENT_TIME](state) {
    state.current_time = new Date();
  },

  [OPEN_PACKS](state, packs) {
    
    // distribute packs
    for (let i=0; i<packs.length; i++)
      state.players[i].draft.pack = packs[i];
    
    // update current pack
    state.current_pack++;

    // reset picks to zero
    state.current_pick = 0;

    // move to next pick
    nextPick(state);
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

  [PILE_TO_PILE](state, { card, pile, piles, insertBefore }) {

    // remove from existing pile 
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

  [PASS_PACKS](state) {

    // copy existing packs
    let packs = state.players.map((player) => player.draft.pack);

    // pass pack
    if (state.current_pack === 2) {
      // pass right
      for (let i=(packs.length-1); i>0; i--)
        state.players[i].draft.pack = packs[i-1];
      state.players[0].draft.pack = packs[packs.length-1];

    } else {
      // pass left
      for (let i=0; i<(packs.length-1); i++)
        state.players[i].draft.pack = packs[i+1];
      state.players[packs.length-1].draft.pack = packs[0];
    }

    // move to next pick
    nextPick(state);
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
  },

  [SET_PICKS_COMPLETE](state) {
    state.picks_complete = true;
  },

  [APPLY_AUTO_LANDS](state, { playerNumber }) {
    let deck = state.players[playerNumber].deck;
    deck.basic_lands = computeAutoLands(deck);
  },

  [DISABLE_AUTO_LANDS](state, { playerNumber }) {
    let deck = state.players[playerNumber].deck;
    deck.auto_lands = false;
  },

  [SET_BASIC_LANDS](state, { color, lands, playerNumber }) {
    let deck = state.players[playerNumber].deck;
    deck.basic_lands[color] = lands;
  },

  [SIDEBOARD_TO_DECK](state, { card, playerNumber }) {
    // remove from sideboard
    let deck = state.players[playerNumber].deck;
    let sideboard = deck.piles[7];
    sideboard.splice(sideboard.indexOf(card), 1);

    // card to deck pile
    let pile = cardToDeckPile(card, deck);
    pile.sort(orderCards);
  },

  [EXIT_DRAFT](state) {
    const s = utils.initialState();
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    });
 },
};


function nextPick(state) {
  
  // advance pick
  state.current_pick++;

  // set end time
  let pick_seconds = 80 - (5 * state.current_pick);
  state.pick_end_time = new Date(new Date().getTime() + 1000 * pick_seconds);
}

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


function computeAutoLands(deck) {

  // get the cards in the deck
  let cards = deck.piles.slice(0, 6).flat();

  // if there are no cards then return no lands
  if (cards.length === 0)
    return { R: 0, W: 0, B: 0, U: 0, G: 0 };

  // count the cards in each color
  let card_colors = countColors(cards);

  // use this to rank-order the most commonly appearing colors
  let color_ranking = rankColors(card_colors);

  // count again w/ the color_ranking
  card_colors = countColors(cards, color_ranking);
 
  // compute the target number of mana sources we need in our mana base
  const total_land_cards = 17;
  let total_card_colors = utils.sumValues(card_colors);  
  let mana_targets = {};
  Object.keys(card_colors).map(
    (color) => mana_targets[color] = (card_colors[color]/total_card_colors) * total_land_cards
  );

  // now count existing sources of mana (e.g. dual lands)
  let lands = deck.piles[6];
  let mana_existing = countColors(lands);
 
  // adjust for existing mana sources 
  let mana_required = {};
  Object.keys(mana_targets).map(
    (color) => mana_required[color] = Math.max(mana_targets[color] - mana_existing[color], 0)
  )

  // take total after adjustment (used to calculate new % values)
  let total_mana_required = utils.sumValues(mana_required);
    
  // function to yield basic lands
  let basic_lands_required = total_land_cards - lands.length;
  function basicLands(rounder) {
    let basic_lands = {};
    Object.keys(mana_required).map(function(color) {
      let lands = mana_required[color]/total_mana_required * basic_lands_required;
      if (rounder)
        lands = rounder(lands);
      basic_lands[color] = lands;
    });
    return basic_lands;
  }

  // tweak until the rounded version has the right sum
  let basic_lands = basicLands();
  let basic_lands_rounded = basicLands(Math.round);
  let basic_lands_rounded_sum = utils.sumValues(basic_lands_rounded);
  while(basic_lands_rounded_sum != basic_lands_required) {
    let is_rounded_larger = basic_lands_rounded_sum > basic_lands_required;
    let max_difference_color = null;
    let max_difference_value = 0;
    let colors = Object.keys(basic_lands);
    for (let i=0; i<colors.length; i++) {
      let color = colors[i];
      let difference = Math.abs(basic_lands_rounded[color] - basic_lands[color]);
      if (max_difference_value < difference) {
        if ((is_rounded_larger && basic_lands_rounded[color] > basic_lands[color]) ||
            (!is_rounded_larger && basic_lands_rounded[color] < basic_lands[color])) {
          max_difference_value = difference;
          max_difference_color = color;
        }
      }
    }
    let modify_value = is_rounded_larger ? -1 : 1;
    basic_lands_rounded[max_difference_color] += modify_value;
    basic_lands_rounded_sum += modify_value;
  }
 
  // return basic lands
  return basic_lands_rounded;
}

 // count colors in sets of cards
 function countColors(cards, color_ranking) {
  let all_colors = ['B', 'U', 'W', 'R', 'G'];
  let color_regex = /[BUWRG/]+(?=\})/g;
  function colorReducer(accumulator, card) {
    if (card.mana_cost !== null && card.mana_cost !== "") {
      let card_colors = card.mana_cost.match(color_regex) || [];
      for (let i = 0; i<card_colors.length; i++) {
        let card_color = card_colors[i]; 
        // apply ranking if we have one and are dealing w/ multiple 
        // color options to play the card
        if (color_ranking) {
          let colors = card_color.split('/');
          colors.sort((a,b) => color_ranking.indexOf(a) - color_ranking.indexOf(b));
          card_color = colors[0];
        }
        for (let c = 0; c<all_colors.length; c++) {
          if (card_color.indexOf(all_colors[c]) !== -1)
            accumulator[all_colors[c]]++;
        }
      }
    } else {
      for (let i=0; i<card.colors.length; i++) 
        accumulator[card.colors[i]]++;
    }
    return accumulator;
  }

  return cards.reduce(colorReducer, { R: 0, W: 0, B: 0, U: 0, G: 0 });
}

function rankColors(card_colors) {
  return Object.keys(card_colors)
    .map((color) => { return { color: color, count: card_colors[color] } })
    .sort((a, b) => b.count - a.count)
    .map((x) => x.color );
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


