
<script>

import { SimpleSVG } from 'vue-simple-svg'

export default {
  name: 'SetIcon',

  props: {
    set_code: {
      type: String,
      required: false
    },
  },

  components: {
    'simple-svg': SimpleSVG
  }
}

</script>


<template>
  <simple-svg :filepath="'/sets/' + set_code + '/icon.svg'"/>
</template>


<style>

</style>
