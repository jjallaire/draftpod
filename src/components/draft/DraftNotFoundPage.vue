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
  }
}

</script>

<template>
  <ErrorPage title="Game Not Found">
    <h5>The requested game was not found.</h5>
    <br>
    <p>
      The game ID you requested (<em>{{ draft_id }}</em>) may not be valid.
    </p>

    <p>
      This error may have occurred because the game you are requesting belongs to another player (game URLs cannot be shared 
      between different players).
    </p>
    <p>
      Another possibility is that the game is no longer available in your history (only your last 10 games are saved).
    </p>
  </ErrorPage>
</template>


<style>

</style>



