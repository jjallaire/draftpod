<script>

import { Drag } from 'vue-drag-drop';

import * as selectors from '@/store/modules/draft/selectors'


export default {
  name: 'MtgCard',
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
  computed: {
    cardImageUris() {
      return selectors.cardImageUris(this.card);
    }
  },
  methods: {
    onMouseOver() {
      this.setCardPreview(this.cardImageUris);
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
     <img :src="cardImageUris[0]" @mouseover="onMouseOver"/>
  </Drag>
  <span v-else class="mtgcard" draggable="false">
    <img :src="cardImageUris[0]" />
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

