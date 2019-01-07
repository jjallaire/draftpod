
export const CREATE_DRAFT = 'CREATE_DRAFT'
export const WRITE_TABLE = 'WRITE_TABLE'

import * as set from './set/'

import shortUuid from 'short-uuid'
import _shuffle from 'lodash/shuffle'
import _flatten from 'lodash/flatten'
import _pullAt from 'lodash/pullAt'

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

    // save the packs we started with
    state.packs = state.table.all_packs
      .map(pack => pack.map(card => card.id).join(','));
  },

  [WRITE_TABLE](state, { table, update_version }) {
    writeTable(state, table, update_version);
  },

};

// write initial values for the table (no firebase sync as we
// will want to initialize firebase with these values)
function initTable(state, writer) {
  let table = JSON.parse(JSON.stringify(state.table));
  writer(table);
  writeTable(state, table);
}


function writeTable(state, table, update_version) {
  Vue.set(state, "table", {
    ...table,
    update_version: update_version || shortUuid().new()
  });
}


function booster(set_code, cardpool) {

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
  return set.booster(set_code, selectCards);
}




