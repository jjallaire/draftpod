
import * as log from '@/log'
import { firestore } from '../../firebase'

export default {

  // constants for rejected promises
  error_invalidated: "0972183F-BA7B-49F8-A402-4EA22F33640D",

  // create a draft within the firestore
  createDraft(id, draft) {
    return serializeDraftTable(draft.table).then(table => {
      return firestore.collection('drafts').doc(id).set({
        id: id,
        set: draft.set,
        options: draft.options,
        table: table
      });
    });
  },

  getDraft(id) {
    return new Promise((resolve, reject) => {
      firestore.collection("drafts").doc(id).get().then(doc => {
        return unserializeDraftTable(doc.data().table).then(table => {
          resolve({
            ...doc.data(),
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
  updateDraftTable(id, writer, invalidator) {

    // get a reference to the draft document
    let docRef = firestore.collection("drafts").doc(id);

    // run the transaction
    return firestore.runTransaction(transaction => {

      // fetch the latest copy of the draft table
      return transaction.get(docRef).then(doc => {

        // read the table
        return unserializeDraftTable(doc.data().table).then(table => {

          // use optional invalidator to confirm we should still perform the write
          if (invalidator && !invalidator(table))
            return Promise.reject(this.error_invalidated);

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
        let data = doc.data();
        if (data) {
          unserializeDraftTable(data.table)
            .then(onchanged)
            .catch(log.logException);
        }
      }, error => {
        log.logException(error);
      });
  },

}

function serializeDraftTable(table) {
  return new Promise((resolve) => {
    resolve(JSON.stringify(table));
  });
}

function unserializeDraftTable(table) {
  return new Promise((resolve) => {
    resolve(JSON.parse(table));
  });
}