
<template>

<div class="pile">
  <Card v-for="(card, index) in cards" :card="card" :key="card.key"
        v-bind:style="{left: 0, top: ((index+1)*15) + 'px'}">
  </Card>
</div>

</template>


<script>

import Card from './Card.vue';

export default {
  props: {
    cards: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Card
  }
};

</script>

<style>
.pile {
  position: relative;
  width: 11.5%;
}
.pile .card {
  position: absolute;
  max-width: 100%;
}

.pile .card img {
  max-width: 100%;
}
</style>