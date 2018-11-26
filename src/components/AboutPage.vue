<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'

export default {
  name: 'About',

  components: {
    NavBar, SiteFooter
  }
}

</script>

<template>
 
  <div>
    
  <NavBar />

  <div class="container">

  <div class="about-content">
  About
  </div>

  <SiteFooter />

  </div>
    
  </div>

</template>


<style>

.about-content {
  min-height: 70vh;
}

</style>



