
import './browser-update.css'
import Vue from 'vue'


import VueBrowserUpdate from 'vue-browserupdate';
Vue.use(VueBrowserUpdate, {
  options: {
    required: { e:-2, f:-5, o:-3, s:11, c:-5 },
    reminder: 0,
    noclose: true,
    text: "Your browser, {brow_name}, is too old to run Draftpod. &nbsp; &nbsp; <a{up_but}>Update Browser</a> <a{ignore_but}>Ignore</a>"
  },
});


