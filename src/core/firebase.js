


import config from '../config'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/app'

// initialize firebase
firebase.initializeApp({
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId
});

export const firestore = firebase.firestore();

export const draft_storage = firebase.app()
  .storage("gs://" + config.firebase.draftsBucket);





