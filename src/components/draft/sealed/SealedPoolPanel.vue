
<script>

import UiPanel from '@/components/core/UiPanel.vue'
import MtgCard from '@/components/draft/core/MtgCard.vue';

export default {
  name: 'SealedPoolPanel',

  components: {
    UiPanel, MtgCard
  },

  props: {
    pool: {
      required: true,
      type: Array
    }
  },

  computed: {

    page_index: function() {
      return 0;
    },

    page_cards: function() {
      let cards_per_page = 16;
      return this.pool.slice(this.page_index * cards_per_page, cards_per_page);
    },

    drag_source: () => "DRAG_SOURCE_UNUSED",
  },


}


</script>


<template>

  <UiPanel 
    class="sealed-pool-panel card-select-panel"
  >
    <div class="pool-container card-select-container">
      <MtgCard 
        v-for="card in page_cards" 
        :key="card.key" 
        :card="card" 
        :drag_source="drag_source"
      />
    </div>

  </UiPanel>

</template>

<style>







</style>