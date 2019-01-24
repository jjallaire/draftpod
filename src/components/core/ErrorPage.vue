<script>

import NavBar from './NavBar.vue'
import SiteFooter from './SiteFooter.vue'

export default {
  name: 'ErrorPage',

  props: {
    title: {
      type: String,
      required: true
    }
  },

  components: {
    NavBar, SiteFooter
  }
}

</script>

<template>
 
  <div class="error-page">
    
  <NavBar />

  <div class="container">
  <div class="row">
  <div class="col-sm-10">

  <h2>{{ title }}</h2>
  
  <div class="error-content">
  <slot></slot>
  </div>

  <SiteFooter />

  </div>
  </div>
  </div>
  </div>

</template>


<style>

.error-page h2 {
  margin-bottom: 30px;
}

.error-page a {
  color: #d9d9d9;
}

.error-page .error-content {
  min-height: 60vh;
}

.error-page .error-content li {
  margin-bottom: 10px;
}

</style>



