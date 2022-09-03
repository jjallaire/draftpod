

import * as cube from './cube'
import * as booster from './booster'
import * as filters from '../card-filters'

export default {

  name: "Dominaria United",

  pack_cards: () => {
    return 14;
  },

  cube: cube.build,

  booster(selectCards) {

    let cards = [];

    // determine our legendary slot
    if (Math.random() <= (1/4)) {
      cards.push(...selectCards(legendaryCreatureRare, 1));
      cards.push(...selectCards(uncommonNotLegendary, 3));
    } else {
      cards.push(...selectCards(rareNotLegendaryCreature, 1));
      cards.push(...selectCards(legendaryCreatureUncommon, 1));
      cards.push(...selectCards(uncommonNotLegendary, 2));
    } 

    cards.push(...selectCards(booster.common, 10));

    return cards;
  },
}

function legendary(card) {
  return card.type_line.startsWith("Legendary");
}

function legendaryCreature(card) {
  return card.type_line.startsWith("Legendary Creature");
}

function uncommonNotLegendary(card) {
  return filters.uncommon(card) && !legendary(card);
}

function rareNotLegendaryCreature(card) {
  return filters.packRareSlot(card) && !legendaryCreature(card);
}

function legendaryCreatureUncommon(card) {
  return (legendaryCreature(card) && filters.uncommon(card));
}

function legendaryCreatureRare(card) {
  return (legendaryCreature(card) && filters.packRareSlot(card));
}


