
<script>

import AlertIcon from "vue-material-design-icons/Alert.vue"
import CheckIcon from "vue-material-design-icons/Check.vue"

export default {

  name: 'CardpoolUploadStatus',

  props: {
    status: {
      type: Object,
      requred: true
    },
  },

  components: {
    AlertIcon, CheckIcon
  }

}

</script>

<template>

<div class="cardpool-upload-status">
  <div v-for="message in status.success" :key="message" class="text-success">
    <CheckIcon /> {{ message }}
  </div>
  <div v-for="message in status.error" :key="message" class="text-danger">
    <AlertIcon /> {{ message }}
  </div>
   <div v-for="message in status.warning" :key="message" class="text-warning">
    <AlertIcon /> {{ message }}
  </div>
</div>

</template>

<style>


</style>

