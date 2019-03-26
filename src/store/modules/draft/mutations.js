
export const CREATE_DRAFT = 'CREATE_DRAFT'
export const WRITE_TABLE = 'WRITE_TABLE'
export const SET_CONNECTED = 'SET_CONNECTED'
export const SET_WAITING = 'SET_WAITING'
export const CLEAR_WAITING = 'CLEAR_WAITING'
export const SET_SHOW_BOT_COLORS = 'SET_SHOW_BOT_COLORS'
export const CONVERT_TO_SINGLE_PLAYER = 'CONVERT_TO_SINGLE_PLAYER'

import * as set from './set/'
import * as draftbot from './draftbot'

import shortUuid from 'short-uuid'
import _shuffle from 'lodash/shuffle'
import _pullAt from 'lodash/pullAt'

import Vue from 'vue';

export default {

  [CREATE_DRAFT](state, { id, player, set_code, cardpool, options }) {

    // initialize id and event id
    state.id = id;

    // initialize set
    state.set = {
      code: set_code,
      name: set.name(set_code),
      pack_cards: set.pack_cards(set_code, options.number_of_packs)
    }

    // initialize options
    state.options = {
      ...state.options,
      ...options,
    };

    initTable(state, (table, options) => {

      // set the player info to the first player
      table.players[0].id = player.id;
      table.players[0].name = player.name;
      table.players[0].bot = draftbot.createAutoPicker();

      // compute number of packs
      let packs = options.number_of_packs * 8;

      // initialize packs
      table.all_packs = [...Array(packs)].map(function() {
        return booster(set_code, options.number_of_packs, cardpool);
      });
    });

    // save the packs we started with
    state.packs = state.table.all_packs
      .map(pack => pack.map(card => card.id).join(','));
  },

  [WRITE_TABLE](state, { table }) {
    writeTable(state, table);
  },

  [SET_SHOW_BOT_COLORS](state, { show_bot_colors }) {
    state.options.show_bot_colors = show_bot_colors;
  },

  [SET_CONNECTED](state, { connected }) {
    state.connected = connected;
  },

  [SET_WAITING](state) {
    state.waiting = new Date().getTime();
  },

  [CLEAR_WAITING](state) {
    state.waiting = null;
  },

  [CONVERT_TO_SINGLE_PLAYER](state, { player_id }) {
    
    // convert any player not myself into a bot
    state.table.players.forEach(player => {
      if (player.id !== player_id) {
        player.id = null;
        player.name = null;
        player.bot = draftbot.create();
      }
    });

    // turn off master multi-player flag
    state.options.multi_player = false;

    // reset connected and waiting flags
    state.connected = true;
    state.waiting = null;
  }
};

// write initial values for the table (no firebase sync as we
// will want to initialize firebase with these values)
function initTable(state, writer) {
  let table = JSON.parse(JSON.stringify(state.table));
  writer(table, state.options);
  writeTable(state, table);
}

function writeTable(state, table) {
  Vue.set(state, "table", table);
}


function booster(set_code, number_of_packs, cardpool) {

  // track cards already selected (to prevent duplicates)
  let selectedCardIds = [];

  function select(filter, number) {

    // generate range of indexes then shuffle it
    let indexes = _shuffle([...Array(cardpool.length).keys()]);

    // scan through the cards and match the filter
    let selectedIndexes = [];
    let cards = [];
    for (let i = 0; i < indexes.length; i++) {
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
        cards.push({
          ...card,
          key: shortUuid().new()
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
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      cards = cards.concat(select(filter, number - cards.length));
      if (cards.length >= number)
        break;
    }

    // return the cards
    return cards;
  }

  // generate booster for set using selectCards function
  return set.booster(set_code, selectCards, number_of_packs);
}




