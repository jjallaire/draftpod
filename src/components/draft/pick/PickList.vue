<script>

import MtgCardPile from '@/components/draft/core/MtgCardPile.vue'

export default {
  name: 'PickList',

  components: {
    MtgCardPile
  },

  props: {
    piles: {
      type: Array,
      required: true
    }
  },
}

</script>

<template>
  <div class="pick-list">
    <MtgCardPile 
      v-for="number in 7" 
      :key="number-1" 
      :piles="piles" 
      :number="number-1"
      format="draft"
      drag_source="DRAG_SOURCE_PILE"
    />
    <div class="pile pile-separator" />
    <MtgCardPile 
      :key="7" 
      :piles="piles" 
      :number="7" 
      caption="Sideboard"
      format="draft"
      drag_source="DRAG_SOURCE_PILE"
    />
  </div>
</template>

<style>


</style>



