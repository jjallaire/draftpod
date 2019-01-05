
import * as log from '@/log'
import { firestore } from '../../firebase'
import * as set from './set'

export default {

  // create a draft within the firestore
  createDraft(id, draft) {
    return serializeDraftTable(draft.table).then(table => {
      return firestore.collection('drafts').doc(id).set({
        id: id,
        set: draft.set,
        options: draft.options,
        packs: draft.packs,
        table: table
      });
    });
  },

  getDraft(id) {
    return new Promise((resolve, reject) => {
      firestore.collection("drafts").doc(id).get().then(doc => {
        let draft = doc.data();
        return unserializeDraftTable(draft.set.code, draft.table).then(table => {
          resolve({
            ...draft,
            table: table
          });
        });
      })
      .catch(error => {
        reject(error);
      });
    });
    
  },

  // update the draft table
  updateDraftTable(id, writer) {

    // get a reference to the draft document
    let docRef = firestore.collection("drafts").doc(id);

    // run the transaction
    return firestore.runTransaction(transaction => {

      // fetch the latest copy of the draft table
      return transaction.get(docRef).then(doc => {

        // get the draft
        let draft = doc.data();

        // read the table
        return unserializeDraftTable(draft.set.code, draft.table).then(table => {

          // apply the changes using the passed writer
          writer(table);

          // update the database
          return serializeDraftTable(table).then(table => {
            transaction.update(docRef, {
              table: table
            });
          });
        });
      });
    });
  },

  // subscribe to updates
  onDraftTableChanged(id, onchanged) {
    return firestore.collection("drafts").doc(id)
      .onSnapshot(doc => {
        let draft = doc.data();
        if (draft) {
          unserializeDraftTable(draft.set.code, draft.table)
            .then(onchanged)
            .catch(log.logException);
        }
      }, error => {
        log.logException(error, "onDraftTableChanged");
      });
  },

}

function serializeDraftTable(table) {
  return new Promise((resolve) => {
    // convert cards to card ids
    let saved_table = convertDraftTable(table, cardsToIds);

    // serialize as json string
    resolve(JSON.stringify(saved_table));
  });
}

function unserializeDraftTable(set_code, table) {
  return new Promise((resolve) => {
    return set.cards(set_code).then(set_cards => {
      // parse from json string
      let saved_table = JSON.parse(table);
    
      // return the table w/ ids converted to cards
      resolve(
        convertDraftTable(saved_table, idsToCards(set_cards))
      );
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
