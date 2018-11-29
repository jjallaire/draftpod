
export const ENTER_DRAFT = 'ENTER_DRAFT'
export const RESUME_DRAFT = 'RESUME_DRAFT'
export const PACK_TO_PICK = 'PACK_TO_PICK'
export const NEXT_PACK = 'NEXT_PACK'
export const PICK_TO_PILE = 'PICK_TO_PILE'
export const DECK_TO_SIDEBOARD = 'DECK_TO_SIDEBOARD'
export const SIDEBOARD_TO_DECK = 'SIDEBOARD_TO_DECK'
export const SIDEBOARD_TO_SIDEBOARD = 'SIDEBOARD_TO_SIDEBOARD'
export const DISABLE_AUTO_LANDS = 'DISABLE_AUTO_LANDS'
export const SET_BASIC_LANDS = 'SET_BASIC_LANDS'

import uuidv4 from 'uuid'
import _shuffle from 'lodash/shuffle'
import _flatten from 'lodash/flatten'

import * as set from './set/'
import * as filters from './card-filters'
import * as selectors from './selectors'
import { PICKS, DECK } from './constants'

const local_images = false;

export default {

  [ENTER_DRAFT](state, { set_code, cardpool, options }) {
    
    // initialize options
    state.options = {
      set_code: set_code,
      set_name: set.name(set_code),
      ...options  
    };
    
    updateTable(state, (table) => {
      // initialize packs
      table.all_packs = [...Array(24)].map(function() {
        return booster(set_code, cardpool);
      });

      // distribute first pack
      nextPack(table);
    });
  },

  [RESUME_DRAFT](state) {
    state.start_time = new Date().getTime();
  },

  [PACK_TO_PICK](state, { card, pile_number, insertBefore }) {

    updateTable(state, (table) => {

      // null card means have the AI pick
      if (!card) {
        let deck = _flatten(table.picks.piles);
        card = set.pick(state.options.set_code, deck, table.picks.pack);
      }

      // write the pick 
      let pack = table.picks.pack;
      let pile = table.picks.piles[pile_number];
      packToPick(pack, pile, card, insertBefore);

      // have other players make their picks
      aiPicks(state.options, table);

      // check whether the pack is completed
      if (table.picks.pack.length === 0) {

        // if we still have packs to go then create the next pack
        if (table.current_pack < 3) {
          nextPack(table);
        } else {

          // move picks to deck
          movePicksToDeck(table);

          // complete picks
          completePicks(table);
        }

      // pass the packs
      } else {
        passPacks(table);
      }
    });
  },

  [PICK_TO_PILE](state, { card, pile_number, insertBefore}) {
    updateTable(state, (table) => {
      pileToPile(card, pile_number, table.picks.piles, insertBefore);
    });
    
  },

  [DECK_TO_SIDEBOARD](state, { card, insertBefore}) {
    updateTable(state, (table) => {
      // move the card
      let deck = table.deck;
      pileToPile(card, DECK.SIDEBOARD, deck.piles, insertBefore);
      // apply auto-lands if necessary
      if (deck.lands.auto)
        deck.lands.basic = computeAutoLands(deck);
    });
  },

  [SIDEBOARD_TO_DECK](state, { card }) {
    updateTable(state, (table) => {
      // remove from sideboard
      let deck = table.deck;
      let sideboard = deck.piles[DECK.SIDEBOARD];
      sideboard.splice(cardIndex(sideboard, card), 1);

      // card to deck pile
      let pile = cardToDeckPile(card, deck);
      pile.sort(orderCards);

      // apply auto-lands if necessary
      if (deck.lands.auto)
        deck.lands.basic = computeAutoLands(deck);
    });
  },

  [SIDEBOARD_TO_SIDEBOARD](state, { card, insertBefore }) {
    updateTable(state, (table) => {
      let deck = table.deck;
      pileToPile(card, DECK.SIDEBOARD, deck.piles, insertBefore);
    });
  },

  [DISABLE_AUTO_LANDS](state, { color_order }) {
    updateTable(state, (table) => {
      let deck = table.deck;
      deck.lands.auto = false;
      deck.lands.color_order = color_order;
    });
  },

  [SET_BASIC_LANDS](state, { color, lands }) {
    updateTable(state, (table) => {
      let deck = table.deck;
      deck.lands.basic[color] = lands;
    });
  },
};


function cardIndex(cards, card) {
  return cards.findIndex((element) => element.key === card.key);
}

function updateTable(state, updator) {
  let table = JSON.parse(JSON.stringify(state.table));
  updator(table);
  state.table = table;
}

function passPacks(table) {
  // compose array of all players
  let players = [{ picks: table.picks, deck: table.deck }]
                  .concat(table.players);

  // copy existing packs
  let packs = players.map((player) => player.picks.pack.slice());

  // pass pack
  if (table.current_pack === 2) {
    // pass right
    for (let i=(packs.length-1); i>0; i--)
      players[i].picks.pack = packs[i-1];
    players[0].picks.pack = packs[packs.length-1];

  } else {
    // pass left
    for (let i=0; i<(packs.length-1); i++)
      players[i].picks.pack = packs[i+1];
    players[packs.length-1].picks.pack = packs[0];
  }

  // move to next pick
  nextPick(table);
}

