
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


<template>
  <simple-svg :filepath="'/sets/' + set_code + '/icon.svg'" class="mtgdraft-simple-svg"/>
</template>


<style>

</style>
