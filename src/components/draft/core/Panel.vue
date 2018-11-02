<template>
  <div :class="[panel_class, 'card', 'bg-' + background]">
    <div v-if="caption" class="card-header">
      <div class="header-text">{{ caption }}</div>
      <div class="float-right"><slot name="header"></slot></div>
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
    background: {
      type: String,
      default: 'light'
    }
  }
}

</script>


<style>

.mtgdraft .card .card-header div {
    display: inline-block;
}

</style>