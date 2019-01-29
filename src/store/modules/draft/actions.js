
export const JOIN_DRAFT = 'JOIN_DRAFT'
export const START_DRAFT = 'START_DRAFT'
export const RESUME_DRAFT = 'RESUME_DRAFT'
export const SIMULATE_DRAFT = 'SIMULATE_DRAFT'
export const PICK_TIMER_PICK = 'PICK_TIMER_PICK'
export const PACK_TO_PICK = 'PACK_TO_PICK'
export const NEXT_PACK = 'NEXT_PACK'
export const PICK_TO_PILE = 'PICK_TO_PILE'
export const DECK_TO_SIDEBOARD = 'DECK_TO_SIDEBOARD'
export const DECK_TO_UNUSED = 'DECK_TO_UNUSED'
export const SIDEBOARD_TO_DECK = 'SIDEBOARD_TO_DECK'
export const SIDEBOARD_TO_UNUSED = 'SIDEBOARD_TO_UNUSED'
export const UNUSED_TO_DECK = 'UNUSED_TO_DECK'
export const UNUSED_TO_SIDEBOARD = 'UNUSED_TO_SIDEBOARD'
export const DISABLE_AUTO_LANDS = 'DISABLE_AUTO_LANDS'
export const SET_BASIC_LANDS = 'SET_BASIC_LANDS'
export const REMOVE_PLAYER = 'REMOVE_PLAYER'

import { WRITE_TABLE, SET_CONNECTED } from './mutations'

import _flatten from 'lodash/flatten'
import _orderBy from 'lodash/orderBy'

import * as log from '@/core/log'
import * as set from './set/'
import firestore from './firestore'
import * as draftbot from './draftbot'
import * as filters from './card-filters'
import * as selectors from './selectors'
import { PICKS, DECK } from './constants'
import * as messagebox from '@/components/core/messagebox.js'

