

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './progress.css'

// configure NProgress
NProgress.configure({ 
  minimum: 0.1,
  showSpinner: false
});

class Progress {

  constructor() {
    this.startDelay = null;
  }

  start(delay) {
    this.clearDelay();
    this.startDelay = setTimeout(() => {
      NProgress.start();
    }, delay || 0);
  }

  stop() {
    this.clearDelay();
    NProgress.done();
  }

  clearDelay() {
    if (this.startDelay) {
      clearTimeout(this.startDelay);
      this.startDelay = undefined;
    }
  }

}

export default new Progress();
