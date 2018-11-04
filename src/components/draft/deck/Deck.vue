
<template>
  <Panel :caption="'Main Deck: ' + cards + ' / 40'" panel_class="mtgdraft-deck">
    <template slot="header">
      <DeckCopy :player="player" />
      <DeckDownload :player="player" />
    </template>
    <Pile :player="player" v-for="number in 5" 
          :key="number-1" :caption="number + ''" :piles="piles" :number="number-1" 
          drag_source="DRAG_SOURCE_DECK">
    </Pile>
    <Pile :player="player" :key="5" caption="6+" :piles="piles" :number="5" 
          drag_source="DRAG_SOURCE_DECK">
    </Pile>
    <Pile :player="player" :key="6" :caption="'Lands (' + deck_lands(this.player) + ')'"
          :piles="piles" :number="6" drag_source="DRAG_SOURCE_DECK">
      <DeckLands slot="controls" :player="player">
      </DeckLands>
    </Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile :player="player" :key="7" caption="Sideboard" :piles="piles" :number="7" 
          drag_source="DRAG_SOURCE_SIDEBOARD">
    </Pile>
  </Panel>
</template>

<script>

import Panel from '../core/Panel.vue'
import Pile from '../core/Pile.vue'
import DeckCopy from './DeckCopy.vue'
import DeckDownload from './DeckDownload.vue'
import DeckLands from './DeckLands.vue'

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
      'deck_lands'
    ]),
    piles: function() {
      return this.deck(this.player).piles;
    },
    cards: function() {
      let non_lands = this.piles.slice(0, 6).flat().length;
      return non_lands + this.deck_lands(this.player);
    }
  },

  components: {
    Panel, Pile, DeckCopy, DeckDownload, DeckLands
  }
}

</script>

<style>

.mtgdraft .mtgdraft-deck .card-header {
  font-size: 1rem;
  margin-bottom: 3px;
}

.mtgdraft .mtgdraft-deck .card-header .header-text {
  padding-top: 4px;
}

.mtgdraft .mtgdraft-deck .card-header .btn-sm {
  font-size: 0.8rem;
  line-height: 1.4;
  padding-top: 0.25rem;
  margin-top: 0;
  margin-left: 0.2em;
  padding-left: 0.5rem;
  padding-right: 0.9rem;
}

.mtgdraft .mtgdraft-deck .card-body {
  position: relative;
  overflow-y: scroll;
  padding-left: 10px;
}

</style>



