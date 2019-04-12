
<script>


import NavBar from '@/components/core/NavBar.vue'

import TableCore from '../table/TableCore.js'
import ExitButton from './ExitButton.vue'
import FullscreenButton from './FullscreenButton.vue'


export default {
  name: 'SealedTable',

  components: { NavBar, ExitButton, FullscreenButton },

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

    <div class="sealed-page container">
      {{ draft_id }}
    </div>
  </div>
</template>

<style>

</style>