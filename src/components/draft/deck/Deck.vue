
<template>
  <Panel :caption="'Main Deck: ' + deck_total_cards + ' / 40'" panel_class="mtgdraft-deck">
    <template slot="header-left">
      <div class="card-type-counts">
      Creatures: {{ deck_card_types.creatures }} &nbsp;
      Other: {{ deck_card_types.other }} &nbsp;
      Lands: {{ deck_land_count(this.player) }}
      </div>
    </template>
    <template slot="header-right">
      <DeckCopy :player="player" />
      <DeckDownload :player="player" />
    </template>
    <Pile :draft_id="draft_id" :player="player" v-for="number in 5" 
          :key="number-1" :caption="number + ''" :piles="piles" :number="number-1" 
          drag_source="DRAG_SOURCE_DECK">
    </Pile>
    <Pile :draft_id="draft_id" :player="player" :key="5" caption="6+" :piles="piles" :number="5" 
          drag_source="DRAG_SOURCE_DECK">
    </Pile>
    <Pile :draft_id="draft_id" :player="player" :key="6" :caption="'Lands (' + deck_land_count(this.player) + ')'"
          :piles="piles" :number="6" drag_source="DRAG_SOURCE_DECK">
      <DeckLands slot="controls" :player="player">
      </DeckLands>
    </Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile :draft_id="draft_id" :player="player" :key="7" caption="Sideboard" :piles="piles" :number="7" 
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
    draft_id: {
      type: String,
      required: true
    },
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'deck',
      'deck_cards',
      'deck_land_count',
      'card_types'
    ]),
    piles: function() {
      return this.deck(this.player).piles;
    },
    deck_total_cards: function() {
      return this.deck_cards(this.player).length + 
             this.deck_land_count(this.player);
    },
    deck_card_types: function() {
      let cards = this.deck_cards(this.player);
      return this.card_types(cards);
    }
  },

  components: {
    Panel, Pile, DeckCopy, DeckDownload, DeckLands
  }
}

</script>

<style>

.mtgdraft .mtgdraft-deck .card-header {
  font-size: 0.9rem;
  margin-bottom: 3px;
}



.mtgdraft .mtgdraft-deck .card-header .header-text {
  padding-top: 2px;
}

.mtgdraft .mtgdraft-deck .card-header .card-type-counts {
  padding-top: 3px;
  margin-left: 14px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
}

.mtgdraft .mtgdraft-deck .card-header .btn-sm {
  font-size: 0.8rem;
  line-height: 1.4;
  padding: 0.25rem;
  margin-top: 0;
  margin-left: 0.2em;
  padding-left: 0.5rem;
  padding-right: 0.9rem;
}

.mtgdraft .mtgdraft-deck .card-header .btn-sm svg {
  width: 16px;
  height: 16px;
  margin-top: -2px;
}

.mtgdraft .mtgdraft-deck .card-header .btn-extra-text {
  display: none
}

@media only screen and (min-width: 1000px) {
  .mtgdraft .mtgdraft-deck .card-header .btn-extra-text {
    display: inherit
  }
}

.mtgdraft .mtgdraft-deck .card-body {
  position: relative;
  overflow-y: scroll;
  padding-left: 10px;
}

</style>



