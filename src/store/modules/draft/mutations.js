
export const CREATE_DRAFT = 'CREATE_DRAFT'
export const JOIN_DRAFT = 'JOIN_DRAFT'
export const START_DRAFT = 'START_DRAFT'
export const RESUME_DRAFT = 'RESUME_DRAFT'
export const SIMULATE_DRAFT = 'SIMULATE_DRAFT'
export const WRITE_TABLE = 'WRITE_TABLE'
export const PACK_TO_PICK = 'PACK_TO_PICK'
export const PICK_TIMER_EXPIRED_PICKS = 'PICK_TIMER_EXPIRED_PICKS'
export const NEXT_PACK = 'NEXT_PACK'
export const PICK_TO_PILE = 'PICK_TO_PILE'
export const DECK_TO_SIDEBOARD = 'DECK_TO_SIDEBOARD'
export const SIDEBOARD_TO_DECK = 'SIDEBOARD_TO_DECK'
export const SIDEBOARD_TO_SIDEBOARD = 'SIDEBOARD_TO_SIDEBOARD'
export const DISABLE_AUTO_LANDS = 'DISABLE_AUTO_LANDS'
export const SET_BASIC_LANDS = 'SET_BASIC_LANDS'

import shortUuid from 'short-uuid'
import _shuffle from 'lodash/shuffle'
import _flatten from 'lodash/flatten'
import _pullAt from 'lodash/pullAt'

import * as log from '@/log'
import * as set from './set/'
import firestore from './firestore'
import * as draftbot from './draftbot'
import * as filters from './card-filters'
import * as selectors from './selectors'
import { PICKS, DECK } from './constants'
import Vue from 'vue';

export default {

 
  [CREATE_DRAFT](state, { id, player, set_code, cardpool, options }) {
    
    // initialize id
    state.id = id;

    // initialize set
    state.set = {
      code: set_code,
      name: set.name(set_code),
      pack_cards: set.pack_cards(set_code)
    }

    // initialize options
    state.options = {
      ...state.options,
      ...options,
    };
    
    initTable(state, (table) => {

      // set the player info to the first player
      table.players[0].id = player.id;
      table.players[0].name = player.name;
     
      // initialize packs
      table.all_packs = [...Array(24)].map(function() {
        return booster(set_code, cardpool);
      });
    });
  },  

  [JOIN_DRAFT](state, player_info) {
    updateTable(state, (table) => {
      joinDraft(player_info, table);
    });
  },

  [START_DRAFT](state, player_info) {
     updateTable(state, (table) => {
      table.start_time = new Date().getTime();
      if (player_info)
        joinDraft(player_info, table);
      nextPack(state.set.code, table);
    });
  },

  [RESUME_DRAFT](state, { player_id }) {
    
    // for single-player drafts update the start_time and reset
    // the pick_timer 
    if (!state.options.multi_player) {
      updateTable(state, (table) => {
        table.start_time = new Date().getTime();
        resetPickTimer(player_id, state.set.code, table);
      });
    }
  },

  [WRITE_TABLE](state, { table }) {
    writeTable(state, table);
  },

  [SIMULATE_DRAFT](state, { player_id }) {
    updateTable(state, (table) => {
      while (!table.picks_complete) {
        packToPick(state.set.code, player_id, table, null,  null, null, false);
      }
    });
  },

  [PACK_TO_PICK](state, { player_id, card, pile_number, insertBefore }) {

    // invalidator function to ensure that we don't write our pick in the case
    // where we've already been auto-picked by another client (e.g. when the
    // pick timer expires)
    const pickedBefore = selectors.activeCards(player_id, state.table).length;
    const invalidator = (table) => {

      // if the draft completed then invalidate
      if (table.picks_complete)
        return false;

      // if our picks have been advanced then invalidate
      let picked = selectors.activeCards(player_id, table).length;
      if (pickedBefore > picked)
        return false;

      // otherwise we are in the clear
      return true;
    };

    updateTable(state, (table) => {
      packToPick(state.set.code, player_id, 
                 table, card, pile_number, insertBefore)
    }, invalidator);
  },

  [PICK_TIMER_EXPIRED_PICKS](state, { player_id } ) {
    let timed_out_player_indexes = timedOutOtherPlayerIndexes(player_id, state.table);
    if (timed_out_player_indexes.length > 0) {
      updateTable(state, (table) => {
        makePickTimerExpiredPicks(state.set.code, table, timed_out_player_indexes);
      })
    }
  },

  [PICK_TO_PILE](state, { player_id, card, pile_number, insertBefore}) {
    updateTable(state, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let picks = player.picks;
      pileToPile(player, card, pile_number, picks.piles, insertBefore);
    });
    
  },

  [DECK_TO_SIDEBOARD](state, { player_id, card, insertBefore}) {
    updateTable(state, (table) => {
      // move the card
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, DECK.SIDEBOARD, deck.piles, insertBefore);
      // apply auto-lands if necessary
      if (deck.lands.auto)
        deck.lands.basic = computeAutoLands(deck);
    });
  },

  [SIDEBOARD_TO_DECK](state, { player_id, card }) {
    updateTable(state, (table) => {
      // remove from sideboard
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      let sideboard = deck.piles[DECK.SIDEBOARD];
      sideboard.splice(cardIndex(sideboard, card), 1);

      // card to deck pile
      let pile = cardToDeckPile(player, card, deck);
      pile.sort(orderCards);

      // apply auto-lands if necessary
      if (deck.lands.auto)
        deck.lands.basic = computeAutoLands(deck);
    });
  },

  [SIDEBOARD_TO_SIDEBOARD](state, { player_id, card, insertBefore }) {
    updateTable(state, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, DECK.SIDEBOARD, deck.piles, insertBefore);
    });
  },

  [DISABLE_AUTO_LANDS](state, { player_id, color_order }) {
    updateTable(state, (table) => {
      let deck = selectors.activePlayer(player_id, table).deck;
      deck.lands.auto = false;
      deck.lands.color_order = color_order;
    });
  },

  [SET_BASIC_LANDS](state, { player_id, color, lands }) {
    updateTable(state, (table) => {
      let deck = selectors.activePlayer(player_id, table).deck;
      deck.lands.basic[color] = lands;
    });
  },
};

