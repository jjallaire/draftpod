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
  colors = Object.keys(colors).map(val => { return { code: val, ...colors[val] } });

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
 
  
  let main_deck = deck.piles.slice(0, DECK.SIDEBOARD).flat();
  let sideboard = deck.piles[DECK.SIDEBOARD];

  let basic_lands = [];
  if (deck.lands.basic.W > 0)
    basic_lands.push(deck.lands.basic.W + ' Plains');
  if (deck.lands.basic.U > 0)
    basic_lands.push(deck.lands.basic.U + ' Island');
  if (deck.lands.basic.B > 0)
    basic_lands.push(deck.lands.basic.B + ' Swamp');
  if (deck.lands.basic.R > 0)
    basic_lands.push(deck.lands.basic.R + ' Mountain');
  if (deck.lands.basic.G > 0)
    basic_lands.push(deck.lands.basic.G + ' Forest');
 
  // return deck list w/ main deck and sideboard
  return asDeckList(main_deck) +
         '\n' +  
         basic_lands.join('\n') +
         '\n\n' +
         asDeckList(sideboard);
}


// function to produce a text deck list
function asDeckList(cards) {
    
  // order by collector_number
  let ordered_cards = cards
    .slice()
    .sort((a,b) => a.collector_number - b.collector_number);
  
  // consolidate duplicates
  let card_counts = {};
  ordered_cards
    .map((card) => {
      if (!card_counts.hasOwnProperty(card.name))
        card_counts[card.name] = 0;
      card_counts[card.name]++;
    }
  );

  return Object.keys(card_counts)
    .map((name) => card_counts[name] + ' ' + name)
    .join("\n");
}




// sum all the values within an object
export function sumValues(object) {
  return Object.keys(object)
    .map(val => object[val])
    .reduce((total, count) => total + count, 0);
}


/*
console.log("Player 0: " + draftai.deckColors(selectors.deckCards(table.deck), 2));
for (let i = 0; i<table.players.length; i++) {
  
  let colors = draftai.deckColors(table.players[i].picks.piles[0], 2);
  console.log("Player " + (i+1) + ": " + colors.join("/"));
}


*/