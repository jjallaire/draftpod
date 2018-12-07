
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

<div>
  <div v-for="message in status.success" :key="message">
    <CheckIcon /> {{ message }}
  </div>
  <div v-for="message in status.alert" :key="message" class="text-danger">
    <AlertIcon /> {{ message }}
  </div>
</div>

</template>

<style>

</style>

