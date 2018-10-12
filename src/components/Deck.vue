

<template>
  <div class="deck">
    <Card v-for="card in cards" :card="card" :key="card.key"></Card>
  </div>
</template>

<script>

import Card from './Card.vue';

export default {
  name: 'Deck',
  props: {
    cards: Array
  },
  components: {
    Card
  },
}

</script>

<style>
.deck {
  margin-top: 10px;
  padding-top: 10px;
  min-height: 400px;
  border-top: 1px solid;
}
</style>

