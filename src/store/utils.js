
export function initialState() {
  return {
    set_code: null,
    cardpool: [],
    all_packs: [],
    current_pack: 0,
    current_pick: 0,
    current_time: new Date(),
    pick_timer: true,
    pick_end_time: new Date(),
    picks_complete: false,
    show_pick_analysis: false,
    players: [...Array(8)].map(function() {
      return {
        draft: {
          pack: [],
          piles: [...Array(8)].map(() => Array()),
        },
        deck: {
          piles: [...Array(8)].map(() => Array()),
          basic_lands: {
            R: 0,
            W: 0,
            U: 0,
            B: 0,
            G: 0
          },
          auto_lands: true
        },
        card_preview: null
      }
    }),
  }
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
    Array(deck.basic_lands.R).fill("Mountain"),
    Array(deck.basic_lands.W).fill("Plains"),
    Array(deck.basic_lands.U).fill("Island"),
    Array(deck.basic_lands.B).fill("Swamp"),
    Array(deck.basic_lands.G).fill("Forest")
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