function joinDraft(player_info, table) {

  // lookup the player
  let player = selectors.activePlayer(player_info.id, table);

  // if we found the player then update their player info
  if (player) {

    player.id = player_info.id;
    player.name = player_info.name;
    return true;

  // otherwise find a seat at the table
  } else {
    let seats = [0,4,2,6,1,5,3,7];
    let seat = seats.find(seat => table.players[seat].id === null);
    if (seat !== undefined) {
      table.players[seat] = { ...table.players[seat], ...player_info };
      return true;
    } else {
      return false;
    }
  }
}


function cardIndex(cards, card) {
  return cards.findIndex((element) => element.key === card.key);
}

// write initial values for the table (no firebase sync as we
// will want to initialize firebase with these values)
function initTable(state, writer) {
  let table = JSON.parse(JSON.stringify(state.table));
  writer(table);
  writeTable(state, table);
}

// update the table, writing through to firebase
function updateTable(state, writer, invalidator) {

  // create a writer that will stamp the write with a
  // version (this will allow us to ignore the onSnapshot
  // that comes from firebase)
  const update_version = shortUuid().new();
  const versioned_writer = (table) => {
    writer(table);
    table.update_version = update_version;
  };

  // make the changes locally
  let table = JSON.parse(JSON.stringify(state.table));
  writer(table);
  writeTable(state, table, update_version);
  
  // write to firestore if requested
  if (state.options.multi_player) {

    firestore.updateDraftTable(state.id, versioned_writer, invalidator) 
      .catch(function(error) {
        if (error !== firestore.error_invalidated) {
          log.logException(error, "onUpdateDraftTable");
        }
      });

  }
}

function writeTable(state, table, update_version) {
  Vue.set(state, "table", {
    ...table,
    update_version: update_version || shortUuid().new()
  });
}

