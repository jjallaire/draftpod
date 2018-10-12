
<template>
  <Drag v-if="drag_source" tag="span" class="draggable card" 
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

