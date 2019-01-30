
<script>

import CheckIcon from "vue-material-design-icons/Check.vue"

import { uploadStatusEmpty } from './upload.js'

export default {

  name: 'CardpoolUploadStatus',

  components: {
    CheckIcon
  },

  props: {
    status: {
      type: Object,
      default: uploadStatusEmpty()
    },
  },

  computed: { 
    display() {
      if (this.status.success.length === 0 && 
          this.status.error.length === 0 &&
          this.status.warning.length === 0) {
        return 'none';
      } else {
        return 'initial';
      }
    }
  },

}

</script>

<template>

  <div 
    :style="{ display: display }" 
    class="cardpool-upload-status">
    <div 
      v-for="message in status.success" 
      :key="message" 
      class="text-success">
      <CheckIcon /> {{ message }}
    </div>
    <div 
      v-for="message in status.error" 
      :key="message" 
      class="text-danger">
      {{ message }}
    </div>
    <div 
      v-for="message in status.warning" 
      :key="message" 
      class="text-warning">
      {{ message }}
    </div>
  </div>

</template>

<style>

.cardpool-upload-status {
  padding-top: 5px;
  padding-bottom: 10px;
}

</style>

