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

export default {
  name: 'PickList',

  props: {
    piles: {
      type: Array,
      required: true
    }
  },

  components: {
    Pile
  }
}

</script>

<style>


</style>



