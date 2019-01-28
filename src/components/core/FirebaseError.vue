<script>

import firestore from '@/store/modules/draft/firestore'

export default {
  name: 'FirebaseError',

  props: {
    error: {
      type: Object,
      required: true
    }
  },

  methods: {
    isConnectivityError(error) {
      return firestore.isConnectivityError(error);
    }
  }
}

</script>


<template>

<div class="firebase-error">
  <h2>Connection Error</h2>
  <h5>An error occurred while attempting to connect to the draftpod server:</h5> 
  <div class="alert alert-primary">
    <p>{{ error.name }} ({{ error.code }})</p>
    <p>{{ error.message }}</p>
  </div>
  <p v-if="isConnectivityError(error)">
    Please be sure that your internet connection is online before continuing.
  </p>
</div>


</template>

<style>

.firebase-error h2,
.firebase-error h5 {
  margin-bottom: 20px;
}

</style>