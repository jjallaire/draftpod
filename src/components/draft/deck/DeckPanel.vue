<script>

import MaximizeIcon from "vue-material-design-icons/WindowMaximize.vue"
import MinimizeIcon from "vue-material-design-icons/WindowMinimize.vue"

import UiPanel from '@/components/core/UiPanel.vue'
import MtgCardPile from '@/components/draft/core/MtgCardPile.vue'
import DeckDownload from './DeckDownload.vue'
import DeckView from './DeckView.vue'
import DeckLands from './DeckLands.vue'
import DeckSaveList from './DeckSaveList.vue'

import * as set from '@/store/modules/draft/set/'
import * as selectors from '@/store/modules/draft/selectors'
import { DECK } from '@/store/modules/draft/constants'

export default {
  name: 'DeckPanel',

  components: {
    UiPanel, MtgCardPile, DeckDownload, DeckView, DeckSaveList, DeckLands, MaximizeIcon, MinimizeIcon
  },

  props: {
    set: {
      type: Object,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: true
    },
    deck: {
      type: Object,
      required: true
    },
    saved_decks: {
      type: Object,
      default: null
    }
  },

  computed: {
    piles: function() {

      // for draft and sealed compact mode we just return the piles (since in this mode
      // the piles correctly reflect how they should be displayed
      if (this.is_draft_format || this.is_sealed_compact) {
        
        return this.deck.piles;
      
      // for sealed full mode we arrange by cmc
      } else {

        let display_piles = [...Array(DECK.PILES+3)].map(() => Array());
        selectors.deckCards(this.deck).forEach(c => {
          let card = JSON.parse(JSON.stringify(c));
          let pileIndex = selectors.cardDeckPileIndex(card);
          display_piles[pileIndex].push(card);
        });
        display_piles[DECK.LANDS] = this.deck.piles[DECK.LANDS].slice();
        display_piles[DECK.SIDEBOARD] = this.deck.piles[DECK.SIDEBOARD].slice();
        display_piles[DECK.UNUSED] = this.deck.piles[DECK.UNUSED].slice();
        return display_piles;

      }
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
    },

    is_draft_format() {
      return this.format === 'draft';
    },

    is_sealed_format() {
      return this.format === 'sealed';
    },

    is_sealed_compact() {
      return this.is_sealed_format && this.compact;
    },

    can_download: function() {
      return !set.is_custom_cube(this.set.code) && this.is_draft_format;
    },

    arrange_by_cost: {
      get: function() {
        return selectors.deckOptions(this.deck).compact_arrange_by_cost;
      },
      set: function(value) {
        this.setDeckOptions( { options: { compact_arrange_by_cost: value } });
        if (value) 
          this.arrangeDeckByCost({ compact: this.compact });
      }
    }
  },

  methods: {
    pile_caption(text) {
      if (!this.compact)
        return text;
      else
        return '';
    },

    onToggleCompact() {
      this.$emit('togglecompact');
      this.$refs.toggleCompactBtn.blur();
    }
  },

  inject: [
    'setDeckOptions',
    'arrangeDeckByCost'
  ]
}

</script>

<template>
  <UiPanel 
    :caption="'Deck: ' + deck_total_cards + ' / ' + options.deck_size" 
    class="deck"
  >
    <template slot="header-left">
      <div class="card-type-counts deck-controls">
        Creatures: {{ deck_card_types.creatures }} &nbsp;
        Other: {{ deck_card_types.other }} &nbsp;
        Lands: {{ deck_land_count }}
      </div>
      <div v-if="compact" class="form-check form-check-inline deck-controls">
        <input id="arrangeByCostCheckbox" v-model="arrange_by_cost" class="form-check-input" type="checkbox">
        <label class="form-check-label" for="arrangeByCostCheckbox">Arrange by cost</label>
      </div>
      <DeckSaveList v-if="saved_decks && saved_decks.active" :saved_decks="saved_decks" />
    </template>
    <template slot="header-right">
      <DeckView :set_code="set.code" :format="options.deck_list_format" :deck="deck" />
      <DeckDownload 
        v-if="can_download"
        :set="set" 
        :deck="deck"
      />
      <button 
        v-if="is_sealed_format"
        ref="toggleCompactBtn"
        :title="(compact ? 'Full' : 'Compact') + ' deck view' "
        class="btn btn-sm btn-secondary btn-solo text-light"
        @click="onToggleCompact"
      >
        <MaximizeIcon v-if="compact" />
        <MinimizeIcon v-if="!compact" class="deck-panel-minimize" />
      </button>
    </template>
    <div class="deck-piles deck-piles-top">
      <MtgCardPile 
        v-for="number in 5" 
        :key="number-1" 
        :caption="pile_caption(number + '')" 
        :piles="piles" 
        :number="number-1" 
        drag_source="DRAG_SOURCE_DECK"
        :format="format"
        :compact="compact"
        :arrange_by_cost="arrange_by_cost"
      />
      <MtgCardPile 
        :key="5" 
        :piles="piles" 
        :number="5" 
        :caption="pile_caption('6+')" 
        drag_source="DRAG_SOURCE_DECK"
        :format="format"
        :compact="compact"
        :arrange_by_cost="arrange_by_cost"
      />
      <div class="pile pile-separator" />
      <MtgCardPile 
        :key="12" 
        :caption="'Lands (' + deck_land_count + ')'"
        :piles="piles" 
        :number="12" 
        drag_source="DRAG_SOURCE_DECK"
        :format="format"
        :compact="compact"
        :arrange_by_cost="arrange_by_cost"
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
        :format="format"
        :compact="compact"
        :arrange_by_cost="arrange_by_cost"
      >
        <div v-if="is_draft_format" slot="controls">
          <MtgCardPile 
            :key="14" 
            :piles="piles" 
            :number="14" 
            class="deck-unused" 
            caption="Unused" 
            drag_source="DRAG_SOURCE_UNUSED"
            :format="format"
            :compact="compact"
            :arrange_by_cost="arrange_by_cost"
          />
        </div>
      </MtgCardPile>
    </div>
    <div 
      v-if="!compact"
      :style="piles_bottom_style" 
      class="deck-piles deck-piles-bottom"
    >
      <MtgCardPile 
        v-for="number in 6" 
        :key="number + 6 - 1" 
        :piles="piles" 
        :number="number + 6 - 1" 
        drag_source="DRAG_SOURCE_DECK"
        :format="format"
        :compact="compact"
        :arrange_by_cost="arrange_by_cost"
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

.deck .card-header .deck-controls {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
}

.deck .card-header .card-type-counts {
  padding-top: 3px;
  margin-left: 14px;
}

.deck .card-header .form-check {
  margin-left: 14px;
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

.deck .card-header .btn-solo {
  padding: 0.1rem;
  padding-bottom: 0;
}

.deck .card-header .btn-solo svg {
  width: 24px;
  height: 24px;
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

.deck-panel-minimize svg {
  padding-top: 6px;
}

</style>



