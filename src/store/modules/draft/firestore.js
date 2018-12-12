
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
  updateDraftTable(id, table) {
    return firestore.collection("drafts").doc(id).update({
      table: JSON.stringify(table)
    });
  },

  // subscribe to updates
  onDraftTableChanged(id, onchanged) {
    return firestore.collection("drafts").doc(id)
      .onSnapshot(doc => {
        let table = JSON.parse(doc.data().table);
        onchanged(table);
    });
  },

}