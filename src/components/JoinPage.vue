<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'

export default {
  name: 'JoinPage',

  props: {
    draft_id: {
      type: Object,
      required: true
    }
  },

  components: {
    NavBar, SiteFooter
  }
}

</script>

<template>
 
  <div>
    
  <NavBar />

  <div class="container">

  <div class="join-content">
  Join
  </div>

  <SiteFooter />

  </div>
    
  </div>

</template>


<style>

.join-content {
  min-height: 60vh;
}

</style>



