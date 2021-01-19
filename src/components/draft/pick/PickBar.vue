<script>

import { PICKS } from '@/store/modules/draft/constants'

import ContentPanel from '@/components/core/ContentPanel.vue'
import MtgCardPile from '@/components/draft/core/MtgCardPile.vue'


export default {
  name: 'PickBar',
  components: {
   ContentPanel, MtgCardPile
  },
  props: {
    picks: {
      type: Object,
      required: true
    },
  },
  data: function() {
    return {
      sideboard: PICKS.SIDEBOARD
    }
  },
}

</script>

<template>
  <ContentPanel class="pick-bar" caption="Picks">
    <MtgCardPile 
      :piles="picks.piles" 
      :number="0" 
      drag_source="DRAG_SOURCE_DECK"
      format="draft"
      :compact="false"
      :arrange_by_cost="true"
    />
    <MtgCardPile 
      caption="Sideboard" 
      :piles="picks.piles" 
      :number="sideboard" 
      drag_source="DRAG_SOURCE_SIDEBOARD"
      format="draft"
      :compact="false"
      :arrange_by_cost="true"
    />
  </ContentPanel>
  
</template>

<style>

.pick-bar {
  margin-bottom: 0;
}

.pick-bar .card-body {
  position: relative;
  overflow-y: scroll;
}

.pick-bar .pile {
  width: 100%;
}

.pick-bar .mtgcard img {
  width: 100%;
}

</style>

