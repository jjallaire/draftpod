
<script>


import Vue from 'vue'
import VueHotkey from 'v-hotkey'
Vue.use(VueHotkey);

import NavBar from '@/components/core/NavBar.vue'

import TableCore from '../table/TableCore.js'
import FullscreenButton from '../table/FullscreenButton.vue'
import InfoBar from '../infobar/InfoBar.vue'
import SealedPoolPanel from '../sealed/SealedPoolPanel.vue'
import DeckPanel from '../deck/DeckPanel.vue'

import { DECK } from '../../../store/modules/draft/constants'

import _orderBy from 'lodash/orderBy'
import LeftIcon from 'vue-material-design-icons/ChevronLeftBox.vue'
import RightIcon from 'vue-material-design-icons/ChevronRightBox.vue'
import FilterIcon from 'vue-material-design-icons/FilterVariant.vue'
import SealedFilterPopup from './SealedFilterPopup.vue'

const kCardsPerPage = 16;

export default {
  name: 'SealedTable',

  components: { NavBar, FullscreenButton, InfoBar, SealedPoolPanel, DeckPanel,
                LeftIcon, RightIcon, FilterIcon, SealedFilterPopup },

  mixins: [TableCore],

  data: function() {
    return {
      page_index: 0,
      compact_deck_panel: true,
    }
  },



  computed: {
    
    pool: function() {
      return this.active_player.deck.piles[DECK.UNUSED];
    },

    pool_sorted: function() {
      return _orderBy(this.pool, ["collector_number"], ["asc"]);
    },

    page_cards: function() {
      let start = this.page_index * kCardsPerPage;
      return this.pool_sorted.slice(start, start + kCardsPerPage);
    },

    page_caption: function() {
      let total = this.pool_sorted.length;
      let first = (this.page_index * kCardsPerPage) + 1;
      let last = Math.min(first + kCardsPerPage - 1, total);
      return `${first} - ${last} of ${total} cards`;
    },


    keymap: function() {
      return {
        'left': () => {
          this.onPreviousClick();
        },
        'right': () => {
          this.onNextClick();
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
      if (next_start < this.pool.length)
        this.page_index = this.page_index + 1;
    },

    onToggleCompactDeckPanel() {
      this.compact_deck_panel = !this.compact_deck_panel;
    },
   
  },

}

</script>


<template>
  <div>
    <NavBar class="sealed-navbar">

     
      <span class="navbar-text">
        {{ set.name }} &mdash; Sealed
      </span> 
     
      <ul class="navbar-nav">
        <LeftIcon class="pager pager-left" title="Previous (Left Arrow)" @click.native="onPreviousClick" /> 
      </ul>
      <span class="navbar-text pager-text">
        {{ page_caption }} 
      </span>
      <ul class="navbar-nav">
        <RightIcon class="pager pager-right" title="Next (Right Arrow)" @click.native="onNextClick" />
      </ul>

      <ul class="navbar-nav">
        <li class="nav-item">
          <div class="dropdown">
            <a 
              id="filterMenuLink" 
              href="#" 
              class="nav-link icon-link dropdown-toggle" 
              title="Filter" 
              data-toggle="dropdown" 
              aria-haspopup="true" 
              aria-expanded="false"
            >
              <FilterIcon /> Filter
            </a>
            <div 
              class="dropdown-menu filter-menu" 
              aria-labelledby="filterMenuLink"
            >
              <SealedFilterPopup />
            </div>
          </div>
        </li>
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
  min-width: 140px;
  text-align: center;
}

.sealed-navbar .pager-right {
  padding-right: 1rem;
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