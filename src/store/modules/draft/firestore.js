
import * as log from '@/core/log'
import * as selectors from './selectors'
import * as serializer from './serializer'

// eslint-disable-next-line 
import * as messagebox from '@/components/core/messagebox.js'
import { firestore } from '../../firebase'
import shortUuid from 'short-uuid'

export default {

  // create a draft within the firestore
  createDraft(id, draft) {
    return serializer.serializeDraftTable(draft.table).then(table => {
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
        if (draft) {
          return serializer.unserializeDraftTable(draft.set.code, draft.table).then(table => {
            resolve({
              ...draft,
              table: table
            });
          });
        } else {
          resolve(null);
        }
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
        return serializer.unserializeDraftTable(draft.set.code, draft.table).then(table => {

          // apply the changes using the passed writer then write an update_version
          writer(table);
          table.update_version = shortUuid().new();

          // update the database
          return serializer.serializeDraftTable(table).then(serializedTable => {
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
          serializer.unserializeDraftTable(draft.set.code, draft.table)
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

