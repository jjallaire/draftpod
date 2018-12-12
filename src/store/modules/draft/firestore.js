
import { firestore } from '../../firebase'

export default {

  // create a draft within the firestore
  createDraft(id, draft) {
    return firestore.collection('drafts').doc(id).set({
      set: draft.set,
      options: draft.options,
      table: JSON.stringify(draft.table)
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

        // apply the changes using the passed writer
        let table = JSON.parse(doc.data().table);
        writer(table);

        // update the database
        transaction.update(docRef, {
          table: JSON.stringify(table)
        });
      });
    });
  },

  // subscribe to updates
  onDraftTableChanged(id, onchanged) {
    return firestore.collection("drafts").doc(id)
      .onSnapshot(doc => {
        let table = JSON.parse(doc.data().table);
        onchanged(table);
      }, error => {
        // TODO: improve handling
        // eslint-disable-next-line
        console.log(error);
      });
  },

}