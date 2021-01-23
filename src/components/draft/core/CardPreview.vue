
<script>

import PreviewImage from '../infobar/PreviewImage.vue'

import * as selectors from '@/store/modules/draft/selectors'


export default {
  name: 'CardPreview',

  components: {
   PreviewImage
  },

  props: {
    card_preview: {
      type: Object,
      default: null
    },
  },

  computed: {
    cardImageUris() {
      if (this.card_preview) {
        return selectors.cardImageUris(this.card_preview.card);
      } else {
        return null;
      }
    },
    cardLayout() {
      if (this.card_preview)
        return this.card_preview.card.layout;
      else
        return "normal";
    },
    dualFaced() {
      return this.cardImageUris.length > 1;
    },
    previewRect() {
      let card = this.card_preview.card;
      if (card) {
        let cardRect = this.card_preview.rect;
        // compute the size and location for the preview image
        const extraWidth = 150;
        const extraHeight = extraWidth * 1.3968;

        let previewRect =  { 
          left: Math.max(0, cardRect.x + cardRect.width), 
          top: cardRect.y, 
          width: (cardRect.width + extraWidth) * this.cardImageUris.length,
          height: cardRect.height + extraHeight
        };
      
        if (previewRect.left + previewRect.width >  window.innerWidth) {
          previewRect.left = cardRect.left - previewRect.width;
        }
        let overflowY = (previewRect.top + previewRect.height) - window.innerHeight;
        if (overflowY > 0)
          previewRect.top -= overflowY;

        return previewRect;
      } else {
        return null;
      }
      
    }
  },
}

</script>

<template>
  <div 
    v-if="card_preview" 
    class="card-preview" 
    :style="{ left: previewRect.left + 'px', top: previewRect.top + 'px', width: previewRect.width + 'px', height: previewRect.height + 'px'}"
  >
    <PreviewImage 
      :card_preview="cardImageUris[0]" 
      :dual_faced="dualFaced"
    />
    <PreviewImage 
      v-if="cardImageUris[1]"
      :card_preview="cardImageUris[1]" 
      :dual_faced="true"
    />
  </div>
</template>

<style>

.card-preview {
  position: fixed;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  z-index: 2000;
}


</style>

