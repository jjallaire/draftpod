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
      type: String,
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
    
    <PreviewImage :card_preview="card_preview" />
    
    <UiPanel class="deck-stats" caption="Cards"> 
      <ManaLegend :cards="cards" />
      <ManaCurve :cards="cards" />
      <ManaColors :cards="cards" />
    </UiPanel>
    
  </div>

</template>

<style>

.draftpod .infobar {
  display: flex;
  flex-direction: column;
  padding: 5px;
  padding-top: 4px;
  padding-left: 0;
  background-color: transparent;
}


.draftpod .deck-stats {
  flex: 1 1 auto;
  background-color: #fff;
}

.draftpod .deck-stats .card-body {
  position: relative;
  overflow-y: scroll;
}

@media only screen and (max-width: 1000px) {
  .draftpod .deck-stats {
    font-size: 0.7em;
  }
}


</style>


