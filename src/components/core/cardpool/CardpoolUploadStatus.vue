
<script>

import AlertIcon from "vue-material-design-icons/Alert.vue"
import CheckIcon from "vue-material-design-icons/Check.vue"

export default {

  name: 'CardpoolUploadStatus',

  props: {
    success: {
      type: String,
      default: null
    },
    alert: {
      type: String,
      default: null
    }
  },

  components: {
    AlertIcon, CheckIcon
  }

}

</script>

<template>

<div>
  <div v-if="success">
    <CheckIcon /> {{ success }}
  </div>
  <div v-if="alert" class="text-danger">
    <AlertIcon /> {{ alert }}
  </div>
</div>

</template>

<style>

</style>

