
<script>


import Vue from 'vue'
import VueHotkey from 'v-hotkey'
Vue.use(VueHotkey);

import jquery from 'jquery'

import _flatten from 'lodash/flatten'
import _orderBy from 'lodash/orderBy'
import _omit from 'lodash/omit'
import _uniqBy from 'lodash/uniqBy'

import * as filters from '@/store/modules/draft/card-filters'

import NavBar from '@/components/core/NavBar.vue'

import TableCore from '../table/TableCore.js'
import FullscreenButton from '../table/FullscreenButton.vue'
import InfoBar from '../infobar/InfoBar.vue'
import SealedPoolPanel from '../sealed/SealedPoolPanel.vue'
import DeckPanel from '../deck/DeckPanel.vue'

import LeftIcon from 'vue-material-design-icons/ChevronLeftBox.vue'
import RightIcon from 'vue-material-design-icons/ChevronRightBox.vue'
import FilterIcon from 'vue-material-design-icons/FilterVariant.vue'
import SealedFilterPopup from './SealedFilterPopup.vue'

import { mapState } from 'vuex'

import { DECK } from '@/store/modules/draft/constants'

const kCardsPerPage = 16;

export default {
  name: 'SealedTable',

  components: { NavBar, FullscreenButton, InfoBar, SealedPoolPanel, DeckPanel,
                LeftIcon, RightIcon, FilterIcon, SealedFilterPopup },

  mixins: [TableCore],

  data: function() {
    return {
      page_index: 0,
      filter: null,
      compact_deck_panel: true,
    }
  },



  computed: {

    ...mapState([
      'preferences'
    ]),

    pool: function() {

      // calculate cards to display
      let displayCards = null;

      // full set mode shows all unused cards (but no more than one of each)
      if (this.pool_is_full_set) {

        displayCards = _uniqBy(this.active_player.deck.piles[DECK.UNUSED], function(card) {
          return card.id;
        });

      // show selected includes everything (but marks selected)
      } else if (this.preferences.sealed_show_selected) {
        displayCards = _flatten(this.active_player.deck.piles);
      
      // otherwise show just unused
      } else {
        displayCards = this.active_player.deck.piles[DECK.UNUSED];
      }

      // return cards
      return _orderBy(displayCards, ["key"], ["asc"]);
    },

    pool_filtered: function() {
      if (this.filter)
        return this.pool.filter(this.filter);
      else
        return this.pool;
    },

    pool_is_full_set: function() {
      return this.options.sealed_number_of_packs === -1;
    },

    pool_is_multi_set: function() {
      const all_cards = _flatten(this.active_player.deck.piles);
      let set_code = '';
      for(let i = 0; i<all_cards.length; i++) {
        const card = all_cards[i];
        if (!set_code) {
          set_code = card.set;
        } else if (set_code !== card.set) {
          return true;
        }
      }
      return false;
    },

    pool_sorted: function() {

      if (this.pool_is_multi_set) {
        // genereate color order field (need to do this 
        // becauase we may be merging cards from multiple 
        // sets so collector number won't order by color)
        let cards = this.pool_filtered.map(card => { 
          let colorOrder = 9;
          if (filters.artifact(card)) {
            colorOrder = 7
          } else if (filters.land(card)) {
            colorOrder = 8;
          } else if (filters.colorless(card)) {
            colorOrder = 0;
          } else if (filters.multicolor(card)) {
            colorOrder = 6;
          } else if (filters.plains(card)) {
            colorOrder = 1;
          } else if (filters.island(card)) {
            colorOrder = 2;
          } else if (filters.swamp(card)) {
            colorOrder = 3;
          } else if (filters.mountain(card)) {
            colorOrder = 4;
          } else if (filters.forest(card)) {
            colorOrder = 5;
          }
          return { 
            ...card, 
            colorOrder,
          }
        }); 

        // return sorted array of cards (w/o sort fields)
        return _orderBy(cards, 
          ["colorOrder",  "name",], 
          ["asc", "asc",]
        ).map(card => {
          return _omit(card, ["colorOrder"]);
        });
      } else {
        return _orderBy(this.pool_filtered, ["collector_number"], ["asc"]);
      }
    },

    page_cards: function() {
      let start = this.page_index * kCardsPerPage;
      return this.pool_sorted.slice(start, start + kCardsPerPage);
    },

    is_filtered: function() {
      return this.pool.length !== this.pool_filtered.length;
    },

    have_matching_cards() {
      return this.pool_filtered.length > 0;
    },

    page_caption: function() {
      let total = this.pool_filtered.length;
      let first = (this.page_index * kCardsPerPage) + 1;
      let last = Math.min(first + kCardsPerPage - 1, total);
      return `${first}-${last} of ${total} cards`;
    },


    keymap: function() {
      return {
        'left': () => {
          this.onPreviousClick();
        },
        'right': () => {
          this.onNextClick();
        },
        'ctrl+f': () => {
          this.onToggleFilterPopup();
        },
        'meta+f': () => {
          this.onToggleFilterPopup();
        },
      };
    }
  },

  created() {
    this.resumeDraft();
  },

  methods: {

    onPreviousClick() {
      if (this.page_index > 0)
        this.page_index = this.page_index - 1;
    },

    onNextClick(){
      let next_start = (this.page_index+1) * kCardsPerPage;
      if (next_start < this.pool_filtered.length)
        this.page_index = this.page_index + 1;
    },

    onFilterChanged(value) {
      this.filter = value;
      this.page_index = 0;
    },

    onToggleCompactDeckPanel() {
      this.compact_deck_panel = !this.compact_deck_panel;
    },

    onToggleFilterPopup(event) {
      if (event)
        event.stopPropagation();
      if (jquery('#filterMenuLink').next().is(":hidden"))
        jquery('#filterMenuLink').dropdown('toggle');
    }
   
  },

}

