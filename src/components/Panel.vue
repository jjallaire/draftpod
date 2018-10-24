<template>
  <div :class="[panel_class, 'card', 'bg-' + background]">
    <div v-if="caption" class="card-header">{{ caption }}</div>
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
    background: {
      type: String,
      default: 'light'
    }
  }
}

</script>


<style>

</style>