function nextPack(table) {

  // grab next set of packs
  let pack_begin = table.current_pack * 8;
  let pack_end = pack_begin + 8;
  let packs = table.all_packs.slice(pack_begin, pack_end);

  // distribute packs
  table.picks.pack = packs[0];
  for (let i=1; i<packs.length; i++)
    table.players[i-1].picks.pack = packs[i];

  // update current pack
  table.current_pack++;

  // reset picks to zero
  table.current_pick = 0;

  // move to next pick
  nextPick(table);
}

function nextPick(table) {
  
  // advance pick
  table.current_pick++;

}

function packToPick(pack, pile, card, insertBefore) {

  // remove from pack
  pack.splice(cardIndex(pack, card), 1);

  // add to pile
  addCardToPile(pile, card, insertBefore);
}

function aiPicks(options, table) {
  let players = table.players;
  for (let i=0; i<players.length; i++) {
    let player = players[i];
    let pack = player.picks.pack;
    let pile = player.picks.piles[0];
    let card = set.pick(options.set_code, pile, pack);
    packToPick(pack, pile, card, null);
  }
}

function cardToDeckPile(c, deck) {

  // add card to pile
  let card = {...c, key: uuidv4()};
  let deck_piles = deck.piles;
  let pile = null;

  if (filters.land(card)) {
    pile = deck_piles[DECK.LANDS];
  } else {
    let offset = filters.creature(card) ? 0 : DECK.PILES / 2;
    if (card.cmc <= 1)
      pile = deck_piles[offset];
    else if (card.cmc>= 6)
      pile = deck_piles[offset + 5];
    else
      pile = deck_piles[offset + card.cmc - 1];
  }
  pile.push(card);

  // return the pile
  return pile;
}

function movePicksToDeck(table) {

  // non-sideboard cards
  let picks = table.picks;
  let deck = table.deck;
  picks.piles.slice(0, PICKS.PILES).forEach(function(pile) {
    pile.forEach((c) => cardToDeckPile(c, deck));
  });

  // sideboard cards
  deck.piles[DECK.SIDEBOARD] = picks.piles[PICKS.SIDEBOARD].slice();

  // prune out all basic lands
  deck.piles = deck.piles.map(function(pile) {
    return pile.filter((card) => !filters.basicLand(card));
  });

  // sort all deck piles
  deck.piles.forEach((pile) => pile.sort(orderCards));

  // apply auto lands
  deck.lands.basic = computeAutoLands(deck);
}

function completePicks(table) {
  table.all_packs = [];
  table.picks = { pack: [], piles: []};
  table.players = [];
  table.picks_complete = true;
}


function computeAutoLands(deck) {

  // get the cards in the deck
  let cards = _flatten(deck.piles.slice(0, DECK.PILES));

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
  let total_card_colors = selectors.sumValues(card_colors);  
  let mana_targets = {};
  Object.keys(card_colors).map(
    (color) => mana_targets[color] = (card_colors[color]/total_card_colors) * total_land_cards
  );

  // now count existing sources of mana (e.g. dual lands)
  let lands = deck.piles[DECK.LANDS];
  let mana_existing = countColors(lands);
 
  // adjust for existing mana sources 
  let mana_required = {};
  Object.keys(mana_targets).map(
    (color) => mana_required[color] = Math.max(mana_targets[color] - mana_existing[color], 0)
  )

  // take total after adjustment (used to calculate new % values)
  let total_mana_required = selectors.sumValues(mana_required);
    
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
  let basic_lands_rounded_sum = selectors.sumValues(basic_lands_rounded);
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
          if (colors.length === 2) {
            // exclude split colors if we can pay for the other color in our top 2
            if (color_ranking.indexOf(colors[0]) < 2 && color_ranking.indexOf(colors[1]) >= 2)
              card_color = colors[0];
            else if (color_ranking.indexOf(colors[1]) < 2 && color_ranking.indexOf( colors[0]) >= 2)
              card_color = colors[1];
          }
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

function pileToPile(card, pile_number, piles, insertBefore) {
  // remove from existing pile 
  let pile = piles[pile_number];
  piles.forEach(function (p) {
    let index = cardIndex(p, card);
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
  let indexes = _shuffle([...Array(cardpool.length).keys()]);

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
        // determine card image uris
        let images = card.image_uris;
        if (local_images) {
          let base_image = '/sets/' + set_code + '/' + card.id;
          images[0] = base_image + '.png';
          if (images.length > 1)
            images[1] = base_image + '-back.png';
        }

        cards.push({...card, 
          key: uuidv4(), 
          images: images
        });
      }
      if (cards.length >= number)
        break;
    }
    return cards;
  }

  return set.booster(set_code, cards);
}

