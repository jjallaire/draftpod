

<script>
import Card from './Card.vue';

export default {
  name: 'Booster',
  props: {
    cards: Array
  },
  components: {
    Card
  },
}
</script>

<template>
  <div class="booster">
    <Card v-for="card in cards" :key="card.key" :card="card" :draggable="true"></Card>
  </div>
</template>


<style>

</style>

