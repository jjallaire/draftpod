import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'


// TODO: firebase:

//   - https://www.smashingmagazine.com/2018/04/vuejs-firebase-firestore/
//    (describes how to setup security)

//    Use onSnapshot to detect writes by other users

//   - https://vuejsdevelopers.com/2017/10/16/vue-js-firestore/



//   - https://medium.com/js-dojo/build-a-realtime-chat-app-with-vuejs-vuex-and-firestore-32d081668709
//   - https://medium.com/@amenallah.hsoumi/building-a-progressive-quiz-app-with-vue-vuex-and-firestore-part-1-ce73c7ba695d

// a library (but we should probably learn the low-level basics first):
//    - https://mesqueeb.github.io/vuex-easy-firestore/
// another library:
//    - https://github.com/fiery-data/fiery-vuex


// TODO: favicon

// TODO: remove mana and set symbols?

// TODO: import Decked Builder YAML (.coll2)

// TODO: sideboard:
//    - automatic ordering?
//    - drop targets to deck not big enough
//    - trash/hide/second pile (pile which won't be in decklist) 


// configure sentry in production mode
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');


