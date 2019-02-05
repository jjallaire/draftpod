const functions = require('firebase-functions');
const admin = require('firebase-admin'); 
admin.initializeApp(); //init firebase admin

// admin.firestore().collection('companies').doc(companyID)

exports.cleanupDrafts = functions.firestore
  .document("drafts/{draftId}")
  .onCreate((snap, context) => {

    
    console.log("Draft created: " + snap.data().id);

  });

exports.helloWorld = functions.https.onRequest((request, response) => {
  

  let firestore = admin.firestore()
  return firestore.getCollections().then(querySnapshot => {
    let cols = [];
    querySnapshot.forEach(collection => {
      console.log("collection: " + collection.id);
      cols.push(collection.id);
    });
    response.send("All done: " + cols.join("\n"));
    return null;
  });
  

});

