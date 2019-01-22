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
  data: function() {
    return {
      zoom_img: null,
      cursor_offset: null
    }
  },
  inject: [
    'setCardPreview',
    'touchDragManager'
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
      this.setCardPreview(this.card);
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

    onTouchStart(event) {
      this.touchDragManager.onTouchStart(event, this.card, this.drag_source);
    },

    onTouchMove(event) {
      this.touchDragManager.onTouchMove(event);
    },

    onTouchEnd(event) {
      this.touchDragManager.onTouchEnd(event);
    },

    onContextMenu() {
      return false;
    },    
  }
}
</script>

<template>
  <Drag v-if="drag_source" tag="span" class="mtgcard mtgcard-draggable" 
        @dragstart="onDragStart"
        :transfer-data="{drag_source, card}"
        >
     <img :src="cardImageUris[0]" 
          @mouseover="onMouseOver" 
          @touchstart="onTouchStart" 
          @touchmove="onTouchMove"
          @touchend="onTouchEnd" 
          @contextmenu="onContextMenu"/>
  </Drag>
  <span v-else class="mtgcard" draggable="false">
    <img :src="cardImageUris[0]" />
  </span>
</template>

<style>
.mtgcard-draggable  {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  -webkit-touch-callout: none;
}

</style>

