

<template>
  <div class="booster">
    <Card v-for="card in cards" :key="card.key" :card="card" drag_source="booster"></Card>
  </div>
</template>


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

<style>

</style>

