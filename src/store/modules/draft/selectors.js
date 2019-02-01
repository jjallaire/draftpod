import _flatten from 'lodash/flatten'
import _remove from 'lodash/remove'

import * as filters from './card-filters'
import * as draftbot from './draftbot'
import * as set from './set'
import { DECK } from './constants'

const local_images = true && process.env.NODE_ENV !== 'production';

// get card image_uris (support local images for development)
export function cardImageUris(card) {
  if (local_images)
    return card.multiverse_ids.map((id) => "/images/cards/" + id + ".jpg");
  else
    return card.image_uris;
}

// get card types
export function cardTypes(cards) {
  return {
    creatures: cards.filter(filters.creature).length,
    other: cards.filter((card) => !filters.creature(card) && !filters.land(card)).length,
    lands: cards.filter(filters.land).length
  }
}

export function cardColorInfo(code) {
  switch(code) {
    case 'W': return {
      code: 'W',
      name: "Plains",
      img: "/images/mana-white.svg",
      count: 0
    };
    case 'B': return {
      code: 'B',
      name: "Swamp",
      img: "/images/mana-black.svg",
      count: 0
    };
    case 'U': return {
      code: 'U',
      name: "Island",
      img: "/images/mana-blue.svg",
      count: 0
    };
    case 'R': return {
      code: 'R',
      name: "Mountain",
      img: "/images/mana-red.svg",
      count: 0
    };
    case 'G': return {
      code: 'G',
      name: "Forest",
      img: "/images/mana-green.svg",
      count: 0
    };
    case 'C':  return {
      code: 'C',
      name: "Colorless",
      img: "/images/mana-colorless.svg",
      count: 0
    };
  }
}

