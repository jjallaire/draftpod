
import * as log from '@/core/log'
import * as selectors from './selectors'
import * as serializer from './serializer'

// eslint-disable-next-line 
import * as messagebox from '@/components/core/messagebox.js'
import { firestore } from '../../firebase'
import shortUuid from 'short-uuid'

// track logged in status
import firebase from 'firebase/app'
import 'firebase/auth'

let _signedIn = false;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    _signedIn = true;
  } else {
    _signedIn = false;
  }
});

function ensureSignedIn() {
  if (!_signedIn)
    return firebase.auth().signInAnonymously();
  else
    return Promise.resolve();
}


export default {

  // create a draft within the firestore
  createDraft(id, draft) {
    return ensureSignedIn()
      .then(() => {
        return serializer.serializeDraftTable(draft.table);
      })
      .then(table => {
        return firestore.collection('drafts').doc(id).set({
          id: id,
          set: draft.set,
          options: draft.options,
          packs: draft.packs,
          table: table
        });
      })
      .then(() => {
        return id;
      });
  },

  getDraft(id) {
    return ensureSignedIn()
      .then(() => {
        return firestore.collection("drafts").doc(id).get();
      })
      .then(doc => {
        let draft = doc.data();
        if (draft) {
          return serializer.unserializeDraftTable(draft).then(table => {
            return {
              ...draft,
              table: table
            };
          });
        } else {
          return null;
        }
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

        // read the table
        return serializer.unserializeDraftTable(doc.data());

      })

      // apply the changes using the passed writer, then serialize
      .then(table => {

        writer(table);
        table.update_version = shortUuid().new();

        // serialize the table
        return serializer.serializeDraftTable(table);

      })
      
      // write the transaction
      .then(serializedTable => {

        transaction.update(docRef, {
          table: serializedTable
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
          serializer.unserializeDraftTable(draft)
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
  },

  isFirebaseError(error) {
    return error.name === "FirebaseError";
  },

  isAuthConnectivityError(error) {
    return error.name === "Error" && error.code === "auth/network-request-failed" ;
  },

  isUnavailableError(error) {
    this.isFirebaseError(error) && error.code === "unavailable";
  },

  isConnectivityError(error) {
    return this.isAuthConnectivityError(error) ||
           this.isUnavailableError(error)
  },

  isAbortedError(error) {
    return this.isFirebaseError(error) && error.code === "aborted";
  }

}

