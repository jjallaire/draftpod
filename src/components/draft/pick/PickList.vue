<template>
  <div class="mtgdraft-pick-list">
    <Pile :player_id="player_id" v-for="number in 7" 
          :key="number-1" :piles="piles" :number="number-1"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile caption="Sideboard" :player_id="player_id" 
          :key="7" :piles="piles" :number="7"></Pile>
  </div>
</template>

<script>

import Pile from '@/components/draft/core/Pile.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PickList',

  props: {
    player_id: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'draft',
    ]),
    piles: function() {
      return this.draft(this.player_id).piles;
    }
  },

  components: {
    Pile
  }
}

</script>

<style>


</style>



