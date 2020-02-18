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
    checked: {
      type: Boolean,
      default: false
    },
    drag_source: {
      type: String,
      default: null
    },
    click_move: {
      type: Boolean,
      default: false
    },
    double_click_move: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      zoom_img: null,
      cursor_offset: null,
      is_safari: navigator.userAgent.indexOf('Safari') !== -1 && 
                 navigator.userAgent.indexOf('Chrome') === -1,
      was_checked: this.checked
    }
  },
  inject: [
    'setCardPreview',
    'touchDragManager',
    'unusedToDeck',
    'deckToUnused',
    'cardInDeck',
    'packToPick'
  ],
  computed: {
    cardImageUris() {
      let imageUris = selectors.cardImageUris(this.card);
      return imageUris || ["/images/card-back.png"];
    },
    draggable: function() {
      if (this.drag_source)
        return true;
      else
        return false;
    }
  },
  watch: {
    checked: function() {
      this.was_checked = this.was_checked || this.checked;
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
      if (this.draggable)
        this.touchDragManager.onTouchMove(event);
    },

    onTouchEnd(event) {
      this.touchDragManager.onTouchEnd(event);
    },

    onContextMenu() {
      return false;
    },  
    
    onClick() {
      if (this.click_move && !this.double_click_move) {
        this.moveCard();
      }
    },

    onDoubleClick() {
      if (this.double_click_move) {
        this.moveCard();
      }
    },

    onUncheckCard() {
      this.deckToUnused({ card: this.card });
    },

    moveCard() {
      if (this.drag_source === "DRAG_SOURCE_PACK") {
        this.packToPick({ card: this.card, pile_number: null, insertBefore: null });
      } else {
        if (this.cardInDeck(this.card))
          this.deckToUnused({ card: this.card });
        else {
          let moveParams = { card: this.card, insertBefore: null };
          // if this is sealed mode then use only top-row
          if (this.drag_source === "DRAG_SOURCE_UNUSED") {
            if (this.card.cmc <= 1)
              moveParams.pile_number = 0;
            else if (this.card.cmc >= 6)
              moveParams.pile_number = 5;
            else
              moveParams.pile_number = this.card.cmc - 1;
          }
          this.unusedToDeck(moveParams);
        }
      }
    }
  }
}
</script>

<template>
  <Drag 
    :draggable="draggable"
    :transfer-data="{drag_source, card}" 
    tag="span" 
    :class="{ mtgcard: true, 'mtgcard-draggable': draggable }"
    @dragstart="onDragStart"
  >
    <img 
      :src="cardImageUris[0]" 
      :class="{ 'mtgcard-checked': checked, 'mtgcard-padright': was_checked && is_safari }"
      @mouseover="onMouseOver" 
      @touchstart="onTouchStart" 
      @touchmove="onTouchMove"
      @touchend="onTouchEnd" 
      @click="onClick"
      @dblclick="onDoubleClick"
      @contextmenu="onContextMenu"
    >
    <div v-if="checked" class="mtgcard-check">
      <img draggable="false" src="/images/checkmark.png" @click="onUncheckCard">
    </div>
  </Drag>
</template>

<style>

.mtgcard {
  position: relative; 
}

.mtgcard-draggable  {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  -webkit-touch-callout: none;
}

.mtgcard-checked {
  opacity: 0.7;
}

.mtgcard-padright {
  margin-right: 4px;
}

.mtgcard .mtgcard-check {
  position: absolute; 
  top: -15px; 
  left: 0; 
  right: 0; 
  text-align: center;
}

.mtgcard .mtgcard-check img {
  width: 16px;
  cursor: pointer;
}


</style>