</script>


<template>
  <div>
    <NavBar class="sealed-navbar">

      <span class="navbar-text">
        <span v-if="pool_is_full_set">
          Full Set
        </span>  
        <span v-else>
          Sealed
        </span>  
      </span> 

      <ul class="navbar-nav">
        <li class="nav-item">
          <div class="dropdown">
            <a 
              id="filterMenuLink" 
              href="#" 
              class="nav-link icon-link dropdown-toggle" 
              title="Filter (Ctrl+F)" 
              data-toggle="dropdown" 
              aria-haspopup="true" 
              aria-expanded="false"
            >
              <FilterIcon /> Filter
            </a>
            <div 
              class="dropdown-menu filter-menu" 
              aria-labelledby="filterMenuLink"
              @click="(event) => event.stopPropagation()"
            >
              <SealedFilterPopup @changed="onFilterChanged" />
            </div>
          </div>
        </li>
      </ul>

      <ul class="navbar-nav">
        <LeftIcon class="pager pager-left" title="Previous (Left Arrow)" @click.native="onPreviousClick" /> 
      </ul>
      <span class="navbar-text pager-text" @click="onToggleFilterPopup">
        <template v-if="have_matching_cards">
          {{ page_caption }}<span v-if="is_filtered">&nbsp;<em>(filtered)</em></span>
        </template>
        <template v-else>
          (No matching cards)
        </template>
      </span>
      <ul class="navbar-nav">
        <RightIcon class="pager pager-right" title="Next (Right Arrow)" @click.native="onNextClick" />
      </ul>

      <ul class="navbar-nav">
        <FullscreenButton 
          v-if="fullscreenEnabled" 
          :fullscreen="fullscreen" 
          @clicked="onFullscreenToggle"
        />
      </ul>
    </NavBar> 

    <div :class="{ 'draft-page': true, 'mobile': isMobile, 'phone': isPhone, 'tablet': isTablet }">
      <div v-hotkey="keymap" class="draft-cards user-select-none">
        
        <transition name="deck-panel-toggle">
          <SealedPoolPanel
            v-if="compact_deck_panel"
            :cards="page_cards"
          />
        </transition>

        <DeckPanel 
          :set="set" 
          format="sealed"
          :compact="compact_deck_panel"
          :options="options"
          :deck="active_player.deck"
          :saved_decks="active_player.saved_decks"
          @togglecompact="onToggleCompactDeckPanel"
        />

      </div>

      <InfoBar 
        v-if="!isMobile" 
        :card_preview="card_preview" 
        :cards="active_cards" 
        class="user-select-none"
      />
   
    </div>

  </div>
</template>

<style>

.sealed-navbar .material-design-icon {
  cursor: pointer;
}

.sealed-navbar .navbar-text.pager-text {
  padding-left: 0;
  padding-right: 1px;
  min-width: 130px;
  text-align: center;
}

.sealed-navbar .pager-left {
  padding-left: 0.7rem;
  padding-right: 0.4rem;
}

.sealed-navbar .pager-right {
  padding-left: 0.4rem;
  padding-right: 0.7rem;
}

.sealed-navbar .pager {
  padding-top: 1px;
}

.sealed-navbar .filter-menu {
  padding-top: 0;
  padding-bottom: 0;
}

.draft-cards .deck-panel-toggle-leave-active {
  transition: padding-bottom 1s;
  padding-bottom: 32.1%;
}

.draft-cards .deck-panel-toggle-leave-to {
  padding-bottom: 0;
}

.draft-cards .deck-panel-toggle-enter-active {
  transition: padding-bottom 1s;
  padding-bottom: 0;
}

.draft-cards .deck-panel-toggle-enter-to {
  padding-bottom: 32.1%;
}



</style>