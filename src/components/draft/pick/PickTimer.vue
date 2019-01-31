<script>

export default {

  name: 'PickTimer',

  props: {
    pick_end_time: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      now: new Date().getTime(),
      timer: null
    }
  },

  computed: {
    pick_time_remaining: function() {
      return Math.round((this.pick_end_time - this.now) / 1000);
    },
    badge_class: function() {
      if (this.pick_time_remaining > 10)
        return "badge-transparent";
      else
        return "badge-danger";
    },
    time_display: function() {
      let seconds_remaining = Math.max(this.pick_time_remaining, 0);
      let minutes = Math.floor(seconds_remaining / 60);
      let seconds = seconds_remaining % 60;
      return minutes + ':' + ('00'+ seconds).slice(-2);
    }
  },
  
  created () {
    this.timer = setInterval(this.onPickTimer, 1000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  inject: [
    'pickTimerPick'
  ],

  methods: {
    onPickTimer() {
      // update current time
      this.now = new Date().getTime();

      // check for expiration
      if (this.pick_time_remaining <= -1) {
        this.pickTimerPick();
      }
    }
  },
}

</script>


<template>
  <span 
    :class="badge_class" 
    class="pick-timer badge text-light"
  >
    {{ time_display }}
  </span>
</template>

<style>

.pick-timer .badge-transparent {
  background-color: transparent;
}

</style>