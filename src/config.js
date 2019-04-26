


export default {

  site: {
    title: process.env.VUE_APP_SITE_TITLE || 'Draftpod',
    url: process.env.VUE_APP_SITE_URL || 'https://draftpod.org/',
    twitter: process.env.VUE_APP_SITE_TWITTER || 'https://twitter.com/DraftpodMTG'
  },

  ga: {
    id: "UA-134148899-1"
  },

  sentry: {
    dsn: "https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583"
  },

  firebase: {
    apiKey: "AIzaSyABxin54k8yFGsJa5YRofmvLOntb7shpAk",
    authDomain: "draftpod-5da26.firebaseapp.com",
    projectId: "draftpod-5da26",
    storageBucket: "draftpod-5da26.appspot.com",
    draftsBucket: "draftpod-drafts",
    pickOrdersBucket: "draftpod-pick-orders",
    messagingSenderId: "979913671141",
  }

}