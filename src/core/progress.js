

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './progress.css'

// configure NProgress
NProgress.configure({ 
  minimum: 0.1,
  showSpinner: false
});

export function start() {
  NProgress.start();
}

export function stop() {
  NProgress.done();
}
