<script>

import { Drag } from 'vue-drag-drop';

import * as selectors from '@/store/modules/draft/selectors'


export default {
  name: 'MtgCard',
  components: {
    Drag
  },
  props: {
    card: {
      type: Object,
      required: true
    },
    drag_source: {
      type: String,
      default: null
    },
    checked: {
      type: Boolean,
      default: false
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
  computed: {
    cardImageUris() {
      let imageUris = selectors.cardImageUris(this.card);
      return imageUris || ["/images/card-back.png"];
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
  <Drag 
    :transfer-data="{drag_source, card}" 
    tag="span" 
    class="mtgcard mtgcard-draggable"
    @dragstart="onDragStart"
  >
    <img 
      :src="cardImageUris[0]" 
      :draggable="!!drag_source"
      @mouseover="onMouseOver" 
      @touchstart="onTouchStart" 
      @touchmove="onTouchMove"
      @touchend="onTouchEnd" 
      @contextmenu="onContextMenu"
    >
    <div v-if="checked" class="mtgcard-check">
      <img draggable="false" src="/images/checkmark.png">
    </div>
  </Drag>
</template>

<style>
.mtgcard-draggable  {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  -webkit-touch-callout: none;
}

.mtgcard {
  position: relative; 
}

.mtgcard .mtgcard-check {
  position: absolute; 
  top: 1px; 
  left: 10px; 
  right: 10px; 
  text-align: center;
}

.mtgcard .mtgcard-check img {
  width: 16px;
}

</style>

