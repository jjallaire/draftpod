

<script>

import UiPanel from '@/components/core/UiPanel.vue'

export default {
  name: 'NavigatorPanel',
  props: {
    caption: {
      type: String,
      required: true
    },
  },

  components: {
    UiPanel
  }
}

</script>

<template>

  <UiPanel class="navigator-panel" :caption="caption" >
    <slot></slot>
  </UiPanel>

</template>

<style>

.navigator-panel .card-header .text-light {
  color: #aaa !important;
}

.navigator-panel .card-body {
  padding: 30px;
}


.navigator-panel .card-body button {
  min-width: 140px;
  color: #fff;
  opacity: 0.75;
}


</style>
