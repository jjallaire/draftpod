

<template>
  <div class="booster">
    <Card v-for="card in cards" :key="card.key" :card="card" 
          :drag_source="drag_source">
    </Card>
  </div>
</template>


<script>
import Card from './Card.vue';
import { DRAG_SOURCE_BOOSTER } from './constants'

export default {
  name: 'Booster',
  props: {
    cards: Array
  },
  computed: {
    drag_source: () => DRAG_SOURCE_BOOSTER
  },
  components: {
    Card
  },
}
</script>

<style>
.booster .card img {
  width: 11.5%;
  height: auto;
}
</style>

