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
   <div class="row">
   <div class="col-sm-10">
   <h2>Draft Not Found</h2>
   <br/>
   <h5>The requested draft (id: {{ draft_id }}) was not found.</h5>
   <br/>
   <p>Some reasons that this may have occurred:</p>
    <ul>
      <li>You are attempting to join a multi-player draft, however your internet connection is offline. Please ensure
        that you are connected, then try <a :href="'/draft/' + draft_id">navigating to the draft</a> again.
      </li>
      <li>The draft is no longer available in your draft history (draftpod only saves
          your last 10 drafts).
      </li>
    </ul>

  <br/>

  <a href="/draft/">Return to main draft page</a>

  <SiteFooter />

  </div>


  </div>
  </div>
  </div>  
  </div>

</template>


<style>

.not-found-content {
  min-height: 70vh;
}

.not-found-content a {
  color: #d9d9d9;
}


.not-found-content li {
  margin-bottom: 10px;
}

</style>



