
<script>


import NavBar from '@/components/core/NavBar.vue'

import TableCore from '../table/TableCore.js'
import ExitButton from './ExitButton.vue'
import FullscreenButton from './FullscreenButton.vue'
import InfoBar from '../infobar/InfoBar.vue'
import DeckPanel from '../deck/DeckPanel.vue'


export default {
  name: 'SealedTable',

  components: { NavBar, ExitButton, FullscreenButton, InfoBar, DeckPanel },

  mixins: [TableCore],

  data: function() {
    return {

    }
  },

  computed: {
    
  },

  created() {
    this.resumeDraft();
  },

  methods: {

   
  },

}


</script>


<template>
  <div>
    <NavBar>
      <span class="navbar-text">
        {{ set.name }} &mdash; Sealed
      </span> 
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
      <div class="draft-cards user-select-none">
        <DeckPanel 
          :set="set" 
          format="sealed"
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

</style>