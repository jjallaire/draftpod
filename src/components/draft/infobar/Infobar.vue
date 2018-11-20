<script>

import Panel from '@/components/core/Panel.vue'
import PreviewImage from './PreviewImage.vue'
import ManaLegend from './ManaLegend.vue'
import ManaCurve from './ManaCurve.vue'
import ManaColors from './ManaColors.vue'

export default {
  name: 'Infobar',

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
    Panel, PreviewImage, ManaCurve, ManaColors, ManaLegend
  },
}

</script>

<template>

  <div class="mtgdraft-infobar">
    
    <PreviewImage :card_preview="card_preview" />
    
    <Panel class="mtgdraft-deckstats" caption="Cards"> 
      <ManaLegend :cards="cards" />
      <ManaCurve :cards="cards" />
      <ManaColors :cards="cards" />
    </Panel>
    
  </div>

</template>

<style>

.mtgdraft-infobar {
  display: flex;
  flex-direction: column;
  padding: 5px;
  padding-top: 4px;
  padding-left: 0;
  background-color: transparent;
}


.mtgdraft-deckstats {
  flex: 1 1 auto;
  background-color: #fff;
}

.mtgdraft-deckstats .card-body {
  position: relative;
  overflow-y: scroll;
}

@media only screen and (max-width: 1000px) {
  .mtgdraft-deckstats {
    font-size: 0.7em;
  }
}


</style>


