import * as filters from './card-filters'
import { DECK } from './constants'

// get card types
export function cardTypes(cards) {
  return {
    creatures: cards.filter(filters.creature).length,
    other: cards.filter((card) => !filters.creature(card) && !filters.land(card)).length,
    lands: cards.filter(filters.land).length
  }
}

// count card colors 
export function cardColors(cards) {
  let colors = {
    W: {
      name: "Plains",
      img: "/images/mana-white.svg",
      count: 0
    },
    B: {
      name: "Swamp",
      img: "/images/mana-black.svg",
      count: 0
    },
    U: {
      name: "Island",
      img: "/images/mana-blue.svg",
      count: 0
    },
    R: {
      name: "Mountain",
      img: "/images/mana-red.svg",
      count: 0
    },
    G: {
      name: "Forest",
      img: "/images/mana-green.svg",
      count: 0
    },
    C: {
      name: "Colorless",
      img: "/images/mana-colorless.svg",
      count: 0
    },
  };
  for (let i=0; i<cards.length; i++) {
    let card = cards[i];
    if (filters.land(card))
      continue;
    if (card.colors.length === 0)
      colors["C"].count++;
    else
      for (let c=0; c<card.colors.length; c++)
        colors[card.colors[c]].count++;
  }

  // get array of colors
  colors = Object.keys(colors).map(val => colors[val]);

  // compute percents
  let total_cards = colors.reduce((total, color) => total + color.count, 0);
  colors = colors.map(function(color) {
    return {...color, percent: total_cards > 0 ? color.count / total_cards : 0 }
  });

  // return
  return colors.sort(function(a, b) {
    return b.count - a.count;
  });
}


export function activeCards(table) {
  let piles = table.picks_complete ? table.deck.piles : table.picks.piles;
  return piles.slice(0, DECK.PILES).flat();
}

export function deckCards(deck) {
  return deck.piles.slice(0, DECK.PILES).flat();
} 

export function deckLandCount(deck) {
  let basic_lands = deck.lands.basic;
  return deck.piles[DECK.PILES].length + sumValues(basic_lands);
}

export function deckTotalCards(deck) {
  return deckCards(deck).length + deckLandCount(deck);
}

export function deckList(deck) {
 
  // main deck
  const card_name = (card) => card.name;
  let main_deck = [].concat(
    // cards
    deck.piles.slice(0, DECK.PILES).flat().map(card_name),
    // special lands
    deck.piles[DECK.LANDS].map(card_name),
    // basic lands
    Array(deck.lands.basic.R).fill("Mountain"),
    Array(deck.lands.basic.W).fill("Plains"),
    Array(deck.lands.basic.U).fill("Island"),
    Array(deck.lands.basic.B).fill("Swamp"),
    Array(deck.lands.basic.G).fill("Forest")
  );

  // sideboard
  let sideboard = deck.piles[DECK.SIDEBOARD].map(card_name);
    
  // return deck list w/ main deck and sideboard
  return asDeckList(main_deck) + 
         '\n\n' +
         asDeckList(sideboard);
}


// function to produce a text deck list
function asDeckList(cards) {
    
  // conslidate duplicates
  let deck_list = {};
  cards
    .slice()
    .sort()
    .map((name) => {
      if (!deck_list.hasOwnProperty(name))
        deck_list[name] = 0;
      deck_list[name]++;
    }
  );

  // return as list
  return Object.keys(deck_list)
    .map((name) => deck_list[name] + ' ' + name)
    .join("\n");
}




// sum all the values within an object
export function sumValues(object) {
  return Object.keys(object)
    .map(val => object[val])
    .reduce((total, count) => total + count, 0);
}

