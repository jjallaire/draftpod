
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
  <div v-if="status.success">
    <CheckIcon /> {{ status.success }}
  </div>
  <div v-if="status.alert" class="text-danger">
    <AlertIcon /> {{ status.alert }}
  </div>
</div>

</template>

<style>

</style>

