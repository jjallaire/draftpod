

<template>
  <Panel caption="Deck" panel_class="mtgdraft-deck">
    <Pile :player="player" v-for="number in 5" 
          :key="number-1" :caption="number + ''" :piles="piles" :number="number-1" drag_source="DRAG_SOURCE_DECK"></Pile>
    <Pile :player="player" :key="5" caption="6+" :piles="piles" :number="5" drag_source="DRAG_SOURCE_DECK"></Pile>
    <Pile :player="player" :key="6" :caption="'Lands (' + total_lands + ')'"
          :piles="piles" :number="6" drag_source="DRAG_SOURCE_DECK">
      <Lands slot="controls" :deck="deck(this.player)">
      </Lands>
    </Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile :player="player" :key="7" caption="Sideboard" :piles="piles" :number="7" drag_source="DRAG_SOURCE_SIDEBOARD"></Pile>
  </Panel>
</template>

<script>

import Panel from '../core/Panel.vue'
import Pile from '../core/Pile.vue'
import Lands from './Lands.vue'

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
      'deck',
    ]),
    piles: function() {
      return this.deck(this.player).piles;
    },
    total_lands: function() {
      let deck = this.deck(this.player);
      let basic_lands = deck.basic_lands;
      return deck.piles[6].length + 
             Object.keys(basic_lands)
              .map(val => basic_lands[val])
              .reduce((total, count) => total + count, 0);
    }
  },

  components: {
    Panel, Pile, Lands
  }
}

</script>

<style>

.mtgdraft-deck .card-body {
  position: relative;
  overflow-y: scroll;
}

</style>



