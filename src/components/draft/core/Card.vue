
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

<script>

import { Drag } from 'vue-drag-drop';

import { mapMutations } from 'vuex';
import { SET_CARD_PREVIEW } from '../../../store/mutations';

export default {
  name: 'Card',
  props: {
    draft_id: {
      type: String,
      required: true
    },
    player_id: {
      type: Number,
      required: true
    },
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
    onMouseOver() {
      this.set_card_preview({ 
        player_id: this.player_id, 
        card: this.card 
      });
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
    ...mapMutations({
      set_card_preview: SET_CARD_PREVIEW
    })
  }
}
</script>

<style>
.mtgcard-draggable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
</style>