function packToPick(set_code, player_id, table, card, pile_number, insertBefore, clear_table = true) {

  // alias player
  let player_index = playerIndex(player_id, table);
  
  // null card means have the AI pick
  if (!card) {
    let player = table.players[player_index];
    let deck = _flatten(player.picks.piles);
    card = draftbot.pick(set_code, deck, player.picks.packs[0]);
  }

  // make the pick 
  makePick(player_index, set_code, table, pile_number, card, insertBefore);

  // ai pick and pass loop
  draftBotPickAndPass(player_index, set_code, table);

  // check whether the pack is completed
  if (selectors.packCompleted(table)) {

    // if we still have packs to go then create the next pack
    if (table.current_pack < 3) {
      nextPack(set_code, table);
    } else {
      // complete picks
      completePicks(table, clear_table);
    }

  } 

}


function playerIndex(player_id, table) {
  return table.players.findIndex((player) => player.id === player_id);
}

function passPack(player_index, set_code, table) {
  
  // first remove the pack from our packs
  let player = table.players[player_index];
  let pack = player.picks.packs.shift();

  // if this reveals a pack beneath the one we were 
  // just considering set the pick end time
  if (player.picks.packs.length > 0)
    player.picks.pick_end_time = nextPickEndTime(set_code, player);

  // now pass to the next player
  let next_player_index = nextPlayerIndex(player_index, table);
  let next_player = table.players[next_player_index];
  next_player.picks.packs.push(pack);

  // if the player previously had no packs in consideration
  // then set the pick_end_time
  if (next_player.picks.packs.length === 1)
    next_player.picks.pick_end_time = nextPickEndTime(set_code, next_player);

}

function resetPickTimer(player_id, set_code, table) {
  let player = selectors.activePlayer(player_id, table);
  player.picks.pick_end_time = nextPickEndTime(set_code, player);
}

function nextPickEndTime(set_code, player) {
  let seconds_per_pick = 5;
  let pack_cards = set.pack_cards(set_code);
  let max_pick_seconds = (seconds_per_pick * pack_cards); 
  let cards_picked = _flatten(player.picks.piles).length;
  let current_pick = (cards_picked % pack_cards) + 1;
  let pick_seconds = max_pick_seconds + seconds_per_pick - (seconds_per_pick * current_pick);
  return new Date().getTime() + (1000 * pick_seconds);
}



function nextPlayerIndex(player_index, table) {
  
  let next_player_index = 0;

  if (table.current_pack === 2) {

    next_player_index = player_index + 1;
    if (next_player_index >= table.players.length)
      next_player_index = 0;

  // pass left
  } else {

    next_player_index = player_index - 1;
    if (next_player_index < 0)
      next_player_index = table.players.length - 1;

  }
  
  return next_player_index;
}



function nextPack(set_code, table) {

  // grab next set of packs
  let packs = [];
  for (let i=0; i<8; i++)
    packs.push(table.all_packs.shift());
  
  // distribute packs
  for (let i=0; i<packs.length; i++) {
    let player = table.players[i];
    player.picks.packs = [packs[i]];
    player.picks.pick_end_time = nextPickEndTime(set_code, player);
  }

  // update current pack
  table.current_pack++;
}

function makePick(player_index, set_code, table, pile_number, card, insertBefore) {

  // alias player
  let player = table.players[player_index];
  let piles = player.picks.piles;
  let pack = player.picks.packs[0];

  // if the pile_number is null then choose the least populated pile
  // of the first 6 pile
  if (pile_number === null) {
    pile_number = piles.slice(0, 6).reduce( (shortestPileIndex, pile, index) => {
      if (pile.length < piles[shortestPileIndex].length)
        return index;
      else
        return shortestPileIndex;
    }, 0);
  }

  // remove from pack
  pack.splice(cardIndex(pack, card), 1);

  // add to pile
  addCardToPile(player, piles[pile_number], card, insertBefore);

  // pass pack to next player if it's not empty
  if (pack.length > 0)
    passPack(player_index, set_code, table);  

  // move picks to deck for non-ai players if we are done
  if (player.id !== null && selectors.picksComplete(player.id, set_code, table))
    movePicksToDeck(player);
}


