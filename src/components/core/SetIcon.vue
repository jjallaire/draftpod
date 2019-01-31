
<script>

import { SimpleSVG } from 'vue-simple-svg'

export default {
  name: 'SetIcon',

  components: {
    'simple-svg': SimpleSVG
  },

  props: {
    set_code: {
      type: String,
      required: true
    },
  },
}

</script>


<template>
  <simple-svg :filepath="'/sets/' + set_code + '/icon.svg'" />
</template>


<style>

</style>
