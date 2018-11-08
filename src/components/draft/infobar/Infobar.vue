
<template>

<div class="mtgdraft-infobar">
  
  <PreviewImage :preview_image="preview_image" />
  
  <Panel caption="Cards" panel_class="mtgdraft-deckstats"> 
    <ManaLegend :cards="cards" />
    <ManaCurve :cards="cards" />
    <ManaColors :cards="cards" />
  </Panel>
  
</div>


</template>
  

<script>

import { mapState } from 'vuex';

import Panel from '@/components/draft/core/Panel.vue'
import PreviewImage from './PreviewImage.vue'
import ManaCurve from './ManaCurve.vue'
import ManaColors from './ManaColors.vue'
import ManaLegend from './ManaLegend.vue'

export default {
  name: 'Infobar',

  props: {
    cards: {
      type: Array,
      required: true
    }
  },

  components: {
    Panel, PreviewImage, ManaCurve, ManaColors, ManaLegend
  },

  computed: {
    ...mapState([
      'card_preview'
    ]),
    preview_image: function() {
      let card = this.card_preview;
      if (card)
        return card.image;
      else
        return "images/card-back.png";
    },
  }
}

</script>


<style>

.mtgdraft-infobar {
  display: flex;
  flex-direction: column;
  padding: 5px;
  padding-top: 4px;
  padding-left: 0;
  background-color: transparent;
}

@media only screen and (min-width: 900px) {
  .mtgdraft-infobar {
    width: 190px;
  }
}

@media only screen and (min-width: 1100px) {
  .mtgdraft-infobar {
    width: 210px;
  }
}

@media only screen and (min-width: 1300px) {
  .mtgdraft-infobar {
    width: 230px;
  }
}

.mtgdraft-deckstats {
  flex: 1 1 auto;
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


