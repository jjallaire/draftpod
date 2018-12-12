
<script>

import CheckIcon from "vue-material-design-icons/Check.vue"

export default {

  name: 'CardpoolUploadStatus',

  props: {
    status: {
      type: Object,
      requred: true
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

  components: {
    CheckIcon
  }

}

</script>

<template>

<div class="cardpool-upload-status" :style="{ display: display }">
  <div v-for="message in status.success" :key="message" class="text-success">
    <CheckIcon /> {{ message }}
  </div>
  <div v-for="message in status.error" :key="message" class="text-danger">
    {{ message }}
  </div>
   <div v-for="message in status.warning" :key="message" class="text-warning">
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

