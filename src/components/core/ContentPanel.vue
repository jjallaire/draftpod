

<script>

import UiPanel from '@/components/core/UiPanel.vue'

export default {
  name: 'ContentPanel',
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

  <UiPanel class="content-panel" :caption="caption" >
    <slot></slot>
  </UiPanel>

</template>

<style>

.content-panel {
  margin-bottom: 35px;
}

.content-panel .btn {
  padding-left: 20px;
  padding-right: 20px;
  min-width: 160px;
  border: 0;
}

.content-panel .form-check {
  margin-top: 10px;
}

.content-panel .card-header .text-light {
  color: #aaa !important;
}

.content-panel .card-body {
  padding: 30px;
}

.content-panel .card-body select {
  background-color: rgb(236,236,236);
}


.content-panel .card-body button {
  min-width: 140px;
  color: #fff;
  opacity: 0.75;
}


</style>
