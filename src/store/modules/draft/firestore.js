
import * as log from '@/core/log'
import * as draftlog from './draftlog'
import * as serializer from './serializer'

import { firestore, draft_storage } from '@/core/firebase'
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
          ...draft,
          id: id,
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

  // save a draft log
  saveDraftLog(player_id, draft) {
    return ensureSignedIn()
      .then(() => {
        // prepare file to upload
        let logFileName =  shortUuid().new() + ".json";
        let draftLog = draftlog.generate(player_id, draft);
        let metadata = {
          name: logFileName,
          contentType: 'application/json',
        };

        // perform upload
        let storageRef = draft_storage.ref();
        let dayRef = storageRef.child(new Date(draftLog.time).toISOString().split("T")[0]);
        let logFileRef = dayRef.child(logFileName);
        return logFileRef.putString(
          JSON.stringify({ time: draftLog.time, packs: draftLog.packs }), 
          'raw', 
          metadata
        );        
      })
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      });
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

