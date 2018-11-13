
<template>
  <Panel :caption="'Main Deck: ' + deck_total_cards + ' / 40'" panel_class="mtgdraft-deck">
    <template slot="header-left">
      <div class="card-type-counts">
      Creatures: {{ deck_card_types.creatures }} &nbsp;
      Other: {{ deck_card_types.other }} &nbsp;
      Lands: {{ deck_land_count }}
      </div>
    </template>
    <template slot="header-right">
      <DeckCopy :deck_list="deck_list" />
      <DeckDownload :deck_list="deck_list" />
    </template>
    <Pile v-for="number in 5" 
          :key="number-1" :caption="number + ''" :piles="piles" :number="number-1" 
          drag_source="DRAG_SOURCE_DECK">
    </Pile>
    <Pile :key="5" caption="6+" :piles="piles" :number="5" 
          drag_source="DRAG_SOURCE_DECK">
    </Pile>
    <Pile :key="6" :caption="'Lands (' + deck_land_count + ')'"
          :piles="piles" :number="6" drag_source="DRAG_SOURCE_DECK">
      <DeckLands slot="controls" :deck="deck">
      </DeckLands>
    </Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile :key="7" caption="Sideboard" :piles="piles" :number="7" 
          drag_source="DRAG_SOURCE_SIDEBOARD">
    </Pile>
  </Panel>
</template>

<script>

import Panel from '@/components/core/Panel.vue'
import Pile from '@/components/draft/core/Pile.vue'
import DeckCopy from './DeckCopy.vue'
import DeckDownload from './DeckDownload.vue'
import DeckLands from './DeckLands.vue'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'Deck',

  props: {
    deck: {
      type: Object,
      required: true
    }
  },

  computed: {
    piles: function() {
      return this.deck.piles;
    },
    deck_list: function() {
      return selectors.deckList(this.deck);
    },
    deck_total_cards: function() {
      return selectors.deckCards(this.deck).length + 
             selectors.deckLandCount(this.deck);
    },
    deck_card_types: function() {
      let cards = selectors.deckCards(this.deck);
      return selectors.cardTypes(cards);
    },
    deck_land_count: function() {
      return selectors.deckLandCount(this.deck);
    }
  },

  components: {
    Panel, Pile, DeckCopy, DeckDownload, DeckLands
  }
}

</script>

<style>

.mtgdraft .mtgdraft-deck {
  background-color: #fff;
}

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
  margin-left: 0.4em;
  padding-left: 0.5rem;
  padding-right: 0.9rem;
  border: none;
  background-image: linear-gradient(#8a9196, #7A8288 60%, #70787d) !important;
  background-repeat: no-repeat;
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



