
<script>
import { Drag } from 'vue-drag-drop';

export default {
  name: 'Card',
  props: {
    card: Object,
    draggable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Drag
  }
}
</script>

<template>
  <Drag v-if="draggable" tag="span" class="draggable card" :transfer-data="card" :key="card.key">
     <img :src="card.imageUrl" />
  </Drag>
  <span v-else class="card">
    <img :src="card.imageUrl" />
  </span>
</template>

<style>
.card img {
  padding-right: 3px;
  padding-top: 1px;
  width: 11.5%;
  height: auto;
}

.draggable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
</style>

