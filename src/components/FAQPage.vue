<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'

export default {
  name: 'FAQPage',

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
  
  <h1>Frequently Asked Questions</h1>

  <h4>What is draftpod?</h4>

  <h4>What's the best way to build a set cube?</h4>

  <h4>How can I get better at drafting?</h4>

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



