
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
export const DECK_TO_DECK = 'DECK_TO_DECK'
export const SIDEBOARD_TO_DECK = 'SIDEBOARD_TO_DECK'
export const SIDEBOARD_TO_UNUSED = 'SIDEBOARD_TO_UNUSED'
export const UNUSED_TO_DECK = 'UNUSED_TO_DECK'
export const UNUSED_TO_SIDEBOARD = 'UNUSED_TO_SIDEBOARD'
export const DISABLE_AUTO_LANDS = 'DISABLE_AUTO_LANDS'
export const SET_BASIC_LANDS = 'SET_BASIC_LANDS'
export const REMOVE_PLAYER = 'REMOVE_PLAYER'

import { WRITE_TABLE, SET_CONNECTED, SET_WAITING, CLEAR_WAITING,
         CONVERT_TO_SINGLE_PLAYER } from './mutations'

import _flatten from 'lodash/flatten'
import _orderBy from 'lodash/orderBy'
import _sumBy from 'lodash/sumBy'

import * as log from '@/core/log'
import * as set from './set/'
import firestore from './firestore'
import * as draftbot from './draftbot'
import * as filters from './card-filters'
import * as selectors from './selectors'
import { PICKS, DECK } from './constants'

export default {

  [JOIN_DRAFT]( { commit, state }, player_info) {
    return updateTable({ commit, state }, null, (table) => {
      joinDraft(player_info, table);
    });
  },

  [START_DRAFT]({ commit, state }, player_info) {
    return updateTable({ commit, state }, null, (table, options) => {
      table.start_time = new Date().getTime();
      if (player_info)
        joinDraft(player_info, table);
      if (selectors.draftFormat(state) === 'draft') {
        nextPack(state.set.code, options, table);
      } else {
        distributeSealedPools(table, options);
      }
    });
  },

  [RESUME_DRAFT]({ commit, state }, { player_id }) {

    // for single-player drafts update the start_time and reset the pick_timer 
    if (!state.options.multi_player) {
      return updateTable({ commit, state }, null, (table, options) => {
        table.start_time = new Date().getTime();
        resetPickTimer(player_id, state.set.code, options, table);
      });
    } else {
      return Promise.resolve();
    }
  },

  [SIMULATE_DRAFT]({ commit, state }, { player_id }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      while (!table.picks_complete) {
        packToPick(state.set.code, player_id, options, table, null, null, null);
      }
    });
  },

  [PICK_TIMER_PICK]({ commit, state }, { player_id }) {
    if (state.connected) {
      return updateTable({ commit, state }, player_id, (table, options) => {
        packToPick(state.set.code, player_id, options, table, null, null, null)
      });
    } else {
      return Promise.resolve();
    }
  },

  [PACK_TO_PICK]({ commit, state }, { player_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      packToPick(state.set.code, player_id, options, table, card, pile_number, insertBefore)
    });
  },

  [PICK_TO_PILE]({ commit, state }, { player_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let picks = player.picks;
      pileToPile(player, card, pile_number, picks.piles, insertBefore);
    });

  },

  [DECK_TO_SIDEBOARD]({ commit, state }, { player_id, card }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      deckToUnplayed(player_id, options, table, card, DECK.SIDEBOARD);
    });
  },

  [DECK_TO_UNUSED]({ commit, state }, { player_id, card }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      deckToUnplayed(player_id, options, table, card, DECK.UNUSED);
    });
  },

  [SIDEBOARD_TO_DECK]({ commit, state }, { player_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      unplayedToDeck(player_id, options, table, card, DECK.SIDEBOARD, pile_number, insertBefore);
    });
  },

  [DECK_TO_DECK]({ commit, state }, { player_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, pile_number, deck.piles, insertBefore)
    });
  },

  [SIDEBOARD_TO_UNUSED]({ commit, state }, { player_id, card }) {
    return updateTable({ commit, state }, player_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, DECK.UNUSED, deck.piles, null);
      orderUnplayedPiles(deck);
    });
  },

  [UNUSED_TO_DECK]({ commit, state }, { player_id, card, pile_number, insertBefore }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      unplayedToDeck(player_id, options, table, card, DECK.UNUSED, pile_number, insertBefore);
    });
  },

  [UNUSED_TO_SIDEBOARD]({ commit, state }, { player_id, card }) {
    return updateTable({ commit, state }, player_id, (table) => {
      let player = selectors.activePlayer(player_id, table);
      let deck = player.deck;
      pileToPile(player, card, DECK.SIDEBOARD, deck.piles, null);
      orderUnplayedPiles(deck);
    });
  },

  [DISABLE_AUTO_LANDS]({ commit, state }, { player_id, set_color, color_order }) {
    return updateTable({ commit, state }, player_id, (table) => {
      let deck = selectors.activePlayer(player_id, table).deck;
      deck.lands.auto = false;
      deck.lands.color_order = color_order;
      if (set_color)
        deck.lands.basic[set_color.color] = set_color.lands;
    });
  },

  [SET_BASIC_LANDS]({ commit, state }, { player_id, color, lands }) {
    return updateTable({ commit, state }, player_id, (table) => {
      let deck = selectors.activePlayer(player_id, table).deck;
      deck.lands.basic[color] = lands;
    });
  },

  [REMOVE_PLAYER]({ commit, state }, { player_id, remove_player_id }) {
    return updateTable({ commit, state }, player_id, (table, options) => {
      
      // determine player index
      let player_index = selectors.playerIndex(player_id, table);

      // turn the player into a bot
      let player = selectors.activePlayer(remove_player_id, table);
      player.id = null;
      player.name = null;
      player.bot = draftbot.create();

      // make any pending picks using ai
      draftBotPickAndPass(player_index, state.set.code, options, table);
      
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
function updateTable({ commit, state }, player_id, writer) {
    
  const kServerTookTooLongError = "Server took too long to respond";
  function isServerTookTooLongError(error) {
    return error.message === kServerTookTooLongError;
  }

  // helper function to locally write changes
  function writeChangesLocal() {
    let table = JSON.parse(JSON.stringify(state.table));
    writer(table, state.options);
    commit(WRITE_TABLE, { table });
  }

  // helper function to show a connection error
  function showConnectionError(error) {
    
    // notify user
    firestore.showConnectionError(error);
   
    // set connected flag to false so we don't attempt pick timer picks
    commit(SET_CONNECTED, { connected: false });

    // log error if it's not one that occurs in the ordinary course of using firestore
    if (!isServerTookTooLongError(error) &&
        !firestore.isConnectivityError(error) && 
        !firestore.isAbortedError(error) &&
        !firestore.isDraftNotFoundError(error)) {
      log.logException(error, "onUpdateDraftTable");
    }
  }

  // local write for single player mode
  if (!state.options.multi_player) {

    // apply the changes
    writeChangesLocal();

    return Promise.resolve();

  } else if (state.waiting) {

    // if we are already waiting then show a connection error (note that
    // this should never happen b/c of the glass we throw over the UI 
    // when waiting, this is here as a precaution so we never, ever get
    // double-picks)
    showConnectionError(new Error(kServerTookTooLongError));

  } else {  

    // set state to waiting (provides glass with wait cursor)
    commit(SET_WAITING);

    // initialize transaction
    return firestore.updateDraftTable(state.id, table => writer(table, state.options))

      .catch(function(error) {
      
        // if this is a DraftNotFound then the draft has been removed from the firestore,
        // in that case flip into single-player mode
        if (firestore.isDraftNotFoundError(error)) {

          commit(CONVERT_TO_SINGLE_PLAYER, { player_id });       
          writeChangesLocal();

        } else {

          showConnectionError(error);

        }
      })
      .finally(() => {
         commit(CLEAR_WAITING);
      });
  } 

}

function packToPick(set_code, player_id, options, table, card, pile_number, insertBefore) {

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
  makePick(player_index, set_code, options, table, pile_number, card, insertBefore);

  // ai pick and pass loop
  draftBotPickAndPass(player_index, set_code, options, table);

  // check whether the pack is completed
  if (selectors.packCompleted(table)) {

    // if we still have packs to go then create the next pack
    if (table.current_pack < options.number_of_packs) {
      nextPack(set_code, options, table);
    } else {
      // complete picks
      completePicks(table);
    }

  }

}

function passPack(player_index, set_code, options, table) {

  // first remove the pack from our packs
  let player = table.players[player_index];
  let pack = player.packs.shift();

  // if this reveals a pack beneath the one we were 
  // just considering set the pick end time
  if (player.packs.length > 0)
    player.pick_end_time = nextPickEndTime(set_code, options, player);

  // now pass to the next player
  let next_player_index = selectors.nextPlayerIndex(
    player_index, 
    table.players.length, 
    table.current_pack
  );
  let next_player = table.players[next_player_index];
  next_player.packs.push(pack);

  // if the player previously had no packs in consideration
  // then set the pick_end_time
  if (next_player.packs.length === 1)
    next_player.pick_end_time = nextPickEndTime(set_code, options, next_player);

}

function resetPickTimer(player_id, set_code, options, table) {
  let player = selectors.activePlayer(player_id, table);
  player.pick_end_time = nextPickEndTime(set_code, options, player);
}

function nextPickEndTime(set_code, options, player) {
  let seconds_per_pick = 5;
  let pack_cards = set.pack_cards(set_code, options.number_of_packs);
  let max_pick_seconds = (seconds_per_pick * pack_cards);
  let cards_picked = _flatten(player.picks.piles).length;
  let current_pick = (cards_picked % pack_cards) + 1;
  let pick_seconds = max_pick_seconds + seconds_per_pick - (seconds_per_pick * current_pick);
  return new Date().getTime() + (1000 * pick_seconds);
}


function nextPack(set_code, options, table) {

  // grab next set of packs
  let packs = [];
  for (let i = 0; i < 8; i++)
    packs.push(table.all_packs.shift());

  // distribute packs
  for (let i = 0; i < packs.length; i++) {
    let player = table.players[i];
    player.packs = [packs[i]];
    player.pick_end_time = nextPickEndTime(set_code, options, player);
  }

  // update current pack
  table.current_pack++;
}

function distributeSealedPools(table, options) {

  // determine number of non-ai players, use that to truncate the 
  // sealed number of packs as necessary
  let playerCount = _sumBy(table.players, player => Number(player.id !== null));
  let maxPacksPerPlayer = table.all_packs.length / playerCount;
  let packsPerPlayer = Math.min(options.sealed_number_of_packs, maxPacksPerPlayer);

  // iterate over non-ai players
  for (let i=0; i<table.players.length; i++) {
    let player = table.players[i];
    if (player.id !== null) {

      // ensure we have enough packs left
      if (table.all_packs.length >= packsPerPlayer) {
        
        // grab packs
        let packs = [];
        for (let i = 0; i < packsPerPlayer; i++)
          packs.push(table.all_packs.shift());

        // add them all to the unused pile
        player.deck.piles[DECK.UNUSED] = _flatten(packs);
       
      } else {
        player.id = null;
        player.name = null;
        player.bot = draftbot.create();
      }
    }

    // set picks complete
    table.picks_complete = true;
  }

}

function makePick(player_index, set_code, options, table, pile_number, card, insertBefore) {

  // alias player
  let player = table.players[player_index];
  let piles = player.picks.piles;
  let pack = player.packs[0];

  // if the pile_number is null then arrange by cmc
  if (pile_number === null) {
    if (card.cmc <= 1)
      pile_number = 0;
    else if (card.cmc >= 7)
      pile_number = 6;
    else
      pile_number = card.cmc - 1;
  }

  // remove from pack
  pack.splice(cardIndex(pack, card), 1);

  // add to pile
  addCardToPile(player, piles[pile_number], card, insertBefore);

  // record pick_order
  player.picks.pick_order.push(card.id);

  // pass pack to next player if it's not empty
  if (pack.length > 0)
    passPack(player_index, set_code, options, table);

  // move picks to deck for non-ai players if we are done
  if (player.id !== null && selectors.picksComplete(player.id, set_code, options, table))
    movePicksToDeck(player, options);
}

function draftBotPickAndPass(player_index, set_code, options, table) {

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
        makePick(current_index, set_code, options, table, null, card, null);
      }
    }

    // advance to next player -
    current_index = selectors.nextPlayerIndex(
      current_index, 
      table.players.length, 
      table.current_pack
    );

  // terminate once we get back to the original player_index
  } while(current_index !== player_index);
}

