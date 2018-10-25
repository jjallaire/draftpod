

<template>
  <Panel caption="Deck" panel_class="mtgdraft-deck">
   
    <Pile :player="player" v-for="number in 5" 
          :key="number-1" :caption="number + ''" :pile="creatures[number-1]"></Pile>
    <Pile :player="player" :key="5" caption="6+" :pile="creatures[5]"></Pile>
    <Pile :player="player" :key="6" caption="Lands" :pile="lands"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile :player="player" :key="7" caption="Sideboard" :pile="sideboard"></Pile>
  
  </Panel>
</template>

<script>

import Panel from './Panel.vue'
import Pile from './Pile.vue'

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
    creatures: function() {
      return this.deck(this.player).creature_piles;
    },
    other: function() {
      return this.deck(this.player).other_piles;
    },
    lands: function() {
      return this.deck(this.player).lands;
    },
    sideboard: function() {
      return this.deck(this.player).sideboard;
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



