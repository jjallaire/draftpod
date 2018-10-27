

<template>
  <Panel caption="Deck" panel_class="mtgdraft-deck">
    <Pile :player="player" v-for="number in 5" 
          :key="number-1" :caption="number + ''" :piles="piles" :number="number-1"></Pile>
    <Pile :player="player" :key="5" caption="6+" :piles="piles" :number="5"></Pile>
    <Pile :player="player" :key="6" caption="Lands" :piles="piles" :number="6"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile :player="player" :key="7" caption="Sideboard" :piles="piles" :number="7"></Pile>
  </Panel>
</template>

<script>

import Panel from './core/Panel.vue'
import Pile from './core/Pile.vue'

import { mapGetters } from 'vuex';

export default {
  name: 'Deck',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'deck_piles',
    ]),
    piles: function() {
      return this.deck_piles(this.player);
    }
  },

  components: {
    Panel, Pile
  }
}

</script>

<style>

.mtgdraft-deck .card-body {
  position: relative;
  overflow-y: scroll;
}

</style>



