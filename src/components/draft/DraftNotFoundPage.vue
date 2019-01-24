<script>

import ErrorPage from '../core/ErrorPage.vue'

export default {
  name: 'DraftNotFoundPage',

  props: {
    draft_id: {
      type: String,
      required: true
    }
  },

  components: {
    ErrorPage
  }
}

</script>

<template>
 
  <ErrorPage title="Draft Not Found">
    <h5>The requested draft (id={{ draft_id }}) was not found.</h5>
    <br/>
    <p>
      This may have occurred because the draft you are requesting belongs to another player (draftpod URLs cannot be shared 
      between different players).
    </p>
    <p>
      This also may have occurred because the draft is no longer available in your history (draftpod only saves
      your last 10 drafts).
    </p>
     
  </ErrorPage>
  
</template>


<style>

</style>



