


// firestore
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/app'

// initialize firebase
firebase.initializeApp({
  apiKey: "AIzaSyABxin54k8yFGsJa5YRofmvLOntb7shpAk",
  authDomain: "draftpod-5da26.firebaseapp.com",
  projectId: "draftpod-5da26",
  storageBucket: "draftpod-5da26.appspot.com",
  messagingSenderId: "979913671141"
});

export const firestore = firebase.firestore();

export const draft_storage = firebase.app().storage("gs://draftpod-drafts");





