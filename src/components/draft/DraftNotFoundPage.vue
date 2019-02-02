<script>

import ErrorPage from '../core/ErrorPage.vue'

export default {
  name: 'DraftNotFoundPage',

  components: {
    ErrorPage
  },

  props: {
    draft_id: {
      type: String,
      required: true
    }
  },

  computed: {
    draft_url: function() {
      return window.location.protocol + "//" + window.location.host + 
             "/draft/" + this.draft_id;
    }
  },
}

</script>

<template>
  <ErrorPage title="Draft Not Found">
    <h5>The requested draft was not found.</h5>
    <br>
    <p>
      The draft URL you requested (<a :href="draft_url">{{ draft_url }}</a>) may not refer to a valid draft.
    </p>

    <p>
      This error also may have occurred because the draft you are requesting belongs to another player (Draftpod URLs cannot be shared 
      between different players).
    </p>
    <p>
      Another possibility is that draft is no longer available in your history (Draftpod only saves
      your last 10 drafts).
    </p>
  </ErrorPage>
</template>


<style>

</style>



