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

<template>
  <div class="mtgdraft-pick-list">
    <Pile v-for="number in 7" :key="number-1" :piles="piles" :number="number-1"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile caption="Sideboard" :key="7" :piles="piles" :number="7"></Pile>
  </div>
</template>

<style>


</style>



