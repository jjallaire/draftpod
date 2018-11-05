

<template>

  <span :class="[badge_class, 'mtgdraft-pack-timer', 'badge', 'text-light']">
    0:{{ ('00'+pick_time_remaining).slice(-2) }}
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
    }
  }
}

</script>

<style>


</style>