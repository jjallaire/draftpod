
<template>
  <span class="card">
    <img :src="card.imageUrl" />
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
.card img {
  padding-right: 3px;
  padding-top: 1px;
  width: 11.5%;
  height: auto;
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}



</style>

