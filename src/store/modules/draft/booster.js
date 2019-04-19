
import shortUuid from 'short-uuid'

import _shuffle from 'lodash/shuffle'
import _pullAt from 'lodash/pullAt'

import * as set from './set/'

// NOTE: this function mutates the 'cardpool' as it draws cards to create packs

export function generateBooster(set_code, cardpool, pack_number, number_of_packs = 3) {

  // determine the set code from the pack_number
  let pack_set = set.pack_set(set_code, pack_number);

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
      if ((set.is_custom_cube(set_code) || (card.set === pack_set)) && filter(card)) {

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



