

<template>
  <div class="booster">
    <Card v-for="card in booster" :key="card.key" :card="card" 
          :drag_source="drag_source">
    </Card>
  </div>
</template>

<script>
import Card from './Card.vue';
import { mapState } from 'vuex';
import { DRAG_SOURCE_BOOSTER } from './constants'

export default {
  name: 'Booster',
  props: {
    cards: Array
  },
  computed: {
    drag_source: () => DRAG_SOURCE_BOOSTER,
    ...mapState([
      'booster',
    ]),
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

