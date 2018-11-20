<template>
  <div class="card" :class="panel_class">
    <div v-if="caption" class="card-header">
      <div class="float-left header-text text-light">{{ caption }}</div>
      <div class="float-left"><slot name="header-left"></slot></div>
      <div class="float-right"><slot name="header-right"></slot></div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>


<script>

export default {
  name: 'Panel',

  props: {
    caption: {
      type: String,
      required: false
    },
    panel_class: {
      type: String,
      required: true
    },
  }
}

</script>


<style>

.mtgdraft .card .card-header div {
  display: inline-block;
}

</style>