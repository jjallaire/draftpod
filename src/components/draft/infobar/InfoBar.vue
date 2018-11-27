<script>

import UiPanel from '@/components/core/UiPanel.vue'
import PreviewImage from './PreviewImage.vue'
import ManaLegend from './ManaLegend.vue'
import ManaCurve from './ManaCurve.vue'
import ManaColors from './ManaColors.vue'

export default {
  name: 'InfoBar',

  props: {
    card_preview: {
      type: Array,
      required: true
    },
    cards: {
      type: Array,
      required: true
    }
  },

  components: {
    UiPanel, PreviewImage, ManaCurve, ManaColors, ManaLegend
  },
}

</script>

<template>

  <div class="infobar">
    
    <PreviewImage :card_preview="card_preview[0]" />
    <transition name="flip-card">
    <PreviewImage v-if="card_preview.length > 1" :card_preview="card_preview[1]" />
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
  background-color: #fff;
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


