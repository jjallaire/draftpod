
import shortUuid from 'short-uuid'

import _shuffle from 'lodash/shuffle'
import _pullAt from 'lodash/pullAt'

import * as selectors from '@/store/modules/draft/selectors.js'
import * as filters from '@/store/modules/draft/card-filters'

import * as set from './set/'

// NOTE: this function mutates the 'cardpool' as it draws cards to create packs

export function generateBooster(set_code, cardpool, pack_number, number_of_packs = 3) {

  // determine the set code from the pack_number
  let pack_set = set.pack_set(set_code, pack_number);

  // references to variables mutated by our functions
  let booster = null;
  let cardpool_copy = null;
  let selectedCardIds = null;

  function select(filter, number) {

    // generate range of indexes then shuffle it
    let indexes = _shuffle([...Array(cardpool_copy.length).keys()]);

    // scan through the cards and match the filter
    let selectedIndexes = [];
    let cards = [];
    for (let i = 0; i < indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool_copy[index];
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
    _pullAt(cardpool_copy, selectedIndexes);

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

  // we want to apply some screening criteria to boosters (e.g.
  // balance of colors among commons, never having >=3 of the same
  // color among uncommons/rares, etc.). we will therefore try
  // up to 10 times to generate a booster that passes the criteria
  // (we can't do it infinitely or else we might never exit the loop)
  for (let b=0; b<10; b++) {

    // make a copy of the cardpool
    cardpool_copy = cardpool.slice();

    // track cards already selected (to prevent duplicates)
    selectedCardIds = [];

    // generate booster 
    booster = set.booster(set_code, selectCards, number_of_packs);

    // see if the booster passes our filter (break if it does)
    if (boosterFilter(booster)) 
      break;
  }

  // update the cardpool
  cardpool.splice(0, cardpool.length, ...cardpool_copy);

  // return the booster
  return booster;

 
}

function boosterFilter(booster) {
  
  // check for color diversity (at least 2 cards of each color)
  const kMinColors = 2;
  let colors = selectors.countColors(booster);
  let isDiverse = 
    colors.W >= kMinColors &&
    colors.U >= kMinColors &&
    colors.B >= kMinColors &&
    colors.R >= kMinColors &&
    colors.G >= kMinColors;
  if (!isDiverse)
    return false;

  // check for no color spikes in uncommons/rares
  const kMaxColors = 2;
  let nonCommons = booster.filter(card => !filters.common(card));
  let nonCommonColors = selectors.countColors(nonCommons);
  let isSpiked = 
    nonCommonColors.W > kMaxColors ||
    nonCommonColors.U > kMaxColors ||
    nonCommonColors.B > kMaxColors ||
    nonCommonColors.R > kMaxColors ||
    nonCommonColors.G > kMinColors;
  if (isSpiked)
    return false;

  // pack is okay
  return true;

}

