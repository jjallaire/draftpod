
<template>

<div class="mtgdraft-infobar">
  
  <PreviewImage :player="player" />
  
  <Panel caption="Deck Stats" panel_class="mtgdraft-deckstats"> 
    <ManaLegend :cards="cards" />
    <ManaCurve :cards="cards" />
    <ManaColors :cards="cards" />
  </Panel>
  
</div>


</template>
  

<script>

import { mapGetters } from 'vuex';

import Panel from '../core/Panel.vue'
import PreviewImage from './PreviewImage.vue'
import ManaCurve from './ManaCurve.vue'
import ManaColors from './ManaColors.vue'
import ManaLegend from './ManaLegend.vue'

export default {
  name: 'Infobar',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  components: {
    Panel, PreviewImage, ManaCurve, ManaColors, ManaLegend
  },

  computed: {
    ...mapGetters([
      'pick_piles',
      'deck_piles',
      'picks_complete'
    ]),
    cards: function() {
      let piles = this.picks_complete 
        ? this.deck_piles(this.player) 
        : this.pick_piles(this.player);
      return piles.slice(0, 7).flat();
    },
  }
}

</script>


<style>

.mtgdraft-infobar {
  display: flex;
  flex-direction: column;
  padding: 8px;
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


