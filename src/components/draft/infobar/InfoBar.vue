<script>

import UiPanel from '@/components/core/UiPanel.vue'
import PreviewImage from './PreviewImage.vue'
import ManaLegend from './ManaLegend.vue'
import ManaCurve from './ManaCurve.vue'
import ManaColors from './ManaColors.vue'

import * as selectors from '@/store/modules/draft/selectors'


export default {
  name: 'InfoBar',

  props: {
    card_preview: {
      type: Object,
      default: null
    },
    cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    cardImageUris() {
      if (this.card_preview)
        return selectors.cardImageUris(this.card_preview);
      else
        return ["/images/card-back.png"];
    },
    cardLayout() {
      if (this.card_preview)
        return this.card_preview.layout;
      else
        return "normal";
    }
  },

  components: {
    UiPanel, PreviewImage, ManaCurve, ManaColors, ManaLegend
  },
}

</script>

<template>

  <div class="infobar">
    
    <PreviewImage :card_preview="cardImageUris[0]" :card_layout="cardLayout"/>
    <transition name="flip-card">
    <PreviewImage v-if="cardImageUris.length > 1" :card_preview="cardImageUris[1]" />
    </transition>
    <UiPanel class="deck-stats" caption="Cards"> 
      <ManaLegend :cards="cards" />
      <ManaCurve :cards="cards" />
      <ManaColors :cards="cards" />
    </UiPanel>
    
  </div>

</template>

<style>

.infobar {
  display: flex;
  flex-direction: column;
  padding: 5px;
  padding-top: 4px;
  padding-left: 0;
  background-color: transparent;
}

.flip-card-enter-active {
  transition: all 1s ease;
  opacity: 0;
  max-height: 0;
}

.flip-card-enter-to {
  opacity: 1;
  max-height: 100%;
}

.flip-card-leave-active {
  transition: all 0.4s ease;
  opacity: 1;
  max-height: 100%;
}

.flip-card-leave-to {
  opacity: 0;
  max-height: 0;
}


.deck-stats {
  flex: 1 1 auto;
}

.deck-stats .card-body {
  position: relative;
  overflow-y: scroll;
}

@media only screen and (max-width: 1000px) {
  .deck-stats {
    font-size: 0.7em;
  }
}


</style>