function timedOutOtherPlayerIndexes(player_id, table) {

  let indexes = [];

  for (let i = 0; i<table.players.length; i++) {

    // if it's a real player as opposed to a bot
    let player = table.players[i];
    if (player.id !== null) {

      // check if we are 2 seconds past the end time
      if (player.picks.packs.length > 0 &&
          player.picks.packs[0].length > 0 &&
          new Date().getTime() > (player.picks.pick_end_time + 2000)) {
        indexes.push(i);
      }
    }
  }

  // filter out the current player
  let player_index = playerIndex(player_id, table);
  return indexes.filter(i => i !== player_index);
}

function nextKey(player) {
  return player.next_key++;
}

function makePickTimerExpiredPicks(set_code, table, player_indexes) {
  player_indexes.forEach(i => {
    let player = table.players[i];
    packToPick(set_code, player.id, table, null, null, null);
  });
}

function draftBotPickAndPass(player_index, set_code, table) {

  // execute pick and pass for all bots
  let current_index = player_index;
  for(;;) {

    // advance to next player -
    current_index = nextPlayerIndex(current_index, table);

    // bail if we've been around the circle
    if (current_index === player_index)
      break;

    // skip if it's not a bot
    let player = table.players[current_index];
    if (player.id)
      continue;

    // it's a bot, execute a pick and pass loop until we 
    // have no more picks to make
    while (player.picks.packs.length > 0 &&
           player.picks.packs[0].length > 0) {
      let pack = player.picks.packs[0];
      let piles = player.picks.piles;
      let card = draftbot.pick(set_code, _flatten(piles), pack);
      makePick(current_index, set_code, table, null, card, null);
    }
  }
}

function cardToDeckPile(player, c, deck) {

  // add card to pile
  let card = {...c, key: nextKey(player)};
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

function movePicksToDeck(player) {

  // non-sideboard cards
  let picks = player.picks;
  let deck = player.deck;
  picks.piles.slice(0, PICKS.PILES).forEach(function(pile) {
    pile.forEach((c) => cardToDeckPile(player, c, deck));
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

function completePicks(table, clear_table) {
  
  // set completed status
  table.picks_complete = true;

  // remove non-ai players
  if (clear_table) {
    table.players = table.players.filter((player) => player.id !== null);
    // clear picks
    table.players.forEach(player => {
      player.picks.piles = [...Array(PICKS.PILES+1)].map(() => Array());
    });
  }
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

function pileToPile(player, card, pile_number, piles, insertBefore) {
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
  addCardToPile(player, pile, card, insertBefore);
}

function addCardToPile(player, pile, card, insertBefore) {
  let card_copy = { ...card, key: nextKey(player) };
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card_copy);
  else
    pile.push(card_copy);
}

function booster(set_code, cardpool) {

  // track next key
  let next_key = 0;

  // track cards already selected (to prevent duplicates)
  let selectedCardIds = [];

  function select(filter, number) {

    // generate range of indexes then shuffle it
    let indexes = _shuffle([...Array(cardpool.length).keys()]);
  
    // scan through the cards and match the filter
    let selectedIndexes = [];
    let cards = [];
    for (let i=0; i<indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool[index];
      if (filter(card)) {

        // detect duplicate 
        if (selectedCardIds.indexOf(card.id) !== -1)
          continue;
  
        // record index selected (will be removed from cardpool)
        selectedIndexes.push(index);

        // record ids selected (used to prevent duplicates)
        selectedCardIds.push(card.id);
  
        // accumulate card
        cards.push({...card, 
          key: next_key++, 
        });
      }
      if (cards.length >= number)
        break;
    }
  
    // remove drawn cards from cardpool
    _pullAt(cardpool, selectedIndexes);
  
    // return cards
    return cards;
  }    


  // function to draw next n cards that pass a set of filters
  function selectCards(filters, number) {

    // normalize to single set of filters
    filters = [].concat(filters);

    // call the filters in sequence until we select all the cards we need
    let cards = [];
    for (let i=0; i<filters.length; i++) {
      let filter = filters[i];
      cards = cards.concat(select(filter, number - cards.length));
      if (cards.length >= number)
        break;
    }

    // return the cards
    return cards;    
  }

  // generate booster for set using selectCards function
  return set.booster(set_code, selectCards);
}




