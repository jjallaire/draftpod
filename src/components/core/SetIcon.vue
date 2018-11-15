

<template>
  <simple-svg :filepath="'/sets/' + set_code + '/icon.svg'"/>
</template>

<script>

import Vue from 'vue'
import { SimpleSVG } from 'vue-simple-svg'
Vue.component('simple-svg', SimpleSVG);

export default {
  name: 'Panel',

  props: {
    set_code: {
      type: String,
      required: false
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },

  components: {
    SimpleSVG
  }
}

</script>

<style>

</style>
