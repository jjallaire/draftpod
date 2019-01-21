<script>

import NavBar from '../core/NavBar.vue'
import SiteFooter from '../core/SiteFooter.vue'

export default {
  name: 'DraftNotFoundPage',

  props: {
    draft_id: {
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
 
  <div>
    
  <NavBar />

  <div class="container">

  <div class="not-found-content">
   <h2>Draft Not Found</h2>
   <br/>
   <h5>The requested draft (id: {{ draft_id }}) was not found.</h5>
   <br/>
   <p>Some reasons that this error may have occurred:</p>
    <ul>
      <li>The draft is no longer available in your draft history (draftpod only saves
          your last 5 drafts).
      </li>
      <li>You are attempting to join a multi-player draft however your internet connection is offline.</li>
    </ul>

  <br/>
  <a href="/draft/">Return to main draft page</a>
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



