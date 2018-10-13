
<template>
  <Drag v-if="drag_source" tag="span" class="draggable card" 
        @dragstart="onDragStart"
        :transfer-data="{drag_source, card}" :key="card.key">
     <img :src="card.imageUrl" />
  </Drag>
  <span v-else class="card">
    <img :src="card.imageUrl" />
  </span>
</template>

<script>

import { Drag } from 'vue-drag-drop';

export default {
  name: 'Card',
  props: {
    card: Object,
    drag_source: {
      type: String,
      default: null
    }
  },
  components: {
    Drag
  },
  methods: {
    onDragStart(data, event) {
      // record offset of cursor to card image (used for determining
      // location within pile to drop card)
      let cardRect = event.target.getBoundingClientRect();
      data.cursorOffset = {
        x: event.clientX - cardRect.left, 
        y: event.clientY - cardRect.top
      };
    }
  }
}
</script>

<style>
.draggable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
</style>

