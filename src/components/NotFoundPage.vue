<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'

export default {
  name: 'NotFoundPage',

  computed: {
    page_url: function() {
      return window.location.href;
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

  <div class="not-found-content">
   <h3>404: Page Not Found</h3>
   {{ page_url }}
  </div>

  <SiteFooter />

  </div>
    
  </div>

</template>


<style>

.not-found-content {
  min-height: 70vh;
}

</style>



