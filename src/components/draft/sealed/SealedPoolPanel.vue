
<script>

import { Drop } from 'vue-drag-drop'

import _orderBy from 'lodash/orderBy'

import UiPanel from '@/components/core/UiPanel.vue'
import MtgCard from '@/components/draft/core/MtgCard.vue';

import LeftIcon from 'vue-material-design-icons/ChevronLeftCircle.vue'
import RightIcon from 'vue-material-design-icons/ChevronRightCircle.vue'

const kCardsPerPage = 16;

export default {
  name: 'SealedPoolPanel',

  components: {
    UiPanel, MtgCard, Drop, LeftIcon, RightIcon
  },

  props: {
    pool: {
      required: true,
      type: Array
    }
  },

  data: function() {
    return {
      page_index: 0
    }
  },

  computed: {

    pool_sorted: function() {
      return _orderBy(this.pool, ["collector_number"], ["asc"]);
    },

    page_cards: function() {
      let start = this.page_index * kCardsPerPage;
      return this.pool_sorted.slice(start, start + kCardsPerPage);
    },

    page_caption: function() {
      let total = this.pool_sorted.length;
      let first = (this.page_index * kCardsPerPage) + 1;
      let last = Math.min(first + kCardsPerPage - 1, total);
      return `${first} to ${last} of ${total}`;
    },

    drag_source: () => "DRAG_SOURCE_UNUSED",
  },

  inject: [
    'deckToUnused',
    'sideboardToUnused',
    'touchDragManager'
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

    onPreviousClick() {
      if (this.page_index > 0)
        this.page_index = this.page_index - 1;
    },

    onNextClick(){
      let next_start = (this.page_index+1) * kCardsPerPage;
      if (next_start < this.pool.length)
        this.page_index = this.page_index + 1;
    }

  },

}


</script>


<template>

  <UiPanel 
    caption="Sealed Pool"
    class="sealed-pool-panel card-select-panel"
  >
    <template slot="header-right">
      <LeftIcon title="Previous (Left Arrow)" @click.native="onPreviousClick"  /> 
      {{ page_caption }} 
      <RightIcon  title="Next (Right Arrow)" @click.native="onNextClick" />
    </template>

    <Drop 
      class="pool-container card-select-container" 
      @drop="handleDrop(...arguments)" 
      @dragover="handleDragover(...arguments)"
      @dragenter="handleDragenter(...arguments)"
      @dragleave="handleDragleave(...arguments)"
    >

      <MtgCard 
        v-for="card in page_cards" 
        :key="card.key" 
        :card="card" 
        :drag_source="drag_source"
      />

    </Drop>

  </UiPanel>

</template>

<style>

.draft-page .sealed-pool-panel .card-body {
  padding-top: 5px;
}

.draft-cards .sealed-pool-panel {
  padding-bottom: 34.5%;
}

@media only screen and (max-width: 1000px) {
.draft-cards .sealed-pool-panel {
  padding-bottom: 31.8%;
}
}

.sealed-pool-panel .material-design-icon {
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
}

.sealed-pool-panel .material-design-icon svg {
  width: 16px;
  height: 16px;
   margin-top: -2px;
}




</style>