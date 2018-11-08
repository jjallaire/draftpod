

<template>

  <span :class="[badge_class, 'mtgdraft-pick-timer', 'badge', 'text-light']">
    {{ time_display }}
  </span>

</template>

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
      now: new Date().getTime()
    }
  },
  
  created () {
    let vm = this;
    setInterval(function() {
      vm.now = new Date().getTime()
    }, 1000);
  },

  computed: {
    pick_time_remaining: function() {
      return Math.round((this.pick_end_time - this.now) / 1000);
    },
    badge_class: function() {
      if (this.pick_time_remaining > 10)
        return "badge-primary";
      else
        return "badge-danger";
    },
    time_display: function() {
      let seconds_remaining = Math.max(this.pick_time_remaining, 0);
      let minutes = Math.floor(seconds_remaining / 60);
      let seconds = seconds_remaining % 60;
      return minutes + ':' + ('00'+ seconds).slice(-2);
    }
  }
}



</script>

<style>


</style>