<script>

import UiPanel from '@/components/core/UiPanel.vue'
import MtgCardPile from '@/components/draft/core/MtgCardPile.vue'
import DeckDownload from './DeckDownload.vue'
import DeckView from './DeckView.vue'
import DeckLands from './DeckLands.vue'

import * as selectors from '@/store/modules/draft/selectors'
import { DECK } from '@/store/modules/draft/constants'


export default {
  name: 'DeckPanel',

  components: {
    UiPanel, MtgCardPile, DeckDownload, DeckView, DeckLands
  },

  props: {
    set: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
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
      return selectors.deckList(this.set.code, this.options.deck_list_format, this.deck);
    },
    normal_deck_list: function() {
      return selectors.deckList(this.set.code, 'normal', this.deck);
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
    },
    unused_pile_offset: function() {
      if (this.deck.piles[DECK.SIDEBOARD].length === 0)
        return 140;
      else
        return 10;
    }
  },
}

</script>

<template>
  <UiPanel 
    :caption="'Deck: ' + deck_total_cards + ' / ' + options.deck_size" 
    class="deck"
  >
    <template slot="header-left">
      <div class="card-type-counts">
        Creatures: {{ deck_card_types.creatures }} &nbsp;
        Other: {{ deck_card_types.other }} &nbsp;
        Lands: {{ deck_land_count }}
      </div>
    </template>
    <template slot="header-right">
      <DeckView :deck_list="deck_list" />
      <DeckDownload 
        :set="set" 
        :deck_list="normal_deck_list"
      />
    </template>
    <div class="deck-piles deck-piles-top">
      <MtgCardPile 
        v-for="number in 5" 
        :key="number-1" 
        :caption="number + ''" 
        :piles="piles" 
        :number="number-1" 
        drag_source="DRAG_SOURCE_DECK"
      />
      <MtgCardPile 
        :key="5" 
        :piles="piles" 
        :number="5" 
        caption="6+" 
        drag_source="DRAG_SOURCE_DECK"
      />
      <div class="pile pile-separator" />
      <MtgCardPile 
        :key="12" 
        :caption="'Lands (' + deck_land_count + ')'"
        :piles="piles" 
        :number="12" 
        drag_source="DRAG_SOURCE_DECK"
      >
        <DeckLands 
          slot="controls" 
          :deck="deck"
        />
      </MtgCardPile>
      <div class="pile pile-separator" />
      <MtgCardPile 
        :key="13" 
        :piles="piles" 
        :number="13" 
        :controls_offset="unused_pile_offset" 
        class="deck-sideboard" 
        caption="Sideboard" 
        drag_source="DRAG_SOURCE_SIDEBOARD"
      >
        <div slot="controls">
          <MtgCardPile 
            :key="14" 
            :piles="piles" 
            :number="14" 
            class="deck-unused" 
            caption="Unused" 
            drag_source="DRAG_SOURCE_UNUSED"
          />
        </div>
      </MtgCardPile>
    </div>
    <div 
      :style="piles_bottom_style" 
      class="deck-piles deck-piles-bottom"
    >
      <MtgCardPile 
        v-for="number in 6" 
        :key="number + 6 - 1" 
        :piles="piles" 
        :number="number + 6 - 1" 
        drag_source="DRAG_SOURCE_DECK"
      />
    </div>
  </UiPanel>
</template>

<style>

.deck {
  background-color: rgb(236,236,236);
}

.mobile .deck .deck-copy,
.mobile .deck .deck-download
 {
  display: none;
}

.mobile .deck .card-header .btn-extra-text {
  display: inherit;
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

@media only screen and (min-width: 1000px) {
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
  min-height: 600px;
}

.deck .deck-sideboard .pile-controls div {
  padding-top: 0;
}

.deck .deck-sideboard .deck-unused {
  width: 100%;
  min-height: 300px;
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



