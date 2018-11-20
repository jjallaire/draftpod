<script>

import MtgCardPile from '@/components/draft/core/MtgCardPile.vue'

export default {
  name: 'PickList',

  props: {
    piles: {
      type: Array,
      required: true
    }
  },

  components: {
    MtgCardPile
  }
}

</script>

<template>
  <div class="mtgdraft-pick-list">
    <MtgCardPile v-for="number in 7" :key="number-1" :piles="piles" :number="number-1"></MtgCardPile>
    <div class="mtgpile mtgpile-separator"></div>
    <MtgCardPile caption="Sideboard" :key="7" :piles="piles" :number="7"></MtgCardPile>
  </div>
</template>

<style>


</style>



