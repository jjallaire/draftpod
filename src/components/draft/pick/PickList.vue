<template>
  <div class="mtgdraft-pick-list">
    <Pile :player="player" v-for="number in 7" 
          :key="number-1" :piles="piles" :number="number-1"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile caption="Sideboard"  :player="player" 
          :key="7" :piles="piles" :number="7"></Pile>
  </div>
</template>

<script>

import Pile from '../core/Pile.vue'
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
      'draft',
    ]),
    piles: function() {
      return this.draft(this.player).piles;
    }
  },

  components: {
    Pile
  }
}

</script>

<style>


</style>



