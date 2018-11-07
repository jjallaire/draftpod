

<template>

  <span :class="[badge_class, 'mtgdraft-pack-timer', 'badge', 'text-light']">
    {{ time_display }}
  </span>

</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'PickTimer',
  props: {
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'pick_time_remaining'
    ]),
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