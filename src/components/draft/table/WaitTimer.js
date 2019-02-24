

import { mapState, mapMutations } from 'vuex';
import { SET_CONNECTED } from '@/store/modules/draft/mutations'

import firestore from '@/store/modules/draft/firestore'

export default {

  data() {
    return {
      wait_timer: {
        draft_id: null,
        now: new Date().getTime(),
        timer: null
      }
    }
  },

  computed: {
    ...mapState({
      draft: function(state) {
        return state["drafts"][this.wait_timer.draft_id];
      },
    }),
    waiting: function() {
      return this.draft && (this.draft.waiting !== null);
    },
    wait_time: function() {
      if (this.waiting)
        return Math.round((this.wait_timer.now - this.waiting) / 1000);
      else
        return 0;
    },
  },

  beforeDestroy() {
    this.stopWaitTimer();
  },


  methods: {

    startWaitTimer(draft_id) {
      this.stopWaitTimer();
      this.wait_timer.draft_id = draft_id;
      this.wait_timer.timer = setInterval(this.onWaitTimer, 1000);
    },

    stopWaitTimer() {
      if (this.wait_timer.timer) {
        clearInterval(this.wait_timer.timer);
        this.wait_timer.timer = null;
      }
    },

    onWaitTimer() {
      // update current time
      this.wait_timer.now = new Date().getTime();

      // check for expiration
      if (this.wait_time >= 10) {
        this.stopWaitTimer();
        this.setConnected({ connected: false });
        firestore.showConnectionError(new Error("Server took too long to respond"));
      }
    },

    ...mapMutations({
      setConnected(dispatch, payload) {
        return dispatch("drafts/" + this.wait_timer.draft_id + '/' + SET_CONNECTED, payload);
      }, 
    })
  }

}