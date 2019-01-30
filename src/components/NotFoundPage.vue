<script>

import ErrorPage from './core/ErrorPage.vue'

export default {
  name: 'NotFoundPage',

  components: {
    ErrorPage
  },

  computed: {
    page_url: function() {
      return window.location.href;
    }
  },
}

</script>

<template>
  <ErrorPage title="404: Page Not Found">
    {{ page_url }}
  </ErrorPage>
</template>

<style>

</style>