// count card colors 
export function cardColors(cards, includeLands = false, percentFilter = null, maxColors = null) {
  let colors = {
    W: cardColorInfo('W'),
    B: cardColorInfo('B'),
    U: cardColorInfo('U'),
    R: cardColorInfo('R'),
    G: cardColorInfo('G'),
    C: cardColorInfo('C')
  };
  for (let i=0; i<cards.length; i++) {
    let card = cards[i];
    if (!includeLands && filters.land(card))
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

  // sort by frequency
  colors = colors.sort(function(a, b) {
    return b.count - a.count;
  });

  // apply filter if requested
  if (percentFilter !== null)
    colors = colors.filter((color) => color.percent > percentFilter);

  // apply maxColors if requested
  if (maxColors !== null)
    colors = colors.slice(0, maxColors);

  // return
  return colors;
}

export function playerColors(player_id, table) {
  
  // get colors
  let colors = cardColors(activeCards(player_id, table), false, 0, 2);

  // order them
  return orderColorPair(colors);

}

export function orderColorPair(colors) {
  
  // apply standard ordering
  if (colors.length === 2) {
    let standardPairs = [
      ['W', 'U'], // azorious
      ['U', 'B'], // dimir
      ['B', 'R'], // rakdos
      ['R', 'G'], // gruul
      ['G', 'W'], // selesnya
      ['W', 'B'], // orzhov
      ['U', 'R'], // izzet
      ['B', 'G'], // golgari
      ['R', 'W'], // boros
      ['G', 'U'], // simic
    ];
    for (let i = 0; i<standardPairs.length; i++) {
      let colorPair = standardPairs[i];
      if (colors[0].code === colorPair[1] && colors[1].code === colorPair[0])
        return [colors[1], colors[0]];
    }    
  } 

  // fall through to just return the colors unmodified
  return colors;
}

export function draftThumbnail(player_id, draft) {
  let player = activePlayer(player_id, draft.table);
  let active_cards = activeCards(player_id, draft.table);
  if (active_cards.length > 0)
    return cardImageUris(draftbot.pick(player.bot, active_cards, active_cards))[0];
  else 
    return null;
}

export function isStarted(table) {
  return table.start_time !== null;
}

export function hasPlayer(player_id, table) {
  return activePlayer(player_id, table) !== undefined;
}

export function playerIndex(player_id, table) {
  return table.players.findIndex((player) => player.id === player_id);
}

export function picksComplete(player_id, set_code, table) {
  
  if (table.picks_complete)
    return true;

  let cards_picked = activeCards(player_id, table).length;
  let total_cards = set.pack_cards(set_code) * 3;
  return cards_picked >= total_cards; 
}

export function currentPick(player_id, set_code, table) {
  if (!table.picks_complete) {
    let cards_picked = activeCards(player_id, table).length;
    let current_pick = (cards_picked % set.pack_cards(set_code)) + 1;
    return current_pick;
  } else {
    return 0;
  }
}

export function currentPack(player_id, set_code, table) {
  if (!table.picks_complete) {
    let cards_picked = activeCards(player_id, table).length;
    return Math.floor((cards_picked / set.pack_cards(set_code))) + 1;
  } else {
    return 0;
  }
}

export function packCompleted(table) {
  // if any players still have cards to pick from then we are not complete
  for (let i = 0; i<table.players.length; i++) {
    let player = table.players[i];
    if (player.packs.length > 0 && player.packs[0].length > 0)
      return false;
  }
  // otherwise are complete
  return true;
}

export function activePlayer(player_id, table) {
  return table.players.find((player) => player.id === player_id);
}

export function activePack(player_id, table) {
  let player = activePlayer(player_id, table);
  let packs = player.packs;
  if (packs.length > 0 && packs[0].length > 0)
    return packs[0];
  else
    return null;
}

export function hostPlayerName(table) {
  return table.players[0].name;
}

export function allPlayerNames(table) {
  return table.players
    .filter((player) => player.id !== null && player.name !== null)
    .map((player) => player.name);
}

export function activeCards(player_id, table) {
  let player = activePlayer(player_id, table);
  let piles = table.picks_complete ? player.deck.piles : player.picks.piles;
  return _flatten(piles.slice(0, DECK.PILES));
}

export function deckCards(deck) {
  return _flatten(deck.piles.slice(0, DECK.PILES));
} 

export function deckLandCount(deck) {
  let basic_lands = deck.lands.basic;
  return deck.piles[DECK.PILES].length + sumValues(basic_lands);
}

export function deckTotalCards(deck) {
  return deckCards(deck).length + deckLandCount(deck);
}


export function deckList(deck) {
   
  let main_deck = _flatten(deck.piles.slice(0, DECK.SIDEBOARD));
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


export function draftLog(player_id, draft) {

  // draft log
  let botIdx = 1;
  let playerIdx = 1;
  let log = {
    time: draft.table.start_time,
    players: draft.table.players.map(player => {
      if (player.id === player_id) {
        playerIdx++;
        return "Me";
      } else if (player.name)
        return "Player"  + playerIdx++;
      else 
        return "Bot" + botIdx++;
    }),
    packs: [...Array(3)].map(function() {
      return {
        set: draft.set.code.toUpperCase(),
        picks: []
      };
    })
  };

  // replay the draft using the saved packs and pick orders
  let all_packs = JSON.parse(JSON.stringify(draft.packs)).map(pack => {
    return pack.split(',').map(parseFloat);
  });
  let players = draft.table.players.map(player => {
    return {
      pick_order: player.picks.pick_order,
      picks: []
    }
  });

  // get a reference to the player
  let player_index = playerIndex(player_id, draft.table);
  
  // for each pack
  for (let pack_index=0; pack_index<3; pack_index++) {

    // get the next set of 8 packs and distribute it
    for (let i = 0; i < players.length; i++)
      players[i].pack = all_packs.shift();

    // cycle through the ~ 15 cards in the pack
    let pack_cards = set.pack_cards(draft.set.code);
    for (let i = 0; i<pack_cards; i++) {

      // have all the players make their next pick
      for (let p = 0; p<players.length; p++) {

        // determine the pick
        let player = players[p];
        let pick_index = (pack_index * pack_cards) + i;
        let pick = player.pick_order[pick_index];

        // record for the player_index we are building a log for
        if (p === player_index) {
          let player_pick = {
            pack: JSON.parse(JSON.stringify(player.pack)),
            pick: pick
          };
          log.packs[pack_index].picks.push(player_pick);
        }

        // remove the pick from the pack
        _remove(player.pack, card => card === pick);
      }

      // pass the packs
      let next_packs = [...Array(players.length)];
      for (let p = 0; p<players.length; p++) {
        let next_index = nextPlayerIndex(p, players.length, pack_index + 1);
        next_packs[next_index] = JSON.parse(JSON.stringify(players[p].pack));
      }
      for (let p = 0; p<players.length; p++) {
        players[p].pack = next_packs[p];
      }

    }

  }

  return log;
}


export function nextPlayerIndex(player_index, total_players, current_pack) {

  let next_player_index = 0;

  if (current_pack === 2) {

    next_player_index = player_index + 1;
    if (next_player_index >= total_players)
      next_player_index = 0;

    // pass left
  } else {

    next_player_index = player_index - 1;
    if (next_player_index < 0)
      next_player_index = total_players - 1;

  }

  return next_player_index;
}


// sum all the values within an object
export function sumValues(object) {
  return Object.keys(object)
    .map(val => object[val])
    .reduce((total, count) => total + count, 0);
}
