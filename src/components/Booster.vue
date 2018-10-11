

<template>
    <div class="booster">
       <Card v-for="card in cards" :card="card" :key="card.multiverseid"></Card>
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
.booster .card {
    padding-right: 4px;
    padding-top: 1px;
}
</style>

