<script>

export default {
  name: 'FirebaseError',

  props: {
    error: {
      type: Object,
      required: true
    }
  }
}

</script>


<template>

<div class="firebase-error">
  <h2>Draftpod Connection Error</h2>
  <h5>An error occurred while attempting to connect to the draftpod server:</h5> 
  <div class="alert alert-primary">
    <p>{{ error.name }} ({{ error.code }})</p>
    <p>{{ error.message }}</p>
  </div>
  <p v-if="error.code === 'unavailable'">
    Please be sure that your internet connection is online before joining the draft.
  </p>
</div>


</template>

<style>

.firebase-error h2,
.firebase-error h5 {
  margin-bottom: 20px;
}

</style>