

<template>
  <simple-svg :filepath="'/sets/' + set_code + '/icon.svg'"/>
</template>

<script>

import { SimpleSVG } from 'vue-simple-svg'

export default {
  name: 'Panel',

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

<style>

</style>
