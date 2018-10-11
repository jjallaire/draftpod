
<template>
  <span class="card">
    <img v-bind:src="card.imageUrl" width=150/>
  </span>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: Object
  }
}
</script>

<style>

</style>

