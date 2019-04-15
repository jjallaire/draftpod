
<script>


import Vue from 'vue'
import VueHotkey from 'v-hotkey'
Vue.use(VueHotkey);

import NavBar from '@/components/core/NavBar.vue'

import TableCore from '../table/TableCore.js'
import ExitButton from '../table/ExitButton.vue'
import FullscreenButton from '../table/FullscreenButton.vue'
import InfoBar from '../infobar/InfoBar.vue'
import SealedPoolPanel from '../sealed/SealedPoolPanel.vue'
import DeckPanel from '../deck/DeckPanel.vue'

import { DECK } from '../../../store/modules/draft/constants'

import _orderBy from 'lodash/orderBy'
import LeftIcon from 'vue-material-design-icons/ChevronLeftBox.vue'
import RightIcon from 'vue-material-design-icons/ChevronRightBox.vue'

const kCardsPerPage = 16;

export default {
  name: 'SealedTable',

  components: { NavBar, ExitButton, FullscreenButton, InfoBar, SealedPoolPanel, DeckPanel,
                LeftIcon, RightIcon },

  mixins: [TableCore],

  data: function() {
    return {
      page_index: 0
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
    }
   
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
        <LeftIcon class="pager-left" title="Previous (Left Arrow)" @click.native="onPreviousClick" /> 
      </ul>
      <span class="navbar-text pager-text">
        {{ page_caption }} 
      </span>
       <ul class="navbar-nav">
        <RightIcon class="pager-right" title="Next (Right Arrow)" @click.native="onNextClick" />
      </ul>

      <ul class="navbar-nav">
        <ExitButton @clicked="onExitDraft" />
  
        <FullscreenButton 
          v-if="fullscreenEnabled" 
          :fullscreen="fullscreen" 
          @clicked="onFullscreenToggle"
        />
      </ul>
    </NavBar> 

    <div :class="{ 'draft-page': true, 'mobile': isMobile, 'phone': isPhone, 'tablet': isTablet }">
      <div v-hotkey="keymap" class="draft-cards user-select-none">
        <SealedPoolPanel
          :cards="page_cards"
        />

        <DeckPanel 
          :set="set" 
          format="sealed"
          :compact="true"
          :options="options"
          :deck="active_player.deck"
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
  padding-left: 6px;
  padding-right: 6px;
}

.sealed-navbar .pager-right {
  padding-right: 1rem;
}

</style>