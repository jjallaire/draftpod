
import * as log from '@/log'
import * as set from './set'
import * as selectors from './selectors'
// eslint-disable-next-line 
import * as messagebox from '@/components/core/messagebox.js'
import { firestore } from '../../firebase'
import shortUuid from 'short-uuid'

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

          // apply the changes using the passed writer then write an update_version
          writer(table);
          table.update_version = shortUuid().new();

          // update the database
          return serializeDraftTable(table).then(serializedTable => {
            transaction.update(docRef, {
              table: serializedTable
            });
            return table;
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
            .catch(error => {
              log.logException(error, "onDraftTableChangedUnserialize");
            });
        }
      }, error => {
        log.logException(error, "onDraftTableChanged");
      });
  },

  validateClient(player_id, client_id, table) {
    if (player_id !== null && client_id !== null) {
      
      let player = selectors.activePlayer(player_id, table);

      // player has been removed from the draft
      if (player === undefined) {
        return false;
      }

      // another browser has taken over this draft
      else if (client_id !== player.client_id) {
        messagebox.alert(
          "Disconnected from Draft", 
          "<p>Another browser was connected to this draft, so this browser was disconnected.</p>" +
          "You can reconnect by clicking the button below.",
          () => {
            window.location.reload();
          },
          "Reconnect to Draft",
          false
        );
        return false;
      }
    } 
    return true;
  }

}

function serializeDraftTable(table) {
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

function unserializeDraftTable(set_code, table) {
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
