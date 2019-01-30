<template>
  <div class="card">
    <div 
      v-if="caption" 
      class="card-header">
      <div class="float-left header-text text-light">{{ caption }}</div>
      <div class="float-left"><slot name="header-left"/></div>
      <div class="float-right"><slot name="header-right"/></div>
    </div>
    <div class="card-body">
      <slot/>
    </div>
  </div>
</template>


<script>

export default {
  name: 'UiPanel',

  props: {
    caption: {
      type: String,
      default: null
    },
  }
}

</script>


<style>

.card .card-header div {
  display: inline-block;
}

</style>