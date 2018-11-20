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
  inject: [
    'setCardPreview',
  ],
  components: {
    Drag
  },
  methods: {
    onMouseOver() {
      this.setCardPreview(this.card.image);
    },
    onDragStart(data, event) {
      // record offset of cursor to card image (used for determining
      // location within pile to drop card)
      let cardRect = event.target.getBoundingClientRect();
      data.cursorOffset = {
        x: event.clientX - cardRect.left, 
        y: event.clientY - cardRect.top
      };
    },
  }
}
</script>

<template>
  <Drag v-if="drag_source" tag="span" class="mtgcard mtgcard-draggable" 
        @dragstart="onDragStart"
        :transfer-data="{drag_source, card}" :key="card.key">
     <img :src="card.image" @mouseover="onMouseOver"/>
  </Drag>
  <span v-else class="mtgcard" draggable="false">
    <img :src="card.image" />
  </span>
</template>

<style>
.mtgcard-draggable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
</style>

