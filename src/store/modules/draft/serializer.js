
import * as set from './set'
import * as log from '@/core/log'

export function serializeDraftTable(table) {
  return new Promise((resolve, reject) => {
    // convert cards to card ids
    try {
      let saved_table = convertDraftTable(table, cardsToIds);
      resolve(JSON.stringify(saved_table));
    } catch(error) {
      log.addBreadcrumb('table', JSON.stringify(table));
      reject(error);
    } 
  });
}

export function unserializeDraftTable(set_code, table) {
  return new Promise((resolve, reject) => {
    return set.cards(set_code).then(set_cards => {
      // parse from json string
      let saved_table = JSON.parse(table);
    
      // return the table w/ ids converted to cards
      try {
        resolve(
          convertDraftTable(saved_table, idsToCards(set_cards))
        );
      } catch(error) {
        log.addBreadcrumb('table', table);
        reject(error);
      }
    });
  });
}


function convertDraftTable(table, cardConverter) {
  return {
    ...table,
    all_packs: table.all_packs.map(cardConverter),
    players: table.players.map(player => {
      return {
        ...player,
        deck: {
          ...player.deck,
          piles: player.deck.piles.map(cardConverter)
        },
        picks: {
          ...player.picks,
          packs: player.packs.map(cardConverter),
          piles: player.picks.piles.map(cardConverter)
        },

      }
   })
  };
}

function cardsToIds(cards) {
  return cards.map(card => {
    if (card !== null) {
      // if the card has a key then save that too
      if (card.key)
        return { id: card.id, key: card.key }
      // otherwise just save the plain integer id
      else
        return card.id;
    } else {
      return null;
    }
  });  
}

function idsToCards(set_cards) {

  // build a hash-table for the cards
  let cards = {};
  set_cards.forEach(card => {
    cards[card.id] = card;
  });

  // unserialize either plain ids or object with id/key
  return function(ids) {
    return ids.map(id => { 
      if (typeof id === 'object')
        return { ...cards[id.id], key: id.key };
      else
        return cards[id];
    });
  }
}