export default {

  [JOIN_DRAFT]( { commit, state }, player_info) {
    return updateTable({ commit, state }, null, null, (table) => {
      joinDraft(player_info, table);
    });
  },

  [START_DRAFT]({ commit, state }, player_info) {
    return updateTable({ commit, state }, null, null, (table) => {
      table.start_time = new Date().getTime();
      if (player_info)
        joinDraft(player_info, table);
      nextPack(state.set.code, table);
    });
  },

  [RESUME_DRAFT]({ commit, state }, { player_id, client_id }) {

    // for multi-player drafts set the client id 
    if (state.options.multi_player) {
      return updateTable({ commit, state }, player_id, null, (table) => {
        let player = selectors.activePlayer(player_id, table);
        player.client_id = client_id;
      });
    
    // for single-player drafts update the start_time and reset the pick_timer 
    } else {
      return updateTable({ commit, state }, null, null, (table) => {
        table.start_time = new Date().getTime();
        resetPickTimer(player_id, state.set.code, table);
      });
    }
  },

  [SIMULATE_DRAFT]({ commit, state }, { player_id }) {
    return updateTable({ commit, state }, player_id, null, (table) => {
      while (!table.picks_complete) {
        packToPick(state.set.code, player_id, table, null, null, null);
      }
    });
  },

  [PICK_TIMER_PICK]({ commit, state }, { player_id, client_id }) {
    if (state.connected) {
      return updateTable({ commit, state }, player_id, client_id, (table) => {
        packToPick(state.set.code, player_id, table, null, null, null)
      });
    } else {
      return Promise.resolve();
    }
  },

  [PACK_TO_PICK]({ commit, state }, { player_id, client_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      packToPick(state.set.code, player_id, table, card, pile_number, insertBefore)
    });
  },

  [PICK_TO_PILE]({ commit, state }, { player_id, client_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let picks = player.picks;
      pileToPile(player, card, pile_number, picks.piles, insertBefore);
    });

  },

  [DECK_TO_SIDEBOARD]({ commit, state }, { player_id, client_id, card }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      deckToUnplayed(player_id, table, card, DECK.SIDEBOARD);
    });
  },

  [DECK_TO_UNUSED]({ commit, state }, { player_id, client_id, card }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      deckToUnplayed(player_id, table, card, DECK.UNUSED);
    });
  },

  [SIDEBOARD_TO_DECK]({ commit, state }, { player_id, client_id, card }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      unplayedToDeck(player_id, table, card, DECK.SIDEBOARD);
    });
  },

  [SIDEBOARD_TO_UNUSED]({ commit, state }, { player_id, client_id, card }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, DECK.UNUSED, deck.piles, null);
      orderUnplayedPiles(deck);
    });
  },

  [UNUSED_TO_DECK]({ commit, state }, { player_id, client_id, card }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      unplayedToDeck(player_id, table, card, DECK.UNUSED);
    });
  },

  [UNUSED_TO_SIDEBOARD]({ commit, state }, { player_id, client_id, card }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, DECK.SIDEBOARD, deck.piles, null);
      orderUnplayedPiles(deck);
    });
  },

  [DISABLE_AUTO_LANDS]({ commit, state }, { player_id, client_id, color_order }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      let deck = selectors.activePlayer(player_id, table).deck;
      deck.lands.auto = false;
      deck.lands.color_order = color_order;
    });
  },

  [SET_BASIC_LANDS]({ commit, state }, { player_id, client_id, color, lands }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      let deck = selectors.activePlayer(player_id, table).deck;
      deck.lands.basic[color] = lands;
    });
  },

  [REMOVE_PLAYER]({ commit, state }, { player_id, client_id, remove_player_id }) {
    return updateTable({ commit, state }, player_id, client_id, (table) => {
      
      // determine player index
      let player_index = selectors.playerIndex(player_id, table);

      // turn the player into a bot
      let player = selectors.activePlayer(remove_player_id, table);
      player.id = null;
      player.name = null;
      player.client_id = null;
      player.bot = draftbot.create();

      // make any pending picks using ai
      draftBotPickAndPass(player_index, state.set.code, table);
      
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
    player.bot = draftbot.createAutoPicker();
    return true;

    // otherwise find a seat at the table
  } else {
    let seats = [0, 4, 2, 6, 1, 5, 3, 7];
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

// update the table, writing through to firebase
function updateTable({ commit, state }, player_id, client_id, writer) {
    
  // validate that another client hasn't taken over the draft
  if (state.options.multi_player) {
    if (!firestore.validateClient(player_id, client_id, state.table)) {
      commit(SET_CONNECTED, { connected: false });
      return Promise.resolve(false); 
    }
  }

  // record the state prior to the changes (will be used to roll back the local state
  // if an error occurs updating firebase)
  let previousTable = JSON.parse(JSON.stringify(state.table));

  // make the changes locally
  let table = JSON.parse(JSON.stringify(state.table));
  writer(table);
  commit(WRITE_TABLE, { table });

  // write to firestore if requested
  if (state.options.multi_player) {

    return firestore.updateDraftTable(state.id, writer)
      .then(function() {

        // set connected flag to true to indicate we can do pick timer picks
        if (!state.connected)
          commit(SET_CONNECTED, { connected: true });

        // successfully updated
        return true;

      })
      .catch(function(error) {
        
        // notify user
        messagebox.alert(
          "Connection Error",
          "<p>An error occurred while communicating with the Draftpod server: " + error + "</p>" +
          "<p>Please be sure that your internet connection is online, " +
          "then click the button below to attempt to reconnect.</p>",
          () => {
            window.location.reload();
          },
          "Reconnect to Draft",
        );

        // set connected flag to false so we don't attempt pick timer picks
        commit(SET_CONNECTED, { connected: false });
      
        // rollback state
        commit(WRITE_TABLE, { table: previousTable });
        
        // log error if it's not one that occurs in the ordinary course of using firestore
        if (!firestore.isConnectivityError(error) && 
            !firestore.isAbortedError(error)) {
          log.logException(error, "onUpdateDraftTable");
        }

        // not successfully updated
        return false;
      });
  } else {
    return Promise.resolve(true);
  }  

}

function packToPick(set_code, player_id, table, card, pile_number, insertBefore) {

  // it's possible that a packToPick gesture occurs (e.g. from a pick timer or stale drop)
  // that can't be fulfilled because there is no current pack. in this case just ignore
  // the request entirely
  if (!selectors.activePack(player_id, table))
    return;

  // alias player
  let player_index = selectors.playerIndex(player_id, table);

  // cards picked so far
  let player = table.players[player_index];
  let picks = _flatten(player.picks.piles);

  // null card means have the AI pick
  if (!card)  
    card = draftbot.pick(player.bot, picks, player.packs[0]);

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
      completePicks(table);
    }

  }

}

function passPack(player_index, set_code, table) {

  // first remove the pack from our packs
  let player = table.players[player_index];
  let pack = player.packs.shift();

  // if this reveals a pack beneath the one we were 
  // just considering set the pick end time
  if (player.packs.length > 0)
    player.pick_end_time = nextPickEndTime(set_code, player);

  // now pass to the next player
  let next_player_index = nextPlayerIndex(player_index, table);
  let next_player = table.players[next_player_index];
  next_player.packs.push(pack);

  // if the player previously had no packs in consideration
  // then set the pick_end_time
  if (next_player.packs.length === 1)
    next_player.pick_end_time = nextPickEndTime(set_code, next_player);

}

function resetPickTimer(player_id, set_code, table) {
  let player = selectors.activePlayer(player_id, table);
  player.pick_end_time = nextPickEndTime(set_code, player);
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
  for (let i = 0; i < 8; i++)
    packs.push(table.all_packs.shift());

  // distribute packs
  for (let i = 0; i < packs.length; i++) {
    let player = table.players[i];
    player.packs = [packs[i]];
    player.pick_end_time = nextPickEndTime(set_code, player);
  }

  // update current pack
  table.current_pack++;
}

function makePick(player_index, set_code, table, pile_number, card, insertBefore) {

  // alias player
  let player = table.players[player_index];
  let piles = player.picks.piles;
  let pack = player.packs[0];

  // if the pile_number is null then choose the least populated pile
  // of the first 6 pile
  if (pile_number === null) {
    pile_number = piles.slice(0, 6).reduce((shortestPileIndex, pile, index) => {
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

  // record pick_order
  player.picks.pick_order.push(card.id);

  // pass pack to next player if it's not empty
  if (pack.length > 0)
    passPack(player_index, set_code, table);

  // move picks to deck for non-ai players if we are done
  if (player.id !== null && selectors.picksComplete(player.id, set_code, table))
    movePicksToDeck(player);
}

function draftBotPickAndPass(player_index, set_code, table) {

  // execute pick and pass for all bots
  let current_index = player_index;
  do {

    // get a reference to the player: it's a bot, execute a pick and pass loop until we 
    // have no more picks to make
    let player = table.players[current_index];
    if (player.id === null) {
      while (player.packs.length > 0 &&
        player.packs[0].length > 0) {
        let pack = player.packs[0];
        let piles = player.picks.piles;
        let card = draftbot.pick(player.bot, _flatten(piles), pack);
        makePick(current_index, set_code, table, null, card, null);
      }
    }

    // advance to next player -
    current_index = nextPlayerIndex(current_index, table);

  // terminate once we get back to the original player_index
  } while(current_index !== player_index);
}

function cardToDeckPile(player, c, deck) {

  // add card to pile
  let card = JSON.parse(JSON.stringify(c));
  let deck_piles = deck.piles;
  let pileIndex = null;

  if (filters.land(card)) {
    pileIndex = DECK.LANDS;
  } else {
    let offset = filters.creature(card) ? 0 : DECK.PILES / 2;
    if (card.cmc <= 1)
      pileIndex = offset;
    else if (card.cmc >= 6)
      pileIndex = offset + 5;
    else
      pileIndex = offset + card.cmc - 1;
  }
  deck_piles[pileIndex].push(card);

  // return the pile index
  return pileIndex;
}

function deckToUnplayed(player_id, table, card, targetPile) {
  // move the card
  let player = selectors.activePlayer(player_id, table);
  let deck = player.deck;
  pileToPile(player, card, targetPile, deck.piles, null);
  // sort
  orderUnplayedPiles(deck);
  
  // apply auto-lands if necessary
  if (deck.lands.auto)
    deck.lands.basic = computeAutoLands(deck);
}

function unplayedToDeck(player_id, table, card, sourcePile) {
  // remove from sideboard/unused
  let player = selectors.activePlayer(player_id, table);
  let deck = player.deck;
  let source = deck.piles[sourcePile];
  source.splice(cardIndex(source, card), 1);

  // card to deck pile
  let pileIndex = cardToDeckPile(player, card, deck);
  deck.piles[pileIndex] = orderDeckPile(deck.piles[pileIndex]);

  // sort unplayed
  orderUnplayedPiles(deck);

  // apply auto-lands if necessary
  if (deck.lands.auto)
    deck.lands.basic = computeAutoLands(deck);
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
  deck.piles = deck.piles.map(pile => orderDeckPile(pile));
 
  // sort unplayed cards
  orderUnplayedPiles(deck);
  
  // apply auto lands
  deck.lands.basic = computeAutoLands(deck);
}

function completePicks(table) {
  
  // set completed status
  table.picks_complete = true;

  // wipe out piles (but save colors)
  table.players.forEach(player => {

    // save the player colors
    let cards = _flatten(player.picks.piles);
    player.picks.colors = draftbot.deckColors(cards);

    // wipe out the piles
    player.picks.piles = [...Array(PICKS.PILES + 1)].map(() => Array());

  });
  

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
  Object.keys(card_colors).map(color => {
    let target = (card_colors[color] / total_card_colors) * total_land_cards;
    if (target > 0)
      target = Math.max(target, 1);
    mana_targets[color] = target;
  });

  // now count existing sources of mana (e.g. dual lands)
  let lands = deck.piles[DECK.LANDS];
  let mana_existing = countColors(lands);

  // adjust for existing mana sources 
  let mana_required = {};
  Object.keys(mana_targets).map(
    color => {
      let target = mana_targets[color];
      if (target > 0)
        // ensure at least 1 mana required (prevent total_mana_required === 0)
        mana_required[color] = Math.max(mana_targets[color] - mana_existing[color], 1);
      else
        mana_required[color] = 0;
    }
  )

  // take total after adjustment (used to calculate new % values)
  let total_mana_required = selectors.sumValues(mana_required);

  // function to yield basic lands
  let basic_lands_required = total_land_cards - lands.length;
  function basicLands(rounder) {
    let basic_lands = {};
    Object.keys(mana_required).map(function (color) {
      let lands = mana_required[color] / total_mana_required * basic_lands_required;
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
  while (basic_lands_rounded_sum != basic_lands_required) {
    let is_rounded_larger = basic_lands_rounded_sum > basic_lands_required;
    let max_difference_color = null;
    let max_difference_value = 0;
    let colors = Object.keys(basic_lands);
    for (let i = 0; i < colors.length; i++) {
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
      for (let i = 0; i < card_colors.length; i++) {
        let card_color = card_colors[i];
        // apply ranking if we have one and are dealing w/ multiple 
        // color options to play the card
        if (color_ranking) {
          let colors = card_color.split('/');
          if (colors.length === 2) {
            // exclude split colors if we can pay for the other color in our top 2
            if (color_ranking.indexOf(colors[0]) < 2 && color_ranking.indexOf(colors[1]) >= 2)
              card_color = colors[0];
            else if (color_ranking.indexOf(colors[1]) < 2 && color_ranking.indexOf(colors[0]) >= 2)
              card_color = colors[1];
          }
        }
        for (let c = 0; c < all_colors.length; c++) {
          if (card_color.indexOf(all_colors[c]) !== -1)
            accumulator[all_colors[c]]++;
        }
      }
    } else {
      for (let i = 0; i < card.colors.length; i++)
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
    .map((x) => x.color);
}

function orderDeckPile(pile) {
  return _orderBy(pile, ["cmc", "name"], ["asc", "asc"]);
}

function orderUnplayedPiles(deck) {
  deck.piles[DECK.SIDEBOARD] = orderUnplayedPile(deck, deck.piles[DECK.SIDEBOARD]);
  deck.piles[DECK.UNUSED] = orderUnplayedPile(deck, deck.piles[DECK.UNUSED]);
}

function orderUnplayedPile(deck, pile) {
  
  // function to reduce colors to a single string
  const asColor = colors => {
    if (colors.length > 0)
      return colors.join();
    else
      return "C"; // colorless 
  };

  // count incidence of different colors in deck
  let colorCounts = selectors.deckCards(deck).reduce((counts, card) => {
    // ignore lands
    if (filters.land(card))
      return counts;
    // count colors
    function incrementColor(color) {
      if (!counts.hasOwnProperty(color))
        counts[color] = 0;
      counts[color] = counts[color] + 1;
    }
    card.colors.forEach(incrementColor);
    incrementColor(asColor(card.colors));
    return counts;
  }, {});

  // genereate sort fields
  let cards = pile.map((card) => { 
    return { 
      ...card, 
      creature: filters.creature(card) ? 1 : 0,
      colorTag: asColor(card.colors),
      colorOrder: colorCounts[asColor(card.colors)] || 0,
    }
  }); 

  // return sorted array of cards
  return _orderBy(cards, 
    ["colorOrder",  "colorTag", "creature", "cmc"], 
    ["desc", "asc", "desc", "asc"]
  );
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
  let card_copy = JSON.parse(JSON.stringify(card));
  if (insertBefore !== null)
    pile.splice(insertBefore, 0, card_copy);
  else
    pile.push(card_copy);
}