function cardToDeckPile(c, deck) {

  // add card to pile
  let card = JSON.parse(JSON.stringify(c));
  let deck_piles = deck.piles;
  let pileIndex = selectors.cardDeckPileIndex(card);
  deck_piles[pileIndex].push(card);

  // return the pile index
  return pileIndex;
}

function deckToUnplayed(player_id, options, table, card, targetPile) {
  // move the card
  let player = selectors.activePlayer(player_id, table);
  let deck = player.deck;
  pileToPile(player, card, targetPile, deck.piles, null);
  // sort
  orderUnplayedPiles(deck);
  
  // apply auto-lands if necessary
  if (deck.lands.auto)
    deck.lands.basic = selectors.autoLands(deck, options.deck_size);
}

function unplayedToDeck(player_id, options, table, card, sourcePile, destPile, insertBefore) {
  // remove from sideboard/unused
  let player = selectors.activePlayer(player_id, table);
  let deck = player.deck;
  let source = deck.piles[sourcePile];
  source.splice(cardIndex(source, card), 1);

  // if the card has an explicit destination use it (unless it's a land)
  if (destPile !== null && destPile !== undefined && !filters.land(card)) {
    addCardToPile(player, deck.piles[destPile], card, insertBefore);
  } else {   
    let pileIndex = cardToDeckPile(card, deck);
    deck.piles[pileIndex] = orderDeckPile(deck.piles[pileIndex]);
  }

  // sort unplayed
  orderUnplayedPiles(deck);

  // apply auto-lands if necessary
  if (deck.lands.auto)
    deck.lands.basic = selectors.autoLands(deck, options.deck_size);
}

function movePicksToDeck(player, options) {

  // non-sideboard cards
  let picks = player.picks;
  let deck = player.deck;
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
  deck.piles = deck.piles.map(pile => orderDeckPile(pile));
 
  // sort unplayed cards
  orderUnplayedPiles(deck);
  
  // apply auto lands
  deck.lands.basic = selectors.autoLands(deck, options.deck_size);
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




function orderDeckPile(pile) {
  return _orderBy(pile, ["cmc", "name"], ["asc", "asc"]);
}

function orderUnplayedPiles(deck) {
  deck.piles[DECK.SIDEBOARD] = selectors.orderUnplayedPile(deck, DECK.SIDEBOARD);
  deck.piles[DECK.UNUSED] = selectors.orderUnplayedPile(deck, DECK.UNUSED);
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



