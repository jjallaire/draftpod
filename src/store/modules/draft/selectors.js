import * as filters from './card-filters'

// get card types
export function cardTypes(cards) {
  return {
    creatures: cards.filter(filters.creature).length,
    other: cards.filter((card) => !filters.creature(card) && !filters.land(card)).length,
    lands: cards.filter(filters.land).length
  }
}

export function activeCards(table) {
  let piles = table.picks_complete ? table.deck.piles : table.picks.piles;
  return piles.slice(0, 7).flat();
}

export function deckCards(deck) {
  return deck.piles.slice(0, 6).flat();
} 

export function deckLandCount(deck) {
  let basic_lands = deck.lands.basic;
  return deck.piles[6].length + sumValues(basic_lands);
}

export function deckTotalCards(deck) {
  return deckCards(deck).length + deckLandCount(deck);
}

export function deckList(deck) {
 
  // main deck
  const card_name = (card) => card.name;
  let main_deck = [].concat(
    // cards
    deck.piles.slice(0, 6).flat().map(card_name),
    // special lands
    deck.piles[6].map(card_name),
    // basic lands
    Array(deck.lands.basic.R).fill("Mountain"),
    Array(deck.lands.basic.W).fill("Plains"),
    Array(deck.lands.basic.U).fill("Island"),
    Array(deck.lands.basic.B).fill("Swamp"),
    Array(deck.lands.basic.G).fill("Forest")
  );

  // sideboard
  let sideboard = deck.piles[7].map(card_name);
    
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

