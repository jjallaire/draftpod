<script>

import UiPanel from '@/components/core/UiPanel.vue'
import MtgCardPile from '@/components/draft/core/MtgCardPile.vue'
import DeckCopy from './DeckCopy.vue'
import DeckDownload from './DeckDownload.vue'
import DeckLands from './DeckLands.vue'

import * as selectors from '@/store/modules/draft/selectors'
import { DECK } from '@/store/modules/draft/constants'

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
      return selectors.deckTotalCards(this.deck);
    },
    deck_card_types: function() {
      let cards = selectors.deckCards(this.deck);
      return selectors.cardTypes(cards);
    },
    deck_land_count: function() {
      return selectors.deckLandCount(this.deck);
    },
    piles_bottom_style: function() {
      // compute the maximum number of cards in piles 1-6
      let piles = this.deck.piles.slice(0,6);
      piles.push(this.deck.piles[DECK.LANDS]);
      let max_cards = piles
        .reduce((prev, current) => prev.length < current.length ? current : prev, [])
        .length;
      let margin_top = 16.05 + ((max_cards + 1) * 1.8);
      return {
        marginTop: margin_top + '%',
      };
    }
  },

  components: {
    UiPanel, MtgCardPile, DeckCopy, DeckDownload, DeckLands
  }
}

</script>

<template>
  <UiPanel class="deck" :caption="'Deck: ' + deck_total_cards + ' / 40'">
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
    <div class="deck-piles deck-piles-top">
      <MtgCardPile v-for="number in 5" 
            :key="number-1" :caption="number + ''" :piles="piles" :number="number-1" 
            drag_source="DRAG_SOURCE_DECK">
      </MtgCardPile>
      <MtgCardPile :key="5" caption="6+" :piles="piles" :number="5" 
            drag_source="DRAG_SOURCE_DECK">
      </MtgCardPile>
      <div class="pile pile-separator"></div>
      <MtgCardPile :key="12" :caption="'Lands (' + deck_land_count + ')'"
            :piles="piles" :number="12" drag_source="DRAG_SOURCE_DECK">
        <DeckLands slot="controls" :deck="deck">
        </DeckLands>
      </MtgCardPile>
      <div class="pile pile-separator"></div>
      <MtgCardPile class="deck-sideboard" :key="13" caption="Sideboard" :piles="piles" :number="13" 
            drag_source="DRAG_SOURCE_SIDEBOARD">
      </MtgCardPile>
    </div>
    <div class="deck-piles deck-piles-bottom" :style="piles_bottom_style">
      <MtgCardPile v-for="number in 6" 
            :key="number + 6 -  1" :piles="piles" :number="number + 6 - 1" 
            drag_source="DRAG_SOURCE_DECK">
      </MtgCardPile>
    </div>
  </UiPanel>
</template>

<style>

.deck {
  background-color: rgb(236,236,236);
}

.deck .card-header {
  font-size: 0.9rem;
  margin-bottom: 3px;
}

.deck .card-header .header-text {
  padding-top: 2px;
}

.deck .card-header .card-type-counts {
  padding-top: 3px;
  margin-left: 14px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
}

.deck .card-header .btn-sm {
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

.deck .card-header .btn-sm svg {
  width: 16px;
  height: 16px;
  margin-top: -2px;
}

.deck .card-header .btn-extra-text {
  display: none
}

@media only screen and (min-width: 600px) {
  .deck .card-header .btn-extra-text {
    display: inherit
  }
}

.deck .card-body {
  position: relative;
  overflow-y: scroll;
  scroll-behavior: smooth;
  padding-left: 10px;
  background-color: transparent;
}

.deck .deck-sideboard {
  position: absolute;
  min-height: 700px;
}

.deck .deck-piles {
  position: absolute;
  left: 0.7rem;
  right: 0.4rem;
}

.deck .deck-piles-top {
  top: 5px;
}

.deck .deck-piles-bottom {
  top: 0;
  pointer-events: none;
}

.deck .deck-piles-bottom .pile {
  pointer-events: all;
}

</style>



