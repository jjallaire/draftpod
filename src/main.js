import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'

// https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
// https://alligator.io/vuejs/file-reader-component/
// https://www.papaparse.com/


// TODO: ability to specify/upload custom cardpools
//   http://www.deckedbuilder.com/ (easy entry and exports w/ multiverse-id)
//   https://deckbox.org/ (imports from deckedbuilder)

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


