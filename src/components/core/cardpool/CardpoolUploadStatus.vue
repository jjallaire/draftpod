
<script>

import AlertIcon from "vue-material-design-icons/Alert.vue"
import CheckIcon from "vue-material-design-icons/Check.vue"

export default {

  name: 'CardpoolUploadStatus',


  components: {
    AlertIcon, CheckIcon
  }

}

</script>

<template>

<div>
  <div>
    <CheckIcon /> 456 cards uploaded
  </div>
  <div class="text-danger">
    <AlertIcon /> 456 cards uploaded
  </div>
</div>

</template>

<style>

</style>

