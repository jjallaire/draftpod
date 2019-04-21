
<script>

import { Drop } from 'vue-drag-drop'



import UiPanel from '@/components/core/UiPanel.vue'
import MtgCard from '@/components/draft/core/MtgCard.vue';

export default {
  name: 'SealedPoolPanel',

  components: {
    UiPanel, MtgCard, Drop
  },

  props: {
    cards: {
      required: true,
      type: Array
    }
  },

  data: function() {
    return {
      drag_source: "DRAG_SOURCE_UNUSED"
    }
  },

  inject: [
    'deckToUnused',
    'sideboardToUnused',
    'touchDragManager',
    'cardInDeck',
  ],  

  mounted() {
    this.touchDragManager.registerDropTarget({
      element: this.$el,
      handlers: {
        onEnter: this.handleDragenter,
        onMove: this.handleDragover,
        onLeave: this.handleDragleave,
        onDrop: this.handleDrop
      }
    });
  },

  beforeDestroy() {
    this.touchDragManager.unregisterDropTarget(this.$el);
  },

  methods: {
   
    handleDragenter() {},
   
    handleDragover(data, event) {

      // reject if not one of our drag sources
      if (!data || !data.drag_source) {
        if (event.dataTransfer)
          event.dataTransfer.dropEffect = 'none';
        return false;
      }
      
      // otherwise return true
      return true;
    },

    handleDrop(data, event) {

      // reject if we are dropping onto ourselves
      if (data.drag_source === this.drag_source) {
        if (event.stopPropagation)
          event.stopPropagation();
        return;
      }
      
      // sideboard to unused
      if (data.drag_source === "DRAG_SOURCE_SIDEBOARD") {
        this.sideboardToUnused( { card: data.card });
        
      // deck to unused
      } else if (data.drag_source === "DRAG_SOURCE_DECK") {
        this.deckToUnused( { card: data.card });
      }
      
      // execute onAfterDrop if we have it
      if (data.onAfterDrop)
        data.onAfterDrop();

      // stop propagation
      if (event.stopPropagation)
        event.stopPropagation();
    },

    handleDragleave() {},

  },

}


</script>


<template>

  <UiPanel 
    class="sealed-pool-panel card-select-panel"
  >

    <Drop 
      class="pool-container card-select-container" 
      @drop="handleDrop(...arguments)" 
      @dragover="handleDragover(...arguments)"
      @dragenter="handleDragenter(...arguments)"
      @dragleave="handleDragleave(...arguments)"
    >

      <MtgCard 
        v-for="card in cards" 
        :key="card.key" 
        :card="card" 
        :drag_source="cardInDeck(card) ? null : drag_source"
        :checked="cardInDeck(card)"
        :click_move="true"
      />

    </Drop>

  </UiPanel>

</template>

<style>

</style>