<template>
  <div class="mtgdraft-pick-list">
    <Pile :player="player" v-for="number in 7" :key="number-1" :pile="pile(number-1)"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile caption="Sideboard"  :player="player" :key="7" :pile="pile(7)"></Pile>
  </div>
</template>

<script>

import Pile from './Pile.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PickList',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'pick_piles',
    ]),
  },

  methods: {
     pile: function(index) {
      return this.pick_piles(this.player)[index];
    }
  },

  components: {
    Pile
  }
}

</script>

<style>


</style>